import {ADDUSER} from '@/api'
const getConfig = function (app) {
  app.axios.post(ADDUSER).then(({data}) => {
    app.$store.dispatch('initialize', { 
        config: data.value, 
        vux: app.$vux,
        bus: app.$bus,
    })
  })
}
export default getConfig