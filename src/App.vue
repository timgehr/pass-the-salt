<template>
  <div id="app">
    <div class="align-center">
      <div class="top-bar flex center-center gap-10 rem-3">
        <img src="./assets/spilledsalt.png" id="top-logo" />
      </div>
      <div class="flex column gap-10">
        <input
          type="text"
          class="input site"
          v-on:keyup.enter="produceEncryption"
          v-model="input.site"
          autocapitalize="none"
          placeholder="Site"
        />
      </div>
      <div class="flex column gap-10 top-30">
        <input
          :type="!show ? 'password' : 'text'"
          placeholder="Password"
          class="input password"
          v-on:keyup.enter="produceEncryption"
          v-model="input.key"
          autocapitalize="none"
          style="-webkit-text-security: asterisk"
        />
        <div class="flex row gap-10 space-around show-password">
          <h4 class="">Show password</h4>
          <label class="switch">
            <input type="checkbox" v-model="show" class="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <div class="bottom">
        <p class="console-text err">{{ this.errmess }}</p>
        <button
          class="copy-text"
          :class="this.res ? 'active' : 'inactive'"
          v-on:click="copyPassword"
        >
          {{
            this.cliptext + this.res.slice(0, 4) + (this.res ? "******" : "")
          }}
        </button>
        <p
          class="console-text success"
          :class="{ 'slide-up': copySuccess }"
          @animationend="copySuccess = false"
        >
          Succesfully copied!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";

export default {
  name: "App",
  data() {
    return {
      input: {
        key: "",
        site: "",
      },
      res: "",
      errmess: "",
      cliptext: "Copy ",
      copySuccess: false,
      line0: "",
      show: false,
    };
  },
  watch: {
    input: {
      deep: true,
      handler() {
        this.produceEncryption();
      },
    },
  },
  methods: {
    produceEncryption() {
      this.res = "";
      var k = this.input.key;
      var s = this.input.site;
      if (k !== "" && s !== "") {
        var full = CryptoJS.HmacSHA256(s, k);
        this.res = this.hex_to_ascii(full);
        this.errmess = "";
      } else {
        // this.errmess = "Please enter site or password";
      }
    },
    hex_to_ascii(str1) {
      var hex = str1.toString();
      var str = "";
      for (var n = 0; n < hex.length; n += 2) {
        var strTemp = String.fromCharCode(
          (parseInt(hex.substr(n, 2), 16) % 89) + 33
        );
        if (
          strTemp === "/" ||
          strTemp === "\\" ||
          strTemp === "`" ||
          strTemp === "," ||
          strTemp === "." ||
          strTemp === ":" ||
          strTemp === "[" ||
          strTemp === "]" ||
          strTemp === ";" ||
          strTemp === "{" ||
          strTemp === "}"
        ) {
          strTemp = "";
        }
        str += strTemp;
      }
      return str;
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
  },
};
</script>

<style>
* {
  -webkit-tap-highlight-color: transparent;
}

#app {
  font-family: "Source Code Pro", monospace;
  /* font-family: "Syne Mono", monospace; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background: rgb(37, 40, 40);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  box-sizing: border-box;
  font-size: 20px;
  display: flex;
  justify-content: center;
}

.yellow {
  color: rgb(217, 181, 64);
}

.console {
  width: 800px;
  max-width: 100%;
  height: 600px;
  margin: 50px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 14px 4px rgba(0, 0, 0, 0.2);

  color: rgb(255, 255, 255);
  background: rgba(255, 255, 255, 0.04);
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
}

.rem-3 {
  font-size: 3rem;
}

.input {
  font-family: "Source Code Pro", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: rgb(27, 29, 29, 0.6);
  box-shadow: inset 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
  padding: 10px;

  border: none;
  outline: none;
  border-radius: 8px;
  font-size: 34px;
  color: rgb(116, 150, 150);
  caret-color: rgb(116, 150, 150, 0.5);
  width: 400px;
  max-width: 85vw;
}

::placeholder {
  color: rgb(116, 150, 150, 0.2);
  opacity: 1; /* Firefox */
}

.center-center {
  justify-content: center;
  align-items: center;
}
.align-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex {
  display: flex;
}

.space-around {
  justify-content: center;
}

.column {
  flex-direction: column;
}

.gap-10 {
  gap: 10px;
}

.top-30 {
  margin-top: 20px;
}

/* .console-text::before {
  color: rgb(217, 181, 64);
  content: "PS > ";
} */

.result {
  margin: 0px auto;
  text-align: center;
}

.type {
  animation: typing 3.5s steps(40, end);
}

.blink {
  animation: blink-caret 0.75s step-end infinite;
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

input:checked + .slider:before {
  background-color: #6ad7d7;
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

.err {
  color: rgb(207, 0, 0);
}

.textField1:enabled {
  outline: 0pt solid #2c3e501a;
}

#topbar {
  height: fit-content;
  min-width: 100vw;
  margin-bottom: 40px;
  padding: 30px 10px;
  font-size: 30px;
  color: rgb(0, 19, 19);
}

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
  background: rgba(44, 63, 63, 0.662);
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
  transition: none;
}

.bottom {
  margin-top: 40px;
}

.success {
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

/* .copy-text:active ~ .success{
  animation: slide-up 1s ease-out;
} */

.success.slide-up {
  animation: slide-up 2s ease-out;
}

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

#top-logo {
  height: 50px;
  margin: 30px 0px;
}
</style>

