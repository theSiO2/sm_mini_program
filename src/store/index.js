import Vue from 'vue';
const Vuex = require('vuex')
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

Vue.prototype.$store = store