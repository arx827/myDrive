<script setup lang="ts">
import { ref } from 'vue'
const tableGrid = ref({
  rowKey: 'key',
  scroll: { x: true },
  pagination: false,
  data: [
    {
      key: '1',
      funcName: 'loginState()',
      type: 'accessToken: string,  me: Object ',
      content: '取得登入者資訊',
    },
    {
      key: '2',
      funcName: 'token()',
      type: 'string',
      content: '若已登入，回傳accessToken',
    },
    {
      key: '3',
      funcName: 'init()',
      type: 'boolean',
      content: '當頁面初載入時，判定是否有未失效的token，若有，則自動登入，若無，則導到登入頁面。',
    },
    {
      key: '4',
      funcName: 'hasValidToken()',
      type: 'boolean',
      content: '是否具有效token',
    },
    {
      key: '5',
      funcName: 'signIn(token: string)',
      type: '-',
      content: '登入',
    },
    {
      key: '6',
      funcName: 'signOut(clearToken?: boolean)',
      type: '-',
      content: '登出；clearToken選填，依照專案需求是否有獨立登出API需串接，若有clearToken給true進行登出API呼叫',
    },
    {
      key: '7',
      funcName: 'clearLoginInfo()',
      type: '-',
      content: '清空使用資訊(含sessionStorage、pinia store上資料)',
    },
    {
      key: '8',
      funcName: 'changeToken(newToken)',
      type: '-',
      content:
        '每打一次API，API皆會回傳新Token，將新Token寫入夾帶至header + 更新sessionStorage、pinia store上Token資料',
    },
    {
      key: '9',
      funcName: 'checkTokenExp()',
      type: '-',
      content: '確認Token時效，超過30分鐘跳出閒置彈窗',
    },
    {
      key: '10',
      funcName: 'getMe()',
      type: 'Object',
      content: '取得當前登入者資訊',
    },
    {
      key: '11',
      funcName: 'isTokenExpired(token: string)',
      type: 'boolean',
      content: '<private> 確認Token是否過期',
    },
  ],
  columns: [
    {
      type: 'PLAIN',
      title: '函式',
      dataIndex: 'funcName',
    },
    {
      type: 'PLAIN',
      title: '回傳型態',
      dataIndex: 'type',
    },
    {
      type: 'PLAIN',
      title: '說明',
      dataIndex: 'content',
    },
  ],
})
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">說明</h5>
      <ul class="doc__tool-ul">
        <li>檔案位置：plugins/user/index.ts</li>
        <li>儲存機制：登入後API回傳使用者資訊，使用pinia將資訊儲存至sessionStorage</li>
        <li>
          <div>Token機制：(註:以下做法可依專案需求更改)</div>
          <ol>
            <li>每打一次API，API皆會回傳新Token，將新Token寫入夾帶至header</li>
            <li>每五秒檢查token是否有效，無效（ 超過30分鐘時效）跳閒置30分鐘彈窗登出</li>
          </ol>
        </li>
      </ul>
    </div>
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">如何使用</h5>
      <ul class="doc__tool-ul">
        <li>
          <div>使用全域 $user 呼叫函式</div>
          <PreCode type="bash" class="mt-3">
            <template #code>
              {{
                `// 宣告
const {
  proxy: { $user },
} = getCurrentInstance()

// 呼叫
$user.<方法>`
              }}
            </template>
          </PreCode>
        </li>
        <li>
          <div>方法說明</div>
          <FblDataGrid
            class="ant-table-striped"
            bordered
            :dataSource="tableGrid.data"
            :columns="tableGrid.columns"
            :pagination="tableGrid.pagination"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
