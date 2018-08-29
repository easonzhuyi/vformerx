import {ADDUSER, GETDEMOCONFIG} from '@/api'
const getConfig = function (app) {
  return app.axios.post(ADDUSER).then(({data}) => {
    app.$store.dispatch('initialize', { 
        config: data.value, 
        vux: app.$vux,
        bus: app.$bus,
    })
  })
}
const getDemoConfig = function (app) {
  return app.axios.get(GETDEMOCONFIG).then(({data}) => {
    app.$store.dispatch('initialize', { 
        config: data.value, 
        vux: app.$vux,
        bus: app.$bus,
    })
  })
}
export {getConfig, getDemoConfig}