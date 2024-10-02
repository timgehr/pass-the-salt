<template>
  <div class="flex column align-center page-container">
    <div class="top-bar flex center-center gap-10 rem-3 width-100">
      <img src="./assets/spilledsalt.png" id="top-logo" />
    </div>
    <div class="flex column gap-10 width-100">
      <div class="flex column">
        <input
          type="text"
          class="input site"
          v-on:keyup.enter="produceEncryption"
          v-model="input.site"
          autocapitalize="none"
          placeholder="Site"
        />
      </div>
      <div class="flex column width-100">
        <input
          type="text"
          class="input username"
          v-on:keyup.enter="produceEncryption"
          v-model="input.username"
          autocapitalize="none"
          placeholder="Account"
          :class="useAccount ? 'active' : 'inactive'"
        />
      </div>
      <div class="flex column width-100">
        <input
          :type="!show ? 'password' : 'text'"
          placeholder="Password"
          class="input password"
          id="password"
          v-on:keyup.enter="produceEncryption"
          v-model="input.key"
          autocapitalize="none"
          style="-webkit-text-security: asterisk"
        />
      </div>
      <div class="flex center-center relative width-100">
        <span
          class="material-symbols-outlined account-button blue-button"
          :class="useAccount ? 'account-on blue-button-on' : ''"
          v-on:click="useAccount = !useAccount"
        >
          person_add
        </span>
        <div class="flex row gap-10 space-around show-password">
          <h4 class="">Show password</h4>
          <label class="switch">
            <input type="checkbox" v-model="show" class="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
        <span
          class="material-symbols-outlined settings-button blue-button"
          :class="settingsOpen ? 'settings-button-open blue-button-on' : ''"
          v-on:click="settingsOpen = !settingsOpen"
        >
          settings
        </span>
      </div>
      <div class="settings" :class="settingsOpen ? 'settings-open' : ''">
        <SettingsMenu
          :allowedChars="allowedChars"
          :site="input.site"
        ></SettingsMenu>
      </div>
    </div>
    <div class="bottom">
      <button
        class="copy-text"
        :class="this.res ? 'active' : 'inactive'"
        v-on:click="copyPassword"
      >
        {{ this.cliptext + this.res.slice(0, 4) + (this.res ? "******" : "") }}
      </button>
      <p
        class="success"
        :class="{ 'slide-up': copySuccess }"
        @animationend="copySuccess = false"
      >
        Succesfully copied!
      </p>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import "./styles.css";
import SettingsMenu from "./components/SettingsMenu.vue";

