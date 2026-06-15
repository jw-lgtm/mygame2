(function () {
  "use strict";

  const UI = {
    els: {},
    lastState: null,
    lastDoors: [],
    onChoose: null,

    init() {
      this.els = {
        app: document.getElementById("app"),
        menuScreen: document.getElementById("menuScreen"),
        gameScreen: document.getElementById("gameScreen"),
        endingScreen: document.getElementById("endingScreen"),
        continueButton: document.getElementById("continueButton"),
        patienceValue: document.getElementById("patienceValue"),
        patienceMeter: document.getElementById("patienceMeter"),
        affinityValue: document.getElementById("affinityValue"),
        angerValue: document.getElementById("angerValue"),
        controlValue: document.getElementById("controlValue"),
        choiceCount: document.getElementById("choiceCount"),
        endingCount: document.getElementById("endingCount"),
        roomIndex: document.getElementById("roomIndex"),
        roomName: document.getElementById("roomName"),
        roomDescription: document.getElementById("roomDescription"),
        narratorText: document.getElementById("narratorText"),
        choiceList: document.getElementById("choiceList"),
        pathList: document.getElementById("pathList"),
        eventLog: document.getElementById("eventLog"),
        achievementList: document.getElementById("achievementList"),
        mazeCanvas: document.getElementById("mazeCanvas"),
        endingType: document.getElementById("endingType"),
        endingTitle: document.getElementById("endingTitle"),
        endingText: document.getElementById("endingText"),
        endingStats: document.getElementById("endingStats"),
        fakeModal: document.getElementById("fakeModal"),
        fakeModalTitle: document.getElementById("fakeModalTitle"),
        fakeModalText: document.getElementById("fakeModalText")
      };

      window.addEventListener("resize", () => {
        if (this.lastState) {
          this.drawMap(this.lastState);
        }
      });
    },

    render(state, doors, onChoose) {
      this.lastState = state;
      this.lastDoors = doors || [];
      this.onChoose = onChoose;
      this.setScreen(state.phase);

      if (state.phase === "menu") {
        this.renderMenu();
      } else if (state.phase === "ending") {
        this.renderEnding(state);
      } else {
        this.renderGame(state, doors || []);
      }
    },

    setScreen(phase) {
      this.els.app.dataset.screen = phase;
      this.els.menuScreen.hidden = phase !== "menu";
      this.els.gameScreen.hidden = phase !== "playing";
      this.els.endingScreen.hidden = phase !== "ending";
    },

    renderMenu() {
      this.els.continueButton.disabled = !window.SaveSystem.hasSave();
    },

    renderGame(state, doors) {
      const room = window.GAME_DATA.roomMap[state.currentRoom];
      this.renderStatus(state);
      this.els.roomIndex.textContent = `节点 ${String(room.index).padStart(2, "0")}`;
      this.els.roomName.textContent = room.name;
      this.els.roomDescription.textContent = room.description;
      this.renderNarrator(state.narration);
      this.renderChoices(doors);
      this.renderPath(state);
      this.renderLog(state);
      this.renderAchievements(state);
      this.drawMap(state);
    },

    renderStatus(state) {
      const patience = Math.max(0, state.patience);
      this.els.patienceValue.textContent = patience;
      this.els.patienceMeter.style.width = `${Math.max(0, Math.min(100, patience))}%`;
      this.els.affinityValue.textContent = state.narrator.affinity;
      this.els.angerValue.textContent = state.narrator.anger;
      this.els.controlValue.textContent = state.narrator.control;
      this.els.choiceCount.textContent = state.stats.choices;
      this.els.endingCount.textContent = `${state.stats.endingsFound.length}/8`;
    },

    renderNarrator(lines) {
      this.els.narratorText.innerHTML = "";
      (lines || []).slice(-2).forEach((line) => {
        const paragraph = document.createElement("p");
        paragraph.className = "narrator-line";
        paragraph.textContent = line;
        this.els.narratorText.appendChild(paragraph);
      });
    },

    renderChoices(doors) {
      this.els.choiceList.innerHTML = "";
      doors.forEach((door) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `choice-button${door.hidden ? " hidden-choice" : ""}`;
        button.dataset.choiceId = door.id;

        const title = document.createElement("strong");
        title.textContent = door.label;

        button.append(title);
        button.addEventListener("click", () => {
          if (this.onChoose) {
            this.onChoose(door.id);
          }
        });
        this.els.choiceList.appendChild(button);
      });
    },

    renderPath(state) {
      this.els.pathList.innerHTML = "";
      state.path.slice(-12).forEach((entry) => {
        const item = document.createElement("li");
        item.textContent = entry.doorLabel
          ? `${entry.roomName}：${entry.doorLabel}`
          : entry.roomName;
        this.els.pathList.appendChild(item);
      });
    },

    renderLog(state) {
      this.els.eventLog.innerHTML = "";
      state.log.slice(-10).forEach((entry) => {
        const item = document.createElement("li");
        item.textContent = entry;
        this.els.eventLog.appendChild(item);
      });
    },

    renderAchievements(state) {
      this.els.achievementList.innerHTML = "";
      window.GAME_DATA.achievements.forEach((achievement) => {
        const badge = document.createElement("span");
        const unlocked = state.achievements.includes(achievement.id);
        badge.className = `achievement${unlocked ? " unlocked" : ""}`;
        badge.title = achievement.description;
        badge.textContent = unlocked ? achievement.title : "未解锁";
        this.els.achievementList.appendChild(badge);
      });
    },

    renderEnding(state) {
      const ending = window.GAME_DATA.endings[state.endingId];
      this.els.endingType.textContent = ending.kind;
      this.els.endingTitle.textContent = ending.title;
      this.els.endingText.textContent = ending.text;
      this.els.endingStats.innerHTML = "";

      [
        `选择次数：${state.stats.choices}`,
        `失败次数：${state.stats.deaths}`,
        `被旁白嘲讽：${state.stats.mockery}`,
        `已收集结局：${state.stats.endingsFound.length}/8`,
        `当前旁白状态：好感 ${state.narrator.affinity} / 愤怒 ${state.narrator.anger} / 控制欲 ${state.narrator.control}`
      ].forEach((line) => {
        const row = document.createElement("div");
        row.textContent = line;
        this.els.endingStats.appendChild(row);
      });
    },

    drawMap(state) {
      const canvas = this.els.mazeCanvas;
      if (!canvas || canvas.offsetParent === null) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));

      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const rooms = window.GAME_DATA.rooms;
      const visited = new Set(Object.keys(state.visits).filter((id) => state.visits[id] > 0));
      visited.add(state.currentRoom);

      ctx.lineWidth = 1;
      rooms.forEach((room) => {
        room.doors.forEach((door) => {
          if (!door.to) {
            return;
          }
          const target = window.GAME_DATA.roomMap[door.to];
          if (!target) {
            return;
          }
          ctx.beginPath();
          ctx.strokeStyle = visited.has(room.id) ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.12)";
          ctx.moveTo(room.x * width, room.y * height);
          ctx.lineTo(target.x * width, target.y * height);
          ctx.stroke();
        });
      });

      rooms.forEach((room) => {
        const x = room.x * width;
        const y = room.y * height;
        const isCurrent = room.id === state.currentRoom;
        const wasVisited = visited.has(room.id);
        const nodeWidth = isCurrent ? 38 : 28;
        const nodeHeight = isCurrent ? 24 : 18;

        ctx.fillStyle = isCurrent ? "#f7f7f7" : wasVisited ? "#151515" : "#050505";
        ctx.strokeStyle = isCurrent ? "#f7f7f7" : wasVisited ? "#d9d9d9" : "#333";
        ctx.lineWidth = isCurrent ? 2 : 1;
        ctx.fillRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);
        ctx.strokeRect(x - nodeWidth / 2, y - nodeHeight / 2, nodeWidth, nodeHeight);

        ctx.fillStyle = isCurrent ? "#050505" : wasVisited ? "#f7f7f7" : "#5f5f5f";
        ctx.font = `${isCurrent ? 12 : 10}px ui-monospace, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(room.index).padStart(2, "0"), x, y);
      });
    },

    triggerDisturbance(type, text) {
      const app = this.els.app;
      const classes = {
        shake: "shake",
        flicker: "flicker",
        drift: "drifting",
        crash: "fake-crash"
      };

      if (type === "modal" || type === "save") {
        this.els.fakeModalTitle.textContent = type === "save" ? "存档损坏" : "系统提示";
        this.els.fakeModalText.textContent = text || "假的。数据没坏。旁白只是想看你紧张。";
        this.els.fakeModal.hidden = false;
        window.setTimeout(() => {
          this.els.fakeModal.hidden = true;
        }, 1300);
        return;
      }

      const className = classes[type] || "shake";
      app.classList.add(className);
      if (type === "crash") {
        this.els.fakeModalTitle.textContent = "程序没有响应";
        this.els.fakeModalText.textContent = "演出用假崩溃。请保持你刚才那种略显昂贵的紧张感。";
        this.els.fakeModal.hidden = false;
      }

      window.setTimeout(() => {
        app.classList.remove(className);
        if (type === "crash") {
          this.els.fakeModal.hidden = true;
        }
      }, type === "crash" ? 1500 : 760);
    }
  };

  window.UI = UI;
})();
