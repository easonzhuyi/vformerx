import debounce from 'lodash.debounce';
import Vue from 'vue';
import Vuex from 'vuex';
import formModel from './modules/formModel';
import * as assistant from '../assistant';
import log from './console';

Vue.use(Vuex);

const validate = debounce(({
  state,
  commit,
  data,
  page,
  field,
}) => {
  assistant.bind(state.config.formModels, data, page);
  assistant.validate(state.config.formModels, {
    page,
    form: data.name,
    name: field,
  }).then(result => {
    if (result.pass) {
      commit('update', { data, result });
    } else {
      commit('error', result);
    }
  });
}, 500);

const store = new Vuex.Store({
  state: {
    config: {},
  },

  mutations: {
    initialize(state, config) {
      Object.assign(state.config, config);
    },

    update(state, { data, result }) {
      log(`${result}, ${data}`);
    },

    error(state, error) {
      log(error);
    },

    insert(state, { form, body }) {
      Vue.set(state.config.formModels.p1, form, JSON.parse(body));
    },
  },
  actions: {
    insert({ commit, state }, { page, form }) {
      const body = JSON.stringify(state.config.formModels[page][form]);
      let newFormName = '';
      const forms = Object.keys(state.config.formModels[page]).filter(v => v.includes(form));
      let i = 1;

      forms.forEach(v => {
        if (v === form + i) {
          i += 1;
        }
        newFormName = form + i;
      });

      commit('insert', { form: newFormName, body });
      assistant.update(state.config.formModels, page, newFormName);
    },

    initialize({ commit }, { config, vux }) {
      commit('initialize', config);
      assistant.initialize(config.formModels, config.templates, vux);
    },

    update({ commit, state }, { data, page, field }) {
      validate({
        state,
        commit,
        data,
        page,
        field,
      });
    },

    changeFormType(state, { p, f, obj }) {
      log(state.config.formModels[p][f][obj.name].rules);

      const element = state.config.formModels[p][f][obj.name];
      element.rules.type = obj.val;
    },
  },
  modules: {
    formModel,
  },
});

export default store;
