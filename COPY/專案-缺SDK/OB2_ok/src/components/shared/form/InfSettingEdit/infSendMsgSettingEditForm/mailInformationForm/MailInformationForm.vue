<template>

    <a-form-model
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 12 }"
      :model="mailInformationForm"
    >
      <!-- 郵寄編號 -->
      <a-form-model-item
        label="郵寄編號"
        prop="mailByPostId"
        style="margin-bottom: 0px"
      >
       <p>{{mailInformationForm.mailByPostId}}</p>
 
      </a-form-model-item>
      <!-- 客戶編號 -->
      <a-form-model-item
        :label="$t('客戶編號')"
        prop="name"
        style="margin-bottom: 0px"
      >
        <p>{{mailInformationForm.custId}}</p>
      </a-form-model-item>
      <!-- 保單號碼 -->
      <a-form-model-item
        :label="$t('保單號碼')"
        prop="casePolicy"
        style="margin-bottom: 0px"
      >
        <p>{{mailInformationForm.casePolicy}}</p>
      </a-form-model-item>
    </a-form-model>
  
</template>
<script src="./MailInformationForm.ts" lang="ts"></script>
