import {ADDUSER} from '@/api'
const getConfig = function (app) {
  app.axios.post(ADDUSER).then(({data}) => {
    app.$store.commit('getFormModelConfig', data.value)
  })
}
export default getConfig