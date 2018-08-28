<template>
  <div>
    <tab>
      <tab-item selected @on-item-click="pageName = 'p1'">已发货</tab-item>
      <tab-item @on-item-click="pageName = 'p2'">未发货</tab-item>
      <tab-item @on-item-click="pageName = 'p3'">全部订单</tab-item>
    </tab>
    <form-unit v-for="(formModel, key) in formModels" :key="key" :name="pageName + '-' + key" :formModels="formModel" @formChange="onChange" @formEvent="onEvent">
    </form-unit>
    <button @click="onAddBtnClicked">ADD</button>
  </div>
</template>
<script>
import { ARTICLELIST } from "@/api"
import * as types from "@/store/mutation-types"
import { formUnit, Tab, TabItem } from "@wangweiqi/vformer"
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
    onChange (v) {
      // console.log('数据', v.msg)
      
      this.$store.dispatch('dataUpdated', v);
    },
    onItemClick () {

    },
    onEvent (t, v) {
      console.log('事件', t, v);
      this.$store.dispatch('eventUpdated', v);
      
    },
    render () {},
    onAddBtnClicked () {
      this.$store.dispatch('insert');
    }
  },
  computed: {
    formModels () {
      // console.log('当前表单配置', this.$store.state.formModels[this.pageName])
      return this.$store.state.formModels[this.pageName]
    },
    count () {
      return this.$store.state.count
    },
    countPlus () {
      return this.$store.getters.countPlus
    }
  },
  created () {
    this.render();
  }
};
</script>

<style lang="less" scoped>

</style>
