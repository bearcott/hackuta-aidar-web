// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    people: {},
    map: null,
    isDispatch: true,
    selectedPerson: null
  },
  mutations: {
    addPerson: (state, [id, values]) => {
      state.people = {
        ...state.people,
        [id]: values
      }
    },
    deletePerson: (state, id) => {
      delete state.people[id]
      state.people = {...state.people}
    },
    setPerson: (state, [id, replace]) => {
      state.people = {
        ...state.people,
        [id]: {
          ...state.people[id],
          ...replace
        }
      }
    },
    setSelectedPerson (state, id) {
      state.selectedPerson = id
    },
    togglePerson: (state) => {
      state.isDispatch = !state.isDispatch
    },
    setMap: (state, map) => {
      state.map = map
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  router,
  template: '<App/>',
  components: { App }
})
