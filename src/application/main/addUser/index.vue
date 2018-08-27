<template>
  <div>
    <tab>
      <tab-item selected @on-item-click="onItemClick('p1')">已发货</tab-item>
      <tab-item @on-item-click="onItemClick('p2')">未发货</tab-item>
      <tab-item @on-item-click="onItemClick('p3')">全部订单</tab-item>
    </tab>
    <za-title className="main-title" name="applicanttitle">
      投保人信息
    </za-title>
    <form-unit name='form1' :formModels="formModels['form1']" @formChange="onChange" @formEvent="onEvent">

    </form-unit>
    <za-title className="main-title" name="applicanttitle">
      被投保人信息
    </za-title>
    <!-- <form-unit name='form2' :formModels="formModels['form2']" @formChange="onChange" >

    </form-unit> -->
    <form-unit v-for="(v,i) in copyFormModels" :key='i' :name='v' :formModels="formModels[v]" @formChange="onChange" >

    </form-unit>
    <!-- <p v-for="(v,i) in copyFormModels" :key='i'>
      {{v}}
    </p> -->

    <za-title className="main-title" name="applicanttitle">
      投保人demo
    </za-title>
    <form-unit name='form3' :formModels="formModels['form3']" @formChange="onChange" @formEvent="onEvent">

    </form-unit>
    <div class="btn-container" @click='insertUser'>
      <div  class="weui-btn add">
        <span class="icon-add-blue"></span>
          <span class="vertivalm">添加被保人</span>
      </div>
    </div>
    <div class="btn-next">下一步</div>
  </div>
</template>
<script>
import { ARTICLELIST } from "@/api";
import * as types from "@/store/mutation-types";
import { formUnit, Tab, TabItem, zaTitle } from "vformer";
import { getConfig } from '../getConfig'
export default {
  data() {
    return {
      pageName: "p1",
      copyFormModels: []
    };
  },
  components: {
    formUnit,
    Tab,
    TabItem,
    zaTitle
  },
  methods: {
    onChange(data, field) {
      this.$store.dispatch("update", {
        data,
        page: this.pageName,
        field,
        vux: this.$vux
      });
    },
    insertUser() {
      this.$store.dispatch("insert", { page: "p1", form: "form2" });
      this.renderCopyForm();
    },
    onItemClick(name) {
      this.pageName = name;
    },
    onEvent (t, v) {
    //   const showObj = {
    //     name: '',
    //     val:''
    //   }
    //   const hiddenObj = {
    //     name: '',
    //     val:''
    //   }
    //   if(v.name === 'cardType') {
    //     if(v.value[0] === '01') {
    //       showObj.name = 'idCard'
    //       showObj.val = 'za-input'
    //       hiddenObj.name = 'ppCard'
    //       hiddenObj.val = 'hidden'
    //     }else {
    //       showObj.name = 'ppCard'
    //       showObj.val = 'za-input'
    //       hiddenObj.name = 'idCard'
    //       hiddenObj.val = 'hidden'
    //     }
    //   }
    //   this.$store.commit('changeFormType',{
    //     p: 'p1',
    //     f: 'form1',
    //     obj: showObj
    //   })
    //   this.$store.commit('changeFormType',{
    //     p: 'p1',
    //     f: 'form1',
    //     obj: hiddenObj
    //   })
    },
    renderCopyForm() {
      this.copyFormModels = Object.keys(
        this.$store.state.config.formModels[this.pageName]
      ).filter(v => v.includes("form2"));
    }
  },
  computed: {
    formModels() {
      if(this.$store.state.config.formModels) {
        return this.$store.state.config.formModels[this.pageName] || []
      } else {
        return []
      }
    },
    count() {
      return this.$store.state.count;
    },
    countPlus() {
      return this.$store.getters.countPlus;
    }
  },
  created() {
    getConfig(window.app).then(() => {
      this.renderCopyForm();
    })
  }
};
</script>

<style lang="less" scoped>
.btn-container {
      display: flex;
      justify-content: center;
      text-align: center;
      background-color: #ffffff;
      padding-top: 30px;
      padding-bottom: 30px;
      margin-top: 15px;
      margin-bottom: 60px;
      .btn-add {
        color: #5697ff;
        font-size: 17px;
        background-color: #ffffff;
        text-align: center;
        display: block;
        padding-top: 50px;
        padding-bottom: 50px;
        border: 1px solid #ffffff;
        .icon-add-blue {
          margin-right: 2px;
        }
      }
      .vertivalm{
        vertical-align: middle;
      }
      .add{
        width: 48%;
        border: 1px solid #5697ff;
        background-color: #ffffff;
        color: #5697ff;
        font-size: 16px;
        border-radius: 8px;
        padding: 10px 0;
      }
    }
    //下一步按鈕样式
    .btn-next{
      display: block;
      position: fixed;
      bottom: 0;
      left:0;
      width:100%;
      height:45px;
      line-height: 45px;
      color: #fff;
      text-align: center;
      font-size: 17px;
      z-index: 400;
      background: -webkit-linear-gradient(left, #67a4ff, #0062e8); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(right, #67a4ff, #0062e8); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(right, #67a4ff, #0062e8); /* Firefox 3.6 - 15 */
      background: linear-gradient(to right,#67a4ff, #0062e8); /* 标准的语法（必须放在最后） */
    }
</style>
