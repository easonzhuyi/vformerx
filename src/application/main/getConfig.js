import {FORMMODELCONFIG} from '@/api'
const getConfig = function (app) {
  app.axios.post(FORMMODELCONFIG).then(({data}) => {
    app.$store.commit('getFormModelConfig', data.value)
  })
}
export default getConfig