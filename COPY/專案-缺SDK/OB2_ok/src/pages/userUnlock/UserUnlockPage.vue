<template >
  <div tabindex="-1" @keyup.enter="userUnlockSearch()">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle">
        <a-form-model
          :label-col="{ xs: 7, md: 9, xxl: 7 }"
          :wrapper-col="{ xs: 17, md: 15, xxl: 17 }"
          :model="userUnlockSearchForm"
          :style="hiddenFoldeStyle.color"
          class="countersignatureSearchPage"
        >
          <a-row
            type="flex"
            :gutter="[{ xs: 10, xxl: 10 }, 0]"
            style="margin-left: -10px"
          >
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <!-- 部門 -->
              <a-form-model-item>
                <span slot="label"> {{ $t("global_department") }} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="userUnlockSearchForm.departmentIdList"
                  :allowClear="true"
                  :options="selectDepOptions"
                  :filter-option="filterOption"
                  @change="onSelectDept"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <!-- 科別 -->
              <a-form-model-item>
                <span slot="label"> {{ $t("global_division") }} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="userUnlockSearchForm.divisionIdList"
                  :allowClear="true"
                  :options="selectDiviOptions"
                  :filter-option="filterOption"
                  @change="onSeletDivi"
                
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- 使用者帳號 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('userMP_userAccount')"
                prop="userId"
                style="margin-bottom: 0px"
                :has-feedback="userUnlockValidateObject.userId.feedback"
                :validateStatus="userUnlockValidateObject.userId.feedback== true
                    ? 'error'
                    : 'success'"
              >

               <a-popover
                  placement="top"
                  :destroyTooltipOnHide="true"
                  :content="$t('userMP_userAccountAlphanumericInputOnly')"
                  :trigger="
                    userUnlockValidateObject.userId.feedback == true
                      ? 'hover'
                      : ''
                  "
                  :visible="userUnlockValidateObject.userId.hoverVisible"
                  @visibleChange="
                    userUnlockValidateObject.userId.hoverVisible =
                      !userUnlockValidateObject.userId.hoverVisible
                  "
                >
                  <a-input
                    type="text"
                    v-model="userUnlockSearchForm.userId"
                    @blur="onUserIdclick"
                  />
                </a-popover>

              </a-form-model-item>
            </a-col>
            <a-col :span="5">
              <!-- 使用者姓名 -->
              <a-form-model-item
                :label="$t('userMP_userHumanName')"
                prop="name"
                style="margin-bottom: 0px"
              
              >
               <a-input
                    type="text"
                    v-model="userUnlockSearchForm.userName"
                  />
              </a-form-model-item>
            </a-col>
          </a-row>
         
          <div>
            <a-row type="flex" justify="center" class="searchBar">
                <a-space>
              <!-- 查詢 -->
              <a-button type="primary" @click="userUnlockSearch()">{{
                $t("global_search")
              }}</a-button>
              <!-- 清除 -->
              <a-button type="default" @click="userUnlockSearchReset">{{
                $t("global_clean")
              }}</a-button>
              </a-space>
            </a-row>
          </div>
        </a-form-model>
      </template>
    </HiddenFolde>
   
    <div class="fbl-table">
      <FblDataGrid
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :scroll="grid.scroll"
        size="middle"
        @actionClick="onTableActionClick($event)"
        @tableChange="onPageChange($event)"
      >
      </FblDataGrid>
    </div>
  </div>
</template>

<script src="./UserUnlockPage.ts" lang="ts"></script>
