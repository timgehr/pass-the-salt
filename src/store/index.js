import { createStore } from 'vuex'

export default createStore({
  state: {
    allowedChars: [ "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", "-", "<", "=", ">", "?", "@", "^", "_" ],
    savedAllowedChars: [],
    minLength: 8,
    maxLength: 64,
  },
  getters: {
  },
  mutations: {
    updateAllowedChars(state, payload) {
      state.allowedChars = payload;
    },
    updateMaxLength(state, payload) {
      state.maxLength = payload;
    },
    updateMinLength(state, payload) {
      state.minLength = payload;
    },
    updateSavedAllowedChars(state, payload) {
      state.savedAllowedChars = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
