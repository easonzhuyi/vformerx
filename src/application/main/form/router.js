export default {
  path: '/form',
  name: 'form',
  components: {
    default: resolve => require(['./index'], resolve)
  },
  Info: {
    description: 'form测试',
    step: -1,
    param: {}
  }
}