export default {
  name: "App",
  components: {
    SettingsMenu,
  },
  data() {
    return {
      input: {
        key: "",
        site: "",
        username: "",
      },
      useAccount: false,
      retrySalt: "",
      res: "",
      errmess: "",
      cliptext: "Copy ",
      copySuccess: false,
      line0: "",
      show: false,
      settingsOpen: false,
    };
  },
  computed: {
    allowedChars() {
      return this.$store.state.savedAllowedChars?.length > 0
        ? this.$store.state.savedAllowedChars
        : this.$store.state.allowedChars;
    },
    disallowedChars() {
      return [
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
      ].filter((c) => !this.allowedChars?.includes(c));
    },
    min() {
      return this.$store.state.minLength;
    },
    max() {
      return this.$store.state.maxLength;
    },
    // capsLockState(){
    //   return this.getCapsLockState();
    // }
  },
  watch: {
    input: {
      deep: true,
      handler() {
        this.produceEncryption();
      },
    },
    max() {
      if (this.min < this.max) this.produceEncryption();
    },
    min() {
      if (this.min < this.max) this.produceEncryption();
    },
    allowedChars() {
      this.produceEncryption();
    },
  },
  methods: {
    produceEncryption() {
      this.res = "";
      let k = this.input.key;
      let s = this.input.site + this.input.username + this.retrySalt;
      if (k !== "" && s !== "") {
        let full = CryptoJS.HmacSHA256(s, k);
        let ascii = this.hex_to_ascii(full);
        if (
          /\p{Lu}/u.test(ascii) &&
          /\p{Ll}/u.test(ascii) &&
          /\p{N}/u.test(ascii)
        ) {
          this.res = ascii;
          this.retrySalt = "";
        } else {
          this.retrySalt += "retry";
          this.produceEncryption();
        }
      }
    },
    hex_to_ascii(str1) {
      let hex = str1.toString();
      let str = "";
      for (let n = 0; n < hex.length; n += 2) {
        var strTemp = String.fromCharCode(
          (parseInt(hex.substr(n, 2), 16) % 89) + 33
        );
        if (this.disallowedChars.includes(strTemp)) {
          strTemp = "";
        }
        str += strTemp;
      }
      str = str.slice(0, this.max);
      return str.slice(0, this.max);
    },
    copyPassword() {
      if (!navigator.clipboard) {
        return "failed";
      }
      var text = this.res;
      try {
        navigator.clipboard.writeText(text);
        if (this.res !== "") {
          this.copySuccess = true;
        }
      } catch (err) {
        this.cliptext = "Failed to copy ";
      }
    },
    // getCapsLockState() {
    //   let input = document.getElementById("password");
    //   input?.addEventListener("keydown", function(event) {
    //     if (event.getModifierState("CapsLock")) {
    //       return "Caps Lock on";
    //     } else {
    //       return "HE"
    //     }
    //   });
    // },
  },
};
</script>

<style>
#app {
  font-family: "Source Code Pro", monospace;
  /* font-family: "Syne Mono", monospace; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: rgb(37, 40, 40);
  min-height: 100vh;
  height: fit-content;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 20px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 0px 20px;
}

.page-container {
  max-width: min(400px, 100%);
}

/* SHOW PASSWORD */
.show-password {
  margin-top: 0px;
}
.show-password h4 {
  margin: 0px;
  font-size: 15px;
  font-weight: 400;
  color: rgb(116, 150, 150);
}
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 18px;
}
.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(27, 29, 29, 0.6);
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 9pc;
}
.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 3px;
  bottom: 3px;
  background-color: #749696;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

/* Text Field */

.input {
  font-family: "Source Code Pro", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: rgba(27, 29, 29, 0.6);
  box-shadow: inset 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  padding: 10px;

  border: none;
  outline: none;
  border-radius: 8px;
  font-size: 34px;
  color: rgb(116, 150, 150);
  caret-color: rgb(116, 150, 150, 0.5);
}

.input.inactive {
  padding-top: 0px;
  padding-bottom: 0px;
  height: 0px;
  transition: height 0.4s ease, padding 0.4s ease, margin-bottom 0.6s ease,
    margin-top 0.6s ease;
}
.input.active {
  height: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
  transition: height 0.6s ease, padding 0.6s ease, margin-bottom 0.6s ease,
    margin-top 0.6s ease;
}

::placeholder {
  color: rgb(116, 150, 150, 0.2);
  opacity: 1; /* Firefox */
}

input:checked + .slider:before {
  background-color: #58f4f4;
  box-shadow: 0 0 3px #45c1c144;
}

input:checked + .slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}

.text-field {
  font-family: Trebuchet, sans-serif;
  border: 1px solid #2727271f;
  box-shadow: 1px 1px 5px #27272734;
  border-radius: 0px;
  background-color: #0004;
  color: white;
  width: 400px;
  max-width: 50vw;
  max-height: 30px;
  padding: 20px 50px 20px 50px;
  font-size: 35px;
  text-align: center;
  margin: 20px 0px 20px 0px;
  font-family: "Source Code Pro", monospace;
  /* font-family: "Syne Mono", monospace; */
  outline: none;
}

.password ::placeholder {
  color: rgb(170, 170, 170);
}

/* Details */
.err {
  color: rgb(207, 0, 0);
}

