import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import Router from './router'
import Api from '@plugins/api'

import Global from '@plugins/global'
import EnumData from '@plugins/global/enumData'

import NumberUtil from '@plugins/util/numberUtil'
import DateTimeUtil from '@plugins/util/dateTimeUtil'
import ValidateUtil from '@plugins/util/validateUtil'
import BlobUtils from '@plugins/util/blobUtil'

import Message from '@plugins/message'
import Notification from '@plugins/notification'
import Modal from '@plugins/modal'
import User from '@plugins/user'

import './assets/style/layout.scss'

import { useRoute } from 'vue-router'
import DatePicker from '@fubonlife/vue-datepicker-next/index.es.js'
import ZhTW from '@fubonlife/vue-datepicker-next/locale/zh-tw.es'
import '@fubonlife/vue-datepicker-next/index.css'

import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/solarized-dark.css'

const app = createApp(App)

app.use(createPinia())
app.use(Api)

app.use(Global, { Router })
app.use(EnumData)
app.use(User, { Router })
app.use(NumberUtil, { EnumData, ValidateUtil })
app.use(DateTimeUtil, { Global, EnumData })
app.use(ValidateUtil, { Global, EnumData })
app.use(BlobUtils)

app.use(VueHighlightJS)

app.use(Message)
app.use(Notification)
app.use(Modal)

app.use(Router)

// https://github.com/mengxiong10/vue-datepicker-next
app.component('DatePicker', DatePicker)

DatePicker.locale('zh-tw', {
  formatLocale: ZhTW.formatLocale,
  yearFormat: 'YYYY',
  twCanlender: true, // 打開民國年顯示模式
})
app.mount('#app')
