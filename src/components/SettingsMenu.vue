<template>
  <div
    class="settings-menu flex column space-between gap-10 relative align-center"
  >
    <div class="flex column gap-10 width-100">
      <div class="setting">
        <label for="theme">Minimum Length</label>
        <input
          type="number"
          id="min"
          name="min"
          min="8"
          :max="max"
          v-model="min"
        />
      </div>
      <div class="setting">
        <label for="theme">Maximum Length</label>
        <input
          type="number"
          id="max"
          name="max"
          :min="min"
          max="64"
          v-model="max"
        />
      </div>
    </div>
    <div class="setting column width-100">
      <!-- <label for="chars">Allowed Characters</label>
      <input
        type="text"
        id="chars"
        name="chars"
        :value="allowedChars.join('')"
        @input="allowedChars = $event.target.value.split('')"
      /> -->
      Special Characters:
      <div class="special-characters">
        <div
          class="character"
          v-on:click="updateAllowedChars(char)"
          v-for="char in allChars"
          :key="char"
          :class="allowedChars?.includes(char) ? 'allowed' : ''"
        >
          {{ char }}
        </div>
        <div class="character disable-all" v-on:click="clearAllowedChars()">
          Clear All
        </div>
        <div class="character reset-all" v-on:click="resetAllowedChars()">
          Reset
        </div>
      </div>
    </div>
    <div class="flex width-100 gap-10">
      <div
        v-if="localStorageOn()"
        class="these-settings save grow-2"
        :class="site.length > 0 ? 'show' : ''"
        v-on:click="saveSettings()"
      >
        Save these settings for &nbsp;<span class="italic">{{ site }}</span>
      </div>
      <div
        v-if="localStorageOn()"
        class="these-settings delete shrink-1"
        :class="site.length > 0 ? 'show' : ''"
        v-on:click="clearSettings()">
        <span class="material-symbols-outlined">delete</span>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import knownSites from "@/assets/knownSettings.json";

export default {
  props: ["site"],
  data() {
    return {
      allChars: [
        "!",
        '"',
        "#",
        "$",
        "%",
        "&",
        "'",
        "(",
        ")",
        "*",
        "+",
        ",",
        "-",
        ".",
        "/",
        ":",
        ";",
        "<",
        "=",
        ">",
        "?",
        "@",
        "[",
        "\\",
        "]",
        "^",
        "_",
        "`",
      ],
    };
  },
  computed: {
    allowedChars() {
      return this.$store.state.savedAllowedChars?.length > 0
        ? this.$store.state.savedAllowedChars
        : this.$store.state.allowedChars;
    },
    min: {
      get() {
        return this.$store.state.minLength;
      },
      set(value) {
        this.updateMin(value);
      },
    },
    max: {
      get() {
        return this.$store.state.maxLength;
      },
      set(value) {
        this.updateMax(value);
      },
    },
  },
  methods: {
    updateAllowedChars(char) {
      let commitType =
        this.$store.state.savedAllowedChars?.length > 0
          ? "updateSavedAllowedChars"
          : "updateAllowedChars";
      let allowedChars = [...this.allowedChars];
      if (allowedChars?.includes(char)) {
        allowedChars?.splice(allowedChars.indexOf(char), 1);
        store.commit(commitType, allowedChars);
      } else {
        allowedChars.push(char);
        store.commit(commitType, allowedChars);
      }
    },
    resetAllowedChars() {
      store.commit("updateAllowedChars", this.$store.state.allChars);
    },
    clearAllowedChars() {
      store.commit("updateAllowedChars", []);
    },
    updateMax(max) {
      store.commit("updateMaxLength", max);
    },
    updateMin(min) {
      store.commit("updateMinLength", min);
    },
    localStorageOn() {
      try {
        localStorage.setItem("a", "a");
        localStorage.removeItem("a");
        return true;
      } catch (e) {
        return false;
      }
    },
    saveSettings() {
      localStorage.removeItem(this.site);
      localStorage.setItem(this.site, JSON.stringify(
        {"allowedChars": this.allowedChars,
        "min": this.min,
        "max": this.max
        }
      ));
    },
    clearSettings() {
      localStorage.removeItem(this.site);
      this.setSettings();
    },
    setSettings() {
      if (this.localStorageOn() && localStorage.getItem(this.site)) {
        let localStorageSettings = JSON.parse(localStorage.getItem(this.site));
        store.commit("updateSavedAllowedChars", localStorageSettings.allowedChars);
        store.commit("updateMinLength", localStorageSettings.min);
        store.commit("updateMaxLength", localStorageSettings.max);
      } else if (knownSites[this.site]) {
        store.commit(
          "updateSavedAllowedChars",
          knownSites[this.site].allowedChars
        );
        store.commit("updateMinLength", knownSites[this.site].min);
        store.commit("updateMaxLength", knownSites[this.site].max);
      } else {
        store.commit("updateSavedAllowedChars", []);
        store.commit("updateMinLength", 8);
        store.commit("updateMaxLength", 64);
      }
    }
  },
  watch: {
    site() {
      this.setSettings();
    },
  },
};
</script>

<style>
.settings-menu {
  padding: 10px;
  color: rgb(116, 150, 150);
  height: 530px;
}
.setting {
  display: flex;
  justify-content: space-between;
}
.setting input {
  color: rgb(116, 150, 150);
  background-color: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  outline: none;
  border: none;
  border-radius: 4px;
  text-align: center;
  width: 50px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  /* display: none; <- Crashes Chrome on hover */
  -webkit-appearance: none;
  margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}

.special-characters {
  display: grid;
  flex-wrap: wrap;
  width: 100%;
  grid-template-columns: 25% 25% 25% 25%;
}
.character {
  padding: 5px;
  margin: 5px;
  border-radius: 4px;
  background-color: #00000033;
  color: #749696;
  cursor: pointer;
  user-select: none;
}
.character.allowed {
  background-color: #6ad7d7;
  color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 0 5px #6ad7d741;
}

.these-settings {
  background-color: #00000033;
  color: #749696;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* transitioned properties */
  max-height: 0px;
  outline: 1px solid #74969600;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  padding: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  transition: max-height 0.3s ease, margin 0.1s ease-out, outline 0.5s ease, padding-top 0.3s ease, padding-bottom 0.3s ease;
}
.these-settings.show {
  max-height: 40px;
  outline: 1px solid #74969622;
  box-shadow: 0 3px 6px -3px rgba(0, 0, 0, 0.4);
  padding: 10px;
}
.these-settings.show:active {
  margin-bottom: -2px;
  margin-top: 2px;
}
.save.these-settings:hover {
  background-color: #6ad7d711;
  color: #6ad7d7;
  outline: 1px solid #6ad7d755;
}
.delete.these-settings {
  outline: 1px solid #f4939300;
  background-color: #ff000011;
  color: #f49393;
}
.delete.these-settings.show {
  outline: 1px solid #f4939322;
}
.delete.these-settings:hover {
  outline: 1px solid #ff8686;
  background-color: #ff000033;
  color: #ff8686;
}

@keyframes save-success {
  0% {
    outline: 1px solid #74969622;
  }
  60% {
    outline: 1px solid #48bdbd66;
  }
  100% {
    outline: 1px solid #74969622;
  }
}

.disable-all {
  grid-column-start: 1;
  grid-column-end: 3;
}
.reset-all {
  grid-column-start: 3;
  grid-column-end: 5;
}
</style>