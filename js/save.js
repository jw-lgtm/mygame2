(function () {
  "use strict";

  const SAVE_KEY = "narrator_is_always_right_save_v1";

  function safeClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  window.SaveSystem = {
    save(state) {
      try {
        const payload = {
          version: window.GAME_DATA.version,
          savedAt: new Date().toISOString(),
          state: safeClone(state)
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
        return true;
      } catch (error) {
        console.warn("保存失败", error);
        return false;
      }
    },

    load() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) {
          return null;
        }

        const payload = JSON.parse(raw);
        if (!payload || !payload.state) {
          return null;
        }

        return payload.state;
      } catch (error) {
        console.warn("读取存档失败", error);
        return null;
      }
    },

    hasSave() {
      try {
        return Boolean(localStorage.getItem(SAVE_KEY));
      } catch (error) {
        return false;
      }
    },

    clear() {
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch (error) {
        console.warn("清除存档失败", error);
      }
    }
  };
})();
