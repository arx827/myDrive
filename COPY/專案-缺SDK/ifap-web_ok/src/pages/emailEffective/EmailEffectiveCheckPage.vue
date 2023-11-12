<template>
  <div>
    <Steps :current="current" />
    <div class="emailCheck__page">
      <div class="emailCheckWrap">
        <h1 class="pageTitle">
          {{ title }}
        </h1>
        <h3 class="pageSubTitle">
          請輸入保戶 {{ custName }} 以下資料進行驗證
        </h3>
        <a-form-model
          ref="formRef"
          class="emailCheck__form"
          :model="form"
          :hideRequiredMark="true"
          :layout="forms.layout"
        >
          <a-form-model-item
            prop="custId"
            label="身分證號碼/居留證字號末6碼"
          >
            <a-input
              id="custId"
              v-model="form.custId"
              size="large"
              placeholder="請輸入"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item
            prop="type"
            label="驗證碼"
          >
            <a-row type="flex" :gutter="24" align="middle">
              <a-col flex="1">
                <a-input
                  v-model="form.type"
                  autocomplete="off"
                  size="large"
                  placeholder="請輸入"
                />
              </a-col>
              <a-col class="base64__Img">
                <img :src="base64" alt="">
              </a-col>
              <a-col>
                <a-icon
                  class="reload__Icon"
                  type="sync"
                  :rotate="45"
                  @click="verifyCode()"
                />
              </a-col>
            </a-row>
          </a-form-model-item>
          <a-form-model-item>
            <a-row type="flex" justify="center">
              <a-col>
                <a-button class="button--gradient" @click="submit()">
                  送出
                </a-button>
              </a-col>
            </a-row>
          </a-form-model-item>
        </a-form-model>
        <a-modal
          v-model="visible"
          width="400px"
          :closable="false"
          :keyboard="false"
          :maskClosable="false"
          :footer="null"
        >
          <div class="icon_in_modal">
            <a-icon
              type="close-circle"
              theme="filled"
              :style="{ color: '#f5222d', fontSize: '30px' }"
            />
          </div>
          <p class="title_in_modal">
            {{ fieldInvalidTitle }}
          </p>
          <ul class="modal__container">
            <li v-for="(item, idx) in fieldInvalidMessageArr" :key="idx">
              {{ item }}
            </li>
            <!-- {{ fieldInvalidMessage }} -->
          </ul>
          <div class="modal__footer">
            <a-button class="button--gradient ant-btn" @click="handleOk">
              確認
            </a-button>
          </div>
        </a-modal>
        <a-modal
          v-model="timeOutVisible"
          width="400px"
          :closable="false"
          :keyboard="false"
          :maskClosable="false"
          :footer="null"
        >
          <p class="p_in_timeout_modal">
            {{ timeout_Message }}
          </p>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<script src="./EmailEffectiveCheckPage.ts" lang="ts"></script>

<style lang="scss" scoped>
p {
  color: black;
}
.emailCheck__page {
  border-radius: 5px;
  width: 95%;
  height: 80%;
  margin: 40px auto 0px;
  padding: 5px;
  background-color: #fff;
}

.emailCheckWrap {
  max-width: 400px;
  margin: 40px auto;
}
.pageTitle {
  color: #1489d1;
  font-size: 22px;
  border-bottom: 3px solid #1489d1;
  padding-bottom: 8px;
}
.pageSubTitle {
  font-size: 20px;
  padding-left: 10px;
  border-left: 5px solid #333333;
  line-height: 1.4;
  margin-top: 20px;
}

::v-deep {
  .ant-form-item-label {
    font-size: 16px;
  }
  .ant-form-item-label {
    padding-bottom: 5px;
    &::after {
      content: "*";
      color: #ef5d5d;
      margin-left: 3px;
      font-size: 1rem;
      height: 1.3rem;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .ant-modal {
    width: 400px;
    top: 280px;
  }

  .ant-modal-wrap {
    background: #ffffff00;
    opacity: 1;
  }

  .ant-modal-content {
    border-radius: 10px;
    background: #fafafa;
  }
  .ant-modal-body {
    padding: 0px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }
}

.emailCheck__form {
  .ant-form-item {
    margin-bottom: 16px;
  }
}

.base64__Img {
  width: 150px;
  height: 55px;
  img {
    width: 100%;
  }
}

.reload__Icon {
  font-size: 18px;
  color: #1489d1;
}

.button--gradient {
  background: linear-gradient(to right, #28b4be, #4caaf5);
  border-radius: 50vh;
  color: #fff;
  font-size: 16px;
  padding: 11px;
  height: auto;
  line-height: 1;
}

.button_in_modal {
  width: 400px;
  color: #f5222d;
  font: normal normal normal 16px/22px PingFang TC;
  letter-spacing: 0px;
  word-spacing: -3px;
  &:hover {
    border-color: #f5222d;
  }
}

.icon_in_modal {
  margin: 0px 0px 0px 165px;
  padding: 20px 20px 0px;
}
.title_in_modal {
  width: 400px;
  text-align: center;
  font: normal normal medium 16px/21px PingFang TC;
  letter-spacing: 0px;
  color: #333333;
}

.p_in_modal {
  letter-spacing: var(--unnamed-character-spacing-0);
  text-align: center;
  font: normal normal normal 14px/25px PingFang TC;
  letter-spacing: 0px;
  color: #333333;
  padding: 0px 80px 10px;
  width: 400px;
}

.p_in_timeout_modal {
  letter-spacing: var(--unnamed-character-spacing-0);
  text-align: center;
  font: normal normal normal 14px/25px PingFang TC;
  letter-spacing: 0px;
  color: #333333;
  padding: 30px 80px 30px;
  width: 400px;
  height: 100px;
}

.modal__footer {
  display: flex;
  justify-content: center;
  padding: 10px;
  .ant-btn {
    padding: 5px 40px;
    color:#f5222d;
    background: #fafafa;
    &:hover {
    border-color: #f5222d;
  }

  }

}
.modal__container {
  width: 350px;
  margin: 0 auto;
  line-height: 1.8;
}
</style>
