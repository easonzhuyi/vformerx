export default [
  {
    path: '/addUser',
    name: 'addUser',
    components: {
      default: resolve => require(['./index'], resolve)
    },
    Info: {
      description: 'addUser',
      param: {}
    }
  },
  {
    path: '/addUserDemo',
    name: 'addUserDemo',
    components: {
      default: resolve => require(['./demo.vue'], resolve)
    },
    Info: {
      description: 'addUserDemo',
      param: {}
    }
  }
]