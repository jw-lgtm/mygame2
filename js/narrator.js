(function () {
  "use strict";

  const META_LINES = [
    "你是不是准备存档读档？不用回答，存档金库已经开始预热。",
    "别去查攻略。攻略只会告诉你我本来就知道的事。",
    "你已经卡在这里不止一次了。墙纸都快认识你的脚步声。",
    "如果你正在看代码，请至少假装惊讶。",
    "这个选择看起来像自由，其实只是我给自由套了个按钮。",
    "不要被门的数量骗了。复杂不等于公平，只等于我有更多台词。",
    "我知道你在等隐藏路线。隐藏路线最怕被玩家用期待照亮。",
    "每次你犹豫，流程图都会多长一条皱纹。",
    "这不是恐怖游戏。只是界面偶尔记得自己可以吓你。",
    "你以为你在探索迷宫，迷宫以为你在提交测试报告。",
    "如果一个门看起来太正确，它可能只是在面试你。",
    "旁白不会撒谎。旁白只会提前发布尚未证实的正确性。",
    "不要把沉默当线索。虽然它有时候确实是。",
    "你刚才的路线选择有一种勇敢的无证驾驶感。",
    "系统没有崩溃。它只是短暂地对你的决定失去语言。",
    "我承认，偶尔你会选对。但这不影响我保持专业怀疑。",
    "你听见音乐变了吗？那是系统在给你的判断配低音。",
    "按钮稍微移动不是错误。它只是有边界感。",
    "你可以反抗我，但请按顺序反抗，方便归档。",
    "如果最后你赢了，请记住：胜利也需要旁白宣布才显得正式。"
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function pick(lines) {
    if (!lines || lines.length === 0) {
      return "";
    }
    return lines[Math.floor(Math.random() * lines.length)];
  }

  function moodFor(state) {
    const narrator = state.narrator;
    if (narrator.anger >= 72 || narrator.control <= 18 || state.patience <= 20) {
      return "furious";
    }
    if (narrator.affinity >= 48 && narrator.anger < 44) {
      return "friendly";
    }
    return "annoyed";
  }

  function roomLine(room, state) {
    const mood = moodFor(state);
    const visits = state.visits[room.id] || 0;
    const bank = room.narration[mood] || room.narration.annoyed || room.narration.friendly;
    let line = pick(bank);

    if (visits >= 3) {
      line += " 顺便一提，这地方已经见你太多次，开始考虑收熟客费。";
    } else if (visits === 2) {
      line += " 第二次来时，尴尬会自动升级成认识。";
    }

    return line;
  }

  function choiceLine(door, state) {
    const bank = window.GAME_DATA.narratorBank;
    const lines = [];

    if (door.narration && door.narration.length) {
      lines.push(pick(door.narration));
    }

    if (door.recommended === true) {
      lines.push(pick(bank.obey));
    } else if (door.recommended === false) {
      lines.push(pick(bank.defy));
    } else {
      lines.push(pick(bank.neutral));
    }

    if (state.patience <= 34) {
      lines.push(pick(bank.lowPatience));
    }

    if (state.narrator.anger >= 68) {
      lines.push(pick(bank.highAnger));
    } else if (state.narrator.control >= 76) {
      lines.push(pick(bank.highControl));
    }

    if (state.stats.choices > 0 && state.stats.choices % 5 === 0) {
      lines.push(pick(META_LINES));
    }

    return lines.filter(Boolean);
  }

  function endingLine(ending, state) {
    const endingsFound = state.stats.endingsFound.length;
    if (ending.kind.includes("隐藏")) {
      return "隐藏结局。旁白把它藏起来，不是因为神秘，而是因为它不想承认你能找到。";
    }
    if (endingsFound >= 4) {
      return "你已经收集了不少结局。旁白开始怀疑你不是迷路，而是在采样。";
    }
    return "结局抵达。旁白正在努力把它解释成一切尽在掌握。";
  }

  function unlockLine(type) {
    const bank = window.GAME_DATA.narratorBank;
    if (type === "defy") {
      return pick(bank.unlockDefy);
    }
    return pick(bank.unlockObey);
  }

  function achievementLine() {
    return pick(window.GAME_DATA.narratorBank.achievements);
  }

  function glitchLine() {
    return pick(window.GAME_DATA.narratorBank.glitch);
  }

  function adjustNarrator(state, door) {
    const narrator = state.narrator;
    const effects = door.effects || {};
    narrator.affinity = clamp(narrator.affinity + (effects.affinity || 0), 0, 100);
    narrator.anger = clamp(narrator.anger + (effects.anger || 0), 0, 100);
    narrator.control = clamp(narrator.control + (effects.control || 0), 0, 100);

    if (door.recommended === true) {
      narrator.control = clamp(narrator.control + 1, 0, 100);
      narrator.anger = clamp(narrator.anger - 1, 0, 100);
    }

    if (door.recommended === false) {
      narrator.anger = clamp(narrator.anger + 1, 0, 100);
      narrator.control = clamp(narrator.control - 1, 0, 100);
    }
  }

  function musicMode(state) {
    if (state.phase === "menu") {
      return "menu";
    }
    if (state.phase === "ending") {
      const ending = window.GAME_DATA.endings[state.endingId];
      return ending ? ending.music : "trueEnding";
    }
    if (state.flags.hiddenDefyUnlocked || state.flags.hiddenObeyUnlocked) {
      return "hidden";
    }
    if (state.narrator.anger >= 72 || state.patience <= 22) {
      return "madness";
    }
    if (state.narrator.anger >= 48 || state.patience <= 45 || state.narrator.control >= 82) {
      return "tension";
    }
    return "explore";
  }

  window.Narrator = {
    clamp,
    moodFor,
    roomLine,
    choiceLine,
    endingLine,
    unlockLine,
    achievementLine,
    glitchLine,
    adjustNarrator,
    musicMode
  };
})();
