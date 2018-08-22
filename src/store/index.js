import Vue from 'vue'
import Vuex from 'vuex'
import formModel from './modules/formModel'
import { formModels as config } from './formModels'


import * as assistant from '../assistant'


Vue.use(Vuex)

// 根据配置文件，创建规则依赖表
// let dep = assistant.findDependencies(config.formModels)
// config.dependencies = dep

const store = new Vuex.Store({
  state: {
    config: {},
    formValues: {}
  },

  mutations: {
    getFormModelConfig: (state, config) => {
      let dep = assistant.findDependencies(config.formModels)
      config.dependencies = dep
      // console.log(config.dependencies);
      state.config = config
    },
    dataUpdated (state, obj) {
      let data = obj.v;
      let page = obj.page;
      let name = obj.t;

      if (JSON.stringify(data.value) === '{}') {
          return;

      }

      assistant.save(state, page, data)

      assistant.validate(state, {
          page: page,
          form: data.name,
          name: name
      })
    },

    insert (state, {p,f}) {
      let j = JSON.stringify(state.config.formModels[p][f]);
      let insertF = ''
      let templateFs = Object.keys(state.config.formModels[p]).filter( v =>  v.includes(f))
      let i = 1
      templateFs.forEach( v => {
        if(v === f + i) {
          i++
        }
        insertF = f + i
      })
      Vue.set(state.config.formModels.p1, insertF, JSON.parse(j));

      assistant.updateDependencies(state.config.dependencies, state.config.formModels, p, insertF);
      // console.log('updateDependencies');
      console.log(state.config.dependencies)
    }
  },
  actions: {
    insert ({ commit },obj) {
      commit('insert',obj);
    },
    dataUpdated ({commit}, v) {
      commit('dataUpdated', v);
    }
  },
  modules: {
    formModel
  }
})

export default store
