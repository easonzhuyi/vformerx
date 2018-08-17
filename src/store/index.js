import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutation-types'
import axios from 'axios'
import moduleA from './modules/moduleA'
import moduleB from './modules/moduleB'
import formModel from './modules/formModel'
import { formModels } from './formModels'
import { Func1 } from './validators'

// import ui from './modules/ui'
// import { resolve } from 'url';

Vue.use(Vuex)

function getData () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}


function validate (callback, formValues, fieldValue, ...field) {
  function $$ (col) {
    function getFieldValue (col) {
      if (field.length > col) {
        return formValues[field[col]]
      } else {
        return undefined
      }
    }

    return col === 0 ? fieldValue : getFieldValue(col - 1);
  }

  for (let i = 0; i <= field.length; i++) {
    if (typeof $$(i) === 'undefined') {
      return {
        pass: true,
        ignore: true
      }
    }
  }

  $$.number = function (col) {
    return parseInt($$(col))
  }

  $$.fail = function (col, reason) {
    return {
      pass: false,
      field: field[col],
      reason: reason
    }
  }

  $$.pass = function () {
    return {
      pass: true
    }
  }

  return callback($$);
}

function mapFields (state, callback) {
  let models = state.formModels;
  for (let mKey in models) {
    for (let pKey in models[mKey]) {
      for (let fKey in models[mKey][pKey]) {
        callback(models[mKey][pKey][fKey]);
      }
    }
  }
}

const store = new Vuex.Store({
  state: {
    formModels: formModels,
    formValues: {}
  },

  mutations: {
    dataUpdated (state, v) {
      console.log(v);
      for (let key in v.value) {
        state.formValues[`${v.name}-${key}`] = v.value[key];

        let sections = v.name.split('-');
        let field = state.formModels[sections[0]][sections[1]][key];
        field.value = v.value[key];
      }

      mapFields(state, field => {
        let validators = field.validators;
        validators && validators.forEach((item) => {
          let callback = eval(`$$ => {${item.codes}}`);
          let ret = validate(callback, state.formValues, field.value, ...item.fields);
          console.log(ret);
        })
      })

      console.log(state.formValues);
    },
    insert (state) {
      console.log('insert');
      let j = JSON.stringify(state.formModels['p1']['form1']);
      Vue.set(state.formModels.p1, 'form11', JSON.parse(j));
    }
  },
  actions: {
    insert ({ commit }) {
      commit('insert');
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
