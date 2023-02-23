<template>
    <div tabindex="-1" @keyup.enter="isInitSearch = false;infTransferSearch()">
        <a-form-model
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            :gutter="[{ xs: 10, xxl: 10 }, 0]"
            :rules="infTransferFormRules"
            class="infTransfer"
            labelAlign="right"
            style="margin-left:30px"
        >
        <a-row type="flex" :gutter="[{ xs: 10, xxl: 10 }, 0]">
            <a-col  :xs="24" :md="12" :xl="8" :xxl="6">
                <!-- 姓名 -->
                <a-form-model-item :label="$t('infTransferForm_name')"
                    :has-feedback="infTransferValidateForm.name.feedback"
                    :validateStatus="infTransferValidateForm.name.state"
                    prop="name"
                >
                    <a-popover
                        placement="top"
                        :content="infTransferValidateForm.name.msg"
                        :trigger="infTransferValidateForm.name.hover"
                    >
                        <a-input v-model="form.name" :maxLength="10"/>
                    </a-popover>
                </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
                <!-- 分機 -->
                <a-form-model-item :label="$t('infTransferForm_ext')"
                    :has-feedback="infTransferValidateForm.ext.feedback"
                    :validateStatus="infTransferValidateForm.ext.state"
                    prop="ext"
                >
                    <a-popover
                        placement="top"
                        :content="infTransferValidateForm.ext.msg"
                        :trigger="infTransferValidateForm.ext.hover"
                    >
                        <a-input v-model="form.ext" :maxLength="10"/>
                    </a-popover>
                </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="6" style="margin-left:10px;margin-top:3px">
                <a-space>
                    <!-- 查詢 -->
                    <a-button type="primary" @click="isInitSearch = false;infTransferSearch()">{{ $t("global_search") }}</a-button>
                    <!-- 轉件 -->
                    <a-button type="primary" @click="infTransfering">{{ $t('infTransferForm_transfering') }}</a-button>
                </a-space>
            </a-col>
        </a-row>
        <a-row type="flex">
          <a-col flex="1">
            <a-form-model-item label="通知窗口清單" style="margin-left:-7%" required>
              <p v-if="form.personList.length > 0" >
                <a-tag closable color="blue"
                  v-for="(item) in form.personList"
                  :key="item.value"
                  @close="onTransferPersonChange(item.value)"
                >
                  {{ item.label }}
                </a-tag>
              </p>
            </a-form-model-item>
          </a-col>
        </a-row>
            
            
        </a-form-model>

         <!-- 會辦項目清單 -->
        
        

        <div class="fbl-table">
            <FblDataGrid
                :rowKey="grid.rowKey"
                :columns="grid.columns"
                :data="grid.data"
                :pagination="grid.pagination"
                :scroll="grid.scroll"
                size="middle"
                @tableChange="onPageChange($event)"
                @checkedChange="onCheckedChange($event)"
                :checkSelected="checkSelected"
            >
            </FblDataGrid>
        </div>
    </div>
</template>
<script src="./Countersignature_transfer_com.ts" lang="ts"></script>