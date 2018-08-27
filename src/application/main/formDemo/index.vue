<template>
  <div>
    <form-unit v-for="(formModel, key) in formModels" :key="key" :name="key" :formModels="formModel" @formChange="onChange" @formEvent="onEvent">
    </form-unit>
  </div>
</template>
<script>
import { ARTICLELIST } from "@/api"
import * as types from "@/store/mutation-types"
import { formUnit, Tab, TabItem } from "vformer"
import { getDemoConfig } from '../getConfig'
export default {
  data () {
    return {
      pageName: 'p1'
    };
  },
  components: {
    formUnit, Tab, TabItem
  },
  methods: {
    onChange (data, field) {
      console.log(data, field)
      this.$store.dispatch("update", {
        data,
        page: this.pageName,
        field,
        vux: this.$vux
      });
    },
    onItemClick () {

    },
    onEvent (t, v) {
      console.log('事件', t, v);
      // this.$store.dispatch('eventUpdated', v);
      
    },
    render () {
      getDemoConfig(window.app)
    }
  },
  computed: {
    formModels () {
      if(this.$store.state.config.formModels) {
        return this.$store.state.config.formModels[this.pageName] || []
      } else {
        return []
      }
    }
  },
  created () {
    this.render();
  }
};
</script>

<style lang="less" scoped>

</style>
