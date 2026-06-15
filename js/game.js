(function () {
  "use strict";

  const FAILURE_ENDINGS = new Set(["give_up", "sanity_break", "infinite_loop"]);

  function unique(values) {
    return Array.from(new Set(values || []));
  }

  function createFreshState(carry) {
    const startRoom = window.GAME_DATA.roomMap[window.GAME_DATA.startingRoom];
    const state = {
      version: window.GAME_DATA.version,
      phase: "playing",
      currentRoom: startRoom.id,
      endingId: null,
      patience: 100,
      narrator: {
        affinity: 20,
        anger: 8,
        control: 50
      },
      flags: {
        hiddenDefyUnlocked: false,
        hiddenObeyUnlocked: false,
        seenCore: false,
        loopTouches: 0
      },
      streaks: {
        defy: 0,
        obey: 0
      },
      visits: {
        [startRoom.id]: 1
      },
      path: [
        {
          roomId: startRoom.id,
          roomName: startRoom.name,
          doorLabel: ""
        }
      ],
      narration: [],
      log: ["游戏开始。旁白清了清嗓子，像一份会说话的免责声明。"],
      stats: {
        choices: 0,
        deaths: carry?.stats?.deaths || 0,
        mockery: carry?.stats?.mockery || 0,
        fakeEvents: carry?.stats?.fakeEvents || 0,
        endingsFound: unique(carry?.stats?.endingsFound)
      },
      achievements: unique(carry?.achievements)
    };

    state.narration = [window.Narrator.roomLine(startRoom, state)];
    return state;
  }

  function createMenuState(carry) {
    return {
      version: window.GAME_DATA.version,
      phase: "menu",
      currentRoom: window.GAME_DATA.startingRoom,
      endingId: null,
      patience: 100,
      narrator: {
        affinity: 20,
        anger: 8,
        control: 50
      },
      flags: {
        hiddenDefyUnlocked: false,
        hiddenObeyUnlocked: false,
        seenCore: false,
        loopTouches: 0
      },
      streaks: {
        defy: 0,
        obey: 0
      },
      visits: {},
      path: [],
      narration: [],
      log: [],
      stats: {
        choices: 0,
        deaths: carry?.stats?.deaths || 0,
        mockery: carry?.stats?.mockery || 0,
        fakeEvents: carry?.stats?.fakeEvents || 0,
        endingsFound: unique(carry?.stats?.endingsFound)
      },
      achievements: unique(carry?.achievements)
    };
  }

  function normalizeState(state) {
    if (!state || !state.currentRoom || !window.GAME_DATA.roomMap[state.currentRoom]) {
      return null;
    }

    const normalized = createFreshState(state);
    Object.assign(normalized, state);
    normalized.narrator = Object.assign({ affinity: 20, anger: 8, control: 50 }, state.narrator || {});
    normalized.flags = Object.assign(
      { hiddenDefyUnlocked: false, hiddenObeyUnlocked: false, seenCore: false, loopTouches: 0 },
      state.flags || {}
    );
    normalized.streaks = Object.assign({ defy: 0, obey: 0 }, state.streaks || {});
    normalized.visits = state.visits || {};
    normalized.path = state.path || [];
    normalized.narration = state.narration || [];
    normalized.log = state.log || [];
    normalized.stats = Object.assign(
      { choices: 0, deaths: 0, mockery: 0, fakeEvents: 0, endingsFound: [] },
      state.stats || {}
    );
    normalized.stats.endingsFound = unique(normalized.stats.endingsFound);
    normalized.achievements = unique(state.achievements);
    return normalized;
  }

  const Game = {
    state: null,
    audioEnabled: true,
    pendingDisturbance: null,

    init() {
      window.UI.init();
      this.state = createMenuState(window.SaveSystem.load());
      this.bindStaticActions();
      this.render();
      window.AudioDirector.startMusic("menu");
    },

    bindStaticActions() {
      document.getElementById("newGameButton").addEventListener("click", () => {
        this.click();
        this.startNew(true);
      });

      document.getElementById("continueButton").addEventListener("click", () => {
        this.click();
        this.continueGame();
      });

      document.getElementById("clearSaveButton").addEventListener("click", () => {
        this.click();
        window.SaveSystem.clear();
        this.state = createMenuState();
        this.render();
        this.addTemporaryMenuNotice("存档已清除。旁白表示它会假装没记住。");
      });

      document.getElementById("restartButton").addEventListener("click", () => {
        this.click();
        this.startNew(true);
      });

      document.getElementById("endingRestartButton").addEventListener("click", () => {
        this.click();
        this.startNew(true);
      });

      document.getElementById("endingMenuButton").addEventListener("click", () => {
        this.click();
        this.showMenu();
      });

      document.getElementById("audioToggle").addEventListener("click", () => {
        this.audioEnabled = !this.audioEnabled;
        window.AudioDirector.setEnabled(this.audioEnabled);
        this.updateAudioButton();
      });

      document.addEventListener(
        "pointerdown",
        () => {
          if (this.audioEnabled) {
            window.AudioDirector.unlock();
            window.AudioDirector.startMusic(window.Narrator.musicMode(this.state));
          }
        },
        { once: true }
      );
    },

    addTemporaryMenuNotice(text) {
      const menu = document.querySelector(".menu-copy p:last-child");
      if (!menu) {
        return;
      }
      const oldText = menu.textContent;
      menu.textContent = text;
      window.setTimeout(() => {
        menu.textContent = oldText;
      }, 1600);
    },

    click() {
      window.AudioDirector.playSfx("button");
    },

    updateAudioButton() {
      document.getElementById("audioToggle").textContent = this.audioEnabled ? "声音：开" : "声音：关";
    },

    collectCarry() {
      const saved = normalizeState(window.SaveSystem.load());
      const source = this.state || saved || {};
      const savedStats = saved?.stats || {};
      const sourceStats = source.stats || {};
      return {
        stats: {
          deaths: Math.max(savedStats.deaths || 0, sourceStats.deaths || 0),
          mockery: Math.max(savedStats.mockery || 0, sourceStats.mockery || 0),
          fakeEvents: Math.max(savedStats.fakeEvents || 0, sourceStats.fakeEvents || 0),
          endingsFound: unique([...(savedStats.endingsFound || []), ...(sourceStats.endingsFound || [])])
        },
        achievements: unique([...(saved?.achievements || []), ...(source.achievements || [])])
      };
    },

    startNew(preserveMeta) {
      const carry = preserveMeta ? this.collectCarry() : {};
      this.pendingDisturbance = null;
      this.state = createFreshState(carry);
      this.checkAchievements();
      window.SaveSystem.save(this.state);
      this.render();
      this.syncAudio();
      window.AudioDirector.playSfx("narrator");
    },

    continueGame() {
      const loaded = normalizeState(window.SaveSystem.load());
      if (!loaded) {
        this.startNew(false);
        return;
      }
      this.state = loaded;
      this.render();
      this.syncAudio();
      if (this.state.phase === "playing") {
        window.AudioDirector.playSfx("narrator");
      }
    },

    showMenu() {
      this.state = createMenuState(this.collectCarry());
      this.pendingDisturbance = null;
      this.render();
      window.AudioDirector.startMusic("menu");
    },

    getAvailableDoors() {
      if (!this.state || this.state.phase !== "playing") {
        return [];
      }

      const room = window.GAME_DATA.roomMap[this.state.currentRoom];
      const doors = room.doors.filter((door) => this.passesCondition(door.condition));

      if (this.state.flags.hiddenDefyUnlocked && room.id !== "white_room") {
        doors.push({
          id: "global_hidden_ignore_gate",
          label: "没有标签的门",
          note: "旁白说：没有这扇门。你看错了。请把眼睛交给我校准。",
          to: "white_room",
          recommended: false,
          hidden: true,
          patience: -1,
          effects: { affinity: -3, anger: 12, control: -18 },
          narration: ["你走向没有标签的门。旁白用沉默表现出非常吵闹的不满。"]
        });
      }

      if (this.state.flags.hiddenObeyUnlocked) {
        doors.push({
          id: "global_hidden_obey_gate",
          label: "金边门：交出选择权",
          note: "旁白说：终于。你只需要点一下，剩下的我会替你都选好。",
          end: "hidden_obey",
          recommended: true,
          hidden: true,
          patience: 5,
          effects: { affinity: 8, anger: -8, control: 22 },
          narration: ["你走向金边门。旁白的声音温柔得像一份格式合同。"]
        });
      }

      return doors;
    },

    passesCondition(condition) {
      if (!condition) {
        return true;
      }
      if (condition === "defyUnlocked") {
        return this.state.flags.hiddenDefyUnlocked;
      }
      if (condition === "seenCore") {
        return this.state.flags.seenCore;
      }
      return false;
    },

    chooseDoor(doorId) {
      if (!this.state || this.state.phase !== "playing") {
        return;
      }

      const door = this.getAvailableDoors().find((candidate) => candidate.id === doorId);
      if (!door) {
        return;
      }

      window.AudioDirector.playSfx("door");
      window.setTimeout(() => window.AudioDirector.playSfx("footstep"), 120);

      const room = window.GAME_DATA.roomMap[this.state.currentRoom];
      const lines = [];
      this.state.stats.choices += 1;

      if (door.recommended === true) {
        this.state.streaks.obey += 1;
        this.state.streaks.defy = 0;
      } else if (door.recommended === false) {
        this.state.streaks.defy += 1;
        this.state.streaks.obey = 0;
        this.state.stats.mockery += 1;
      } else {
        this.state.streaks.defy = 0;
        this.state.streaks.obey = 0;
      }

      window.Narrator.adjustNarrator(this.state, door);
      this.state.patience = window.Narrator.clamp(this.state.patience + (door.patience || 0), -20, 100);
      lines.push(...window.Narrator.choiceLine(door, this.state));

      if (door.flag === "seenCore") {
        this.state.flags.seenCore = true;
      }

      if (door.flag === "loopTouch") {
        this.state.flags.loopTouches += 1;
      }

      if (this.state.streaks.defy >= 3 && !this.state.flags.hiddenDefyUnlocked) {
        this.state.flags.hiddenDefyUnlocked = true;
        lines.push(window.Narrator.unlockLine("defy"));
      }

      if (this.state.streaks.obey >= 5 && !this.state.flags.hiddenObeyUnlocked) {
        this.state.flags.hiddenObeyUnlocked = true;
        lines.push(window.Narrator.unlockLine("obey"));
      }

      this.addLog(`${room.name} -> ${door.label}`);
      this.state.path.push({
        roomId: room.id,
        roomName: room.name,
        doorLabel: door.label
      });

      if (this.state.patience <= 0) {
        this.finish("sanity_break", lines);
        return;
      }

      if (door.end) {
        this.finish(door.end, lines);
        return;
      }

      if (this.state.flags.loopTouches >= 3) {
        lines.push("循环次数足够多了。桥、等待室和旁白达成一致：把你留在重复里最省事。");
        this.finish("infinite_loop", lines);
        return;
      }

      if (door.to && window.GAME_DATA.roomMap[door.to]) {
        this.state.currentRoom = door.to;
        this.state.visits[door.to] = (this.state.visits[door.to] || 0) + 1;
        const nextRoom = window.GAME_DATA.roomMap[door.to];
        lines.push(window.Narrator.roomLine(nextRoom, this.state));
      }

      this.state.narration = lines;
      this.checkAchievements(lines);
      this.rollDisturbance(lines);
      window.SaveSystem.save(this.state);
      this.render();
      this.syncAudio();
      window.AudioDirector.playSfx("narrator");
      window.AudioDirector.playSfx(door.recommended === true ? "correct" : "wrong");

      if (this.pendingDisturbance) {
        window.UI.triggerDisturbance(this.pendingDisturbance.type, this.pendingDisturbance.text);
        window.AudioDirector.playSfx("glitch");
        this.pendingDisturbance = null;
      }
    },

    finish(endingId, lines) {
      const ending = window.GAME_DATA.endings[endingId];
      if (!ending) {
        return;
      }

      this.state.phase = "ending";
      this.state.endingId = endingId;
      this.state.narration = [...(lines || []), window.Narrator.endingLine(ending, this.state)];

      if (!this.state.stats.endingsFound.includes(endingId)) {
        this.state.stats.endingsFound.push(endingId);
      }

      if (FAILURE_ENDINGS.has(endingId)) {
        this.state.stats.deaths += 1;
      }

      this.state.path.push({
        roomId: endingId,
        roomName: `结局：${ending.title}`,
        doorLabel: ""
      });
      this.addLog(`抵达结局：${ending.title}`);
      this.checkAchievements(this.state.narration);
      window.SaveSystem.save(this.state);
      this.render();
      this.syncAudio();
      window.AudioDirector.playSfx("narrator");
      window.AudioDirector.playSfx("ending");
    },

    addLog(line) {
      this.state.log.push(line);
      if (this.state.log.length > 80) {
        this.state.log.shift();
      }
    },

    checkAchievements(lines) {
      const checks = [
        ["first_choice", this.state.stats.choices >= 1],
        ["three_defy", this.state.streaks.defy >= 3 || this.state.flags.hiddenDefyUnlocked],
        ["five_obey", this.state.streaks.obey >= 5 || this.state.flags.hiddenObeyUnlocked],
        ["core_seen", this.state.flags.seenCore],
        ["mocked_ten", this.state.stats.mockery >= 10],
        ["first_ending", this.state.stats.endingsFound.length >= 1],
        ["four_endings", this.state.stats.endingsFound.length >= 4],
        ["all_endings", this.state.stats.endingsFound.length >= 8]
      ];

      checks.forEach(([id, passed]) => {
        if (passed && !this.state.achievements.includes(id)) {
          this.state.achievements.push(id);
          this.addLog(`成就解锁：${this.achievementTitle(id)}`);
          if (lines) {
            lines.push(window.Narrator.achievementLine());
          }
          window.AudioDirector.playSfx("achievement");
        }
      });
    },

    achievementTitle(id) {
      const achievement = window.GAME_DATA.achievements.find((item) => item.id === id);
      return achievement ? achievement.title : id;
    },

    rollDisturbance(lines) {
      const pressure = (this.state.narrator.anger + (100 - this.state.patience)) / 200;
      const chance = Math.min(0.26, 0.06 + pressure * 0.14);
      if (Math.random() > chance) {
        return;
      }

      const events = [
        { type: "shake", text: "" },
        { type: "flicker", text: "" }
      ];
      this.pendingDisturbance = events[Math.floor(Math.random() * events.length)];
      this.state.stats.fakeEvents += 1;
      const line = window.Narrator.glitchLine();
      lines.push(line);
      this.addLog(line);
    },

    render() {
      window.UI.render(this.state, this.getAvailableDoors(), (doorId) => this.chooseDoor(doorId));
      this.updateAudioButton();
    },

    syncAudio() {
      window.AudioDirector.startMusic(window.Narrator.musicMode(this.state));
    }
  };

  window.Game = Game;

  document.addEventListener("DOMContentLoaded", () => {
    Game.init();
  });
})();
