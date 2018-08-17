const state = {
  config: null
}
const getters = {}
const mutations = {
  getFormModelConfig: (state, config) => {
    state.config = config
  },
  setConfig: (state, val) => {
    console.log('val', val)
    let page = val.name.split('.')[0]
    let f = val.name.split('.')[1]
    Object.keys(val.value).forEach(v => {
      state.config[page][f][v].value = val.value[v]
    })
    // state.config[page][f] = val.value
  }
}
const actions = {
  setConfig: ({commit}, v) => {
    commit('setConfig', v)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}