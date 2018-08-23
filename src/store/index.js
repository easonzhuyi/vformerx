import Vue from 'vue'
import Vuex from 'vuex'
import formModel from './modules/formModel'
import { debounce } from 'lodash'
import * as assistant from '../assistant'


Vue.use(Vuex)

const validate = debounce(({ state, commit, data, page, field }) => {
    assistant.bind(state.config.formModels, data, page);
    assistant.validate(state.config.formModels, {
        page: page,
        form: data.name,
        name: field
    }).then(result => {
        if (result.pass) {
            commit('update', { data, result })
        } else {
            commit('error', result)
        }
    })
}, 500)

const store = new Vuex.Store({
    state: {
        config: {}
    },

    mutations: {
        initialize(state, config) {
            state.config = config;
        },

        update(state, { data, result }) {
            console.log(result);
        },

        error(state, error) {
            console.log(error);
        },

        insert(state, { form, body }) {
            Vue.set(state.config.formModels.p1, form, JSON.parse(body));
        }
    },
    actions: {
        insert({ commit, state }, { page, form }) {
            let body = JSON.stringify(state.config.formModels[page][form]);
            let newFormName = ''
            let forms = Object.keys(state.config.formModels[page]).filter(v => v.includes(form))
            let i = 1

            forms.forEach(v => {
                if (v === form + i) {
                    i++
                }
                newFormName = form + i
            })

            commit('insert', { form: newFormName, body });
            assistant.update(state.config.formModels, page, newFormName);
        },

        initialize({ commit }, { config, vux }) {
            commit('initialize', config);
            assistant.initialize(config.formModels, config.templates, vux);
        },

        update({ commit, state }, { data, page, field }) {
            validate({ state, commit, data, page, field });
        },

        changeFormType(state,{p,f,obj}) {
            console.log(state.config.formModels[p][f][obj.name].rules);
            state.config.formModels[p][f][obj.name].rules.type = obj.val
        }
    },
    modules: {
        formModel
    }
})

export default store
