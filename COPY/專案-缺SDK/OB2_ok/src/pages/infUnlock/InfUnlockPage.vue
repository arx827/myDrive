<template >
  <div tabindex="-1" @keyup.enter="userUnlockSearch()">
    <HiddenFolde>
      <template v-slot:hiddenArea="hiddenFoldeStyle">
        <a-form-model
          :label-col="{ xs: 7, md: 9, xxl: 7 }"
          :wrapper-col="{ xs: 17, md: 15, xxl: 17 }"
          :model="infUnlockSearchForm"
          :style="hiddenFoldeStyle.color"
          class="countersignatureSearchPage"
        >
          <a-row
            type="flex"
            :gutter="[{ xs: 10, xxl: 10 }, 0]"
            style="margin-left: -10px"
          >
            <a-col :xs="24" :md="12" :xl="8" :xxl="5">
              <!-- 部門 -->
              <a-form-model-item>
                <span slot="label"> {{ $t("global_department") }} </span>
                <a-select
                  mode="multiple"
                  class="select"
                  v-model="infUnlockSearchForm.departmentIdList"
                  :allowClear="true"
                  :options="depOptions"
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
                  v-model="infUnlockSearchForm.divisionIdList"
                  :allowClear="true"
                  :options="divOptons"
                  :filter-option="filterOption"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <!-- 使用者帳號 -->
            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <a-form-model-item
                :label="$t('unlockPage_user_account')"
                style="margin-bottom: 0px"
              >
                <a-input type="text" v-model="infUnlockSearchForm.userId" />
              </a-form-model-item>
            </a-col>

            <a-col :xs="24" :md="12" :xl="8" :xxl="6">
              <!-- 使用者姓名 -->
              <a-form-model-item
                :label="$t('unlockPage_user_name')"
                prop="name"
                style="margin-bottom: 0px"
              >
               <a-input type="text" v-model="infUnlockSearchForm.userName" />
              </a-form-model-item>
            </a-col>
          </a-row>
         
          <!-- <div> -->
            <a-row type="flex" justify="center" class="searchBar">
              <!-- 查詢 -->
              <a-button type="primary" @click="infUnlockSearch()">{{
                $t("global_search")
              }}</a-button>
              <!-- 清除 -->
              <a-button type="default" @click="clear()">{{
                $t("global_clean")
              }}</a-button>
            </a-row>
          <!-- </div> -->
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

<script src="./InfUnlockPage.ts" lang="ts"></script>
