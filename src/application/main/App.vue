
<template>
<div id="app">
  <router-view/>
</div>
</template>

<script>
import Vue from 'vue'

var eventBus = {
  install(Vue, options) {
    Vue.prototype.$bus = new Vue();
  }
}

Vue.use(eventBus)

export default {
  name: 'app'
}
</script>

