<template>
  <a-form-model
    ref="ruleForm"
    :layout="'vertical'"
    :model="form"
    :rules="rules"
  >
    <a-row type="flex" :gutter="[40, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="保單號碼">
          <a-input
            :allowClear="true"
            style="width: 50%; margin-top:8px"
            type="text"
            size="large"
          ></a-input>
          <a-input
            :allowClear="true"
            style="width: 20%; margin-top: 8px; margin-left: 12px;"
            type="text"
            size="large"
          ></a-input>
          <a-input
            :allowClear="true"
            style="width: 20%; margin-top: 8px; margin-left: 12px;"
            type="text"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="保單序號">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="客戶ID">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-col>
      
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="重覆碼">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="交易案號">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="審查部門">
          <a-select class="select" size="large">
            <a-select-option v-for="item in status" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="審查科別">
          <a-select class="select" size="large">
            <a-select-option v-for="item in status" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="審查人員">
          <a-select class="select" size="large">
            <a-select-option v-for="item in status" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="AML審查檔號">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<!--
<template>
     <a-row type="flex" :gutter="[40,40]">
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">保單號碼</div>
            <a-input class="input" size="large" placeholder="請輸入" name="insuranceNo"/>
        </a-col>
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">保單序號</div>
             <a-input class="input"  size="large" placeholder="請輸入" name="insuranceNum"/>
        </a-col>
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">客戶ID</div>
            <a-input class="input"  size="large" placeholder="請輸入" name="customerId"/>            
        </a-col>
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">重覆碼</div>
            <a-input class="input"  size="large" placeholder="請輸入" name="reNumber"/>       
        </a-col>
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">交易案號</div>
            <a-input class="input"  size="large" placeholder="請輸入" name="transNo"/>       
        </a-col>
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">審查部門</div>
            <a-select class="select" size="large" placeholder="請選擇">
                <a-select-option v-for="item in department" :key="item.key">
                    {{ item.value }}
                </a-select-option>
            </a-select>      
        </a-col>
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">審查科別</div>
            <a-select class="select" size="large" placeholder="請選擇">
                <a-select-option v-for="item in secDep" :key="item.key">
                    {{ item.value }}
                </a-select-option>
            </a-select>      
        </a-col>
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">審查人員</div>
            <a-select class="select" size="large" placeholder="請選擇">
                <a-select-option v-for="item in reviewPeo" :key="item.key">
                    {{ item.value }}
                </a-select-option>
            </a-select>       
        </a-col>
        <a-col :xs="24" :md="12" :lg="8" :xxl="6">
            <div class="title">AML審查檔號</div>
            <a-input class="input"  size="large" placeholder="請輸入" name="fileNo"/>       
        </a-col>
    </a-row>
</template>
-->

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class BasicInformation extends Vue {
  private department: { key: string; value: string }[] = [
    { key: "A", value: "部門A" },
    { key: "B", value: "部門B" },
    { key: "C", value: "部門C" },
  ];
  private secDep: { key: string; value: string }[] = [
    { key: "A", value: "科室一" },
    { key: "B", value: "科室二" },
    { key: "C", value: "科室三" },
  ];
  private reviewPeo: { key: string; value: string }[] = [
    { key: "A", value: "審查人員A" },
    { key: "B", value: "審查人員B" },
    { key: "C", value: "審查人員C" },
  ];
}
</script>

<style scoped>
.select {
  width: 100%;
  margin-top: 4px;
}
.title {
  font-size: 16px;
  color: #000000d9;
  font-weight: Medium;
}
.highlight {
  color: red;
}
.padding {
  padding-top: 0.5cm;
}
.input {
  width: 100%;
  margin-top: 4px;
}
</style>
