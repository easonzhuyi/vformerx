<template>
  <div>
    <tab>
      <tab-item selected @on-item-click="onItemClick">表1</tab-item>
      <tab-item @on-item-click="onItemClick">表2</tab-item>
      <tab-item @on-item-click="onItemClick">表3</tab-item>
    </tab>
    <form-unit name='page1.f1' v-show='tabIndex == 0' 
    :formModels='formModels.f1' 
    @formChange="formDataChange" 
    @formEvent='formEvent' ></form-unit>
    <form-unit v-show='tabIndex == 1' 
    name='page1.f2'
    :formModels='formModels.f2' 
    @formChange="formDataChange"
     ></form-unit>
    <form-unit v-show='tabIndex == 2' 
    :formModels='formModels.f3' 
     ></form-unit>
    <p>info: {{$store.state.formModel.config.page1.f2}}</p>
  </div>
</template>
<script>
import {formUnit, Tab, TabItem} from 'vformer'
import { setTimeout } from 'timers'
export default {
  data () {
    return {
      formModels: this.$store.state.formModel.config.page1,
      tabIndex: 0
    }
  },
  methods: {
    formEvent (t, e) {},
    formDataChange (v) {
      this.$store.dispatch('setConfig', v)
    },
    getConfig () {
      this.formModels = this.$store.state.formModel.config.page1
      console.log('==>', this.formModels)
    },
    onItemClick (e) {
      console.log(e)
      this.tabIndex = e
    }
  },
  computed: {
    isSelf () {
      return this.formModels
    }
  },
  created () {
    // this.getConfig()
  },
  mounted () {
    // this.getConfig()
  },
  components: {
    formUnit,
    TabItem,
    Tab
  }
}
</script>
