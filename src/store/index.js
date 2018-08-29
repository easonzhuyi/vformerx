import debounce from 'lodash.debounce';
import Vue from 'vue';
import Vuex from 'vuex';
import formModel from './modules/formModel';
import * as assistant from '../assistant';
import log from './console';

Vue.use(Vuex);

function isValid(errorBag, field) {
  for (let i = 0; i < errorBag.length; i += 1) {
    if (errorBag[i].name === field) {
      return false;
    }
  }

  return true;
}

const validate = debounce(({
  state,
  commit,
  data,
  page,
  field,
}) => {
  const fields = typeof field === 'string' ? [field] : field;
  assistant.bind(state.config.formModels, data, page);

  fields.forEach(element => {
    // 判断当前元素的输入值是否合法
    if (!isValid(data.errorBag, element)) {
      return;
    }
    // 联动显示隐藏
    const displayers = assistant.display({
      page,
      form: data.name,
      name: element,
    });
    if (displayers && displayers.length > 0) {
      displayers.forEach(d => {
        commit('changeFormType', d);
      });
    }
    assistant.validate(state.config.formModels, {
      page,
      form: data.name,
      name: element,
    }).then(result => {
      if (result.pass) {
        // 自动填写
        const fillers = assistant.fill({
          page,
          form: data.name,
          name: element,
        });
        commit('fill', fillers);
      } else {
        // 联动校验错误，调用vformer报错
        if (result.reason) {
          commit('error', {
            name: `${page}-${data.name}-${element}`,
            msg: result.reason,
          });
          return;
        }
        commit('error', {
          name: `${page}-${data.name}-${element}`,
          msg: '联动错误',
        });
      }
    });
  });
}, 500);

const store = new Vuex.Store({
  state: {
    config: {
      formModels: {},
    },
    bus: null,
  },

  mutations: {
    initialize(state, { config, bus }) {
      /* eslint-disable no-param-reassign */
      Object.assign(state.config, config);
      state.bus = bus;
    },

    fill(state, results) {
      (results || []).forEach(item => {
        state.bus.$emit('fill', {
          name: item.name,
          value: item.value,
        });
      });
    },

    // update(state, { result }) {
    //   state.$bus.$emit('fill', {
    //     name: 'p1-form1-name',
    //     value: '李四',
    //   });
    // },

    error(state, error) {
      state.bus.$emit('error', error);
    },

    insert(state, { form, body }) {
      Vue.set(state.config.formModels.p1, form, JSON.parse(body));
    },

    changeFormType(state, { name, value }) {
      const names = name.split('-');
      const element = state.config.formModels[names[0]][names[1]][names[2]];
      Object.keys(value).forEach(key => {
        element.rules[key] = value[key];
      });
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

    initialize({ commit }, { config, vux, bus }) {
      commit('initialize', { config, bus });
      assistant.initialize(config.formModels, config.templates, vux);
    },

    update({ commit, state }, { data, page, field }) {
      log(data);
      validate({
        state,
        commit,
        data,
        page,
        field,
      });
    },
  },
  modules: {
    formModel,
  },
  getters: {
    formModels: state => state.config.formModels,
  },
});

export default store;
