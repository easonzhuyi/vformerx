/*
* @Author: jankergg
* @Date:   2018-05-08 11:13:40
* @Last Modified by:   jankergg
* @Last Modified time: 2018-06-06 11:15:29
*/

import Vue from 'vue'
import Router from 'vue-router'
// 页面模块 start
// import 页面模块
import gallery from '../base/gallery'
import demo from '../../../demo'
import article from './article/router'
import form from './form/router'
// 页面模块 end

// 所有页面
const ROUTEES = [
  gallery,
  demo,
  article,
  form
]
window.gg = gallery
Vue.use(Router)

const myRouter = new Router({
  mode: 'history', // 启用history模式
  routes: ROUTEES
})
export {myRouter as default}