.textField1:enabled {
  outline: 0pt solid #2c3e501a;
}

#topbar {
  height: fit-content;
  min-width: 100%;
  margin-bottom: 40px;
  padding: 30px 10px;
  font-size: 30px;
  color: rgb(0, 19, 19);
}

/* Copy Text Button */
.copy-text {
  background: linear-gradient(
    90deg,
    rgb(7, 64, 64) 0%,
    rgb(7, 64, 64) 25%,
    rgb(22, 84, 84) 50%,
    rgb(7, 64, 64) 75%,
    rgb(7, 64, 64) 100%
  );
  background-size: 400% 400%;
  color: white;
  border: 0px;
  font-size: 20px;
  font-weight: bold;
  height: 50px;
  width: 250px;
  min-width: fit-content;
  border-radius: 10px;
  outline: none;
  font-family: "Source Code Pro", monospace;
  cursor: pointer;
  transition: all 0.2s ease-out;
  user-select: none;
  margin-top: 0px;
  margin-bottom: 0px;
  box-shadow: 0px 4px 8px 2px rgba(10, 19, 19, 0.247);
}

.copy-text.inactive {
  background: linear-gradient(
    90deg,
    rgb(7, 64, 64, 0) 0%,
    rgb(7, 64, 64, 0) 25%,
    rgb(22, 84, 84, 0) 50%,
    rgb(7, 64, 64, 0) 75%,
    rgb(7, 64, 64, 0) 100%
  );
  box-shadow: 0px 4px 8px 2px rgba(10, 19, 19, 0);
  cursor: pointer;
  color: rgba(255, 255, 255, 0);
  transition: 1s;
  display: none;
}

.copy-text:focus {
  animation: gradient 1s ease-out, press 0.5s ease-out;
}

.copy-text.inactive:focus {
  animation: none;
}

.copy-text:active {
  animation: none;
  box-shadow: 0px 2px 5px 0px rgba(10, 19, 19, 0.6);
  margin-top: 3px;
  margin-bottom: -3px;
  /* transition: none; */
}

/* Successfully Copied */

.bottom {
  margin-top: 30px;
}

.success {
  margin-bottom: 0px;
  animation: none;
  user-select: none;
  background: linear-gradient(
    90deg,
    rgb(7, 64, 64, 0) 0%,
    rgb(7, 64, 64, 0) 25%,
    rgb(22, 84, 84) 50%,
    rgb(7, 64, 64, 0) 75%,
    rgb(7, 64, 64, 0) 100%
  );
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.success.slide-up {
  animation: slide-up 2s ease-out;
}

/* Animation */

@keyframes slide-up {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes gradient {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Logo */

#top-logo {
  height: 50px;
  margin: 30px 0px;
}

/* Settings */

.blue-button {
  color: rgb(116, 150, 150);
  position: absolute;
}

.blue-button-on {
  color: #58f4f4;
  text-shadow: 0 0 3px #45c1c144;
}

.account-button {
  left: 0px;
}

.settings-button {
  position: absolute;
  right: 0px;
  transition: transform 1s ease, color 1s ease;
}

.settings-button-open {
  transform: rotateZ(120deg);
  transition: transform 0.5s ease, color 0.5s ease;
}

.settings {
  /* display: none; */
  background-color: rgb(27, 29, 29, 0.6);
  border-radius: 10px;
  padding: 0px;
  box-shadow: inset 0px 2px 6px 0px rgba(0, 0, 0, 0);
  height: 0px;
  transition: height 0.5s ease-in, padding 0.15s ease-out 0.5s;
  max-height: 600px;
  overflow: hidden;
  opacity: 1;
}
.settings-open {
  padding: 10px;
  background-color: rgb(27, 29, 29, 0.6);
  transition: height 0.5s ease;
  box-shadow: inset 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  opacity: 1;
  display: block;
  height: 530px;
  margin-bottom: 0px;
}
</style>

