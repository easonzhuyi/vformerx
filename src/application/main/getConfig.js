import {ADDUSER} from '@/api'
const getConfig = function (app) {
  app.axios.post(ADDUSER).then(({data}) => {
    app.$store.dispatch('initialize', { 
        config: data.value, 
        vux: app.$vux
    })
  })
}
export default getConfig