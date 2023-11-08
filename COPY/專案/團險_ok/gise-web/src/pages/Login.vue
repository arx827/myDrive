<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue'
import { Form } from 'ant-design-vue'
import type { Rule, RuleObject } from 'ant-design-vue/es/form'
import type { ImgCreation, EmpCredentials, ETermGroupDto, ETermsDto } from '@fubonlife/gise-api-axios-sdk'
import { useLoadingStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ErrorType } from '@plugins/global/index'
import { useSystemLink } from '../composables/useSystemLink'

interface formType {
  companyNo: string
  idNo: string
  password: string
  captcha: string
}
interface ErrorInfosType {
  companyNo: string
  idNo: string
  password: string
  captcha: string
}
const loadingStore = useLoadingStore()

const {
  proxy: { $modal, $authApi, $global, $user, $selfPayEFormApi },
} = getCurrentInstance()
const $router = useRouter()

const modelRef = ref<formType>({
  // TEST:
  // companyNo: '01801726',
  // idNo: 'O100237690',
  // password: 'Aa20230617',
  companyNo: null,
  idNo: null,
  password: null,
  captcha: '',
})

const captcha = ref<ImgCreation>({
  hashDate: null,
  hashId: null,
  imgBase64: null,
})
const errorInfos = ref<ErrorInfosType>({
  companyNo: null,
  idNo: null,
  password: null,
  captcha: null,
})
const accountId = ref<string>(null)
const accessToken = ref<string>(null)
const userInfo = ref<{}>(null)

const validateCompanyNo = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('請輸入公司統一編號')
  if (value.length < 8) return Promise.reject('請輸入完整之統一編號')
  if (errorInfos.value && errorInfos.value.companyNo) return Promise.reject(errorInfos.value.companyNo)
  return Promise.resolve()
}

const validateIdNo = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject('請輸入身分證字號/居留證號')
  if (!/^[A-Za-z0-9]{8,10}$/.test(value)) return Promise.reject('請輸入完整之身分證字號/居留證號')
  if (errorInfos.value && errorInfos.value.idNo) return Promise.reject(errorInfos.value.idNo)
  return Promise.resolve()
}
const formRules = ref<{ [k: string]: RuleObject | RuleObject[] }>({
  companyNo: [{ required: true, validator: validateCompanyNo }],
  idNo: [{ required: true, validator: validateIdNo }],
  password: [
    { required: true, message: '請輸入密碼' },
    { min: 8, message: '請輸入至少8碼之密碼' },
    {
      pattern: /^[A-Za-z0-9~!@#\u0020$%^&*()_+{}|:"<>?`\-=[\]\\;',./]{8,12}$/,
      message: '密碼不符，請再次輸入',
    },
  ],
  captcha: [
    { required: true, message: '請輸入驗證碼' },
    { pattern: /^[0-9]{6}$/, message: '請輸入6碼數字之驗證碼' },
  ],
})
const { validate, validateInfos } = Form.useForm(modelRef, formRules)

const {
  getConsentContent,
  modalConsentContent1,
  modalConsentContent2,
  isModalConsent1Visible,
  isModalConsent2Visible,
  closeModalConsent,
  openModalConsent,
} = useModalConsent()
const { getCaptcha, login, agreeConsentAndLogin } = useFormApi()
const { links, fetchSystemLinks } = useSystemLink()
const { resetErrors, signIn } = useHandleForm()

// 同意書(有P2會員時)
function useModalConsent() {
  const isModalConsent1Visible = ref<boolean>(false) //富邦人壽團險自費E填表同意書(第一份告知聲明)
  const isModalConsent2Visible = ref<boolean>(false)
  const modalConsentContent1 = ref<ETermsDto>(null)
  const modalConsentContent2 = ref<ETermsDto>(null)
  // 關閉同意書彈窗
  const closeModalConsent = (target: string) => {
    switch (target) {
      case '1':
        isModalConsent1Visible.value = false
        break
      case '2':
        isModalConsent2Visible.value = false
        break

      default:
        isModalConsent1Visible.value = false

        isModalConsent2Visible.value = false
        break
    }
  }

  const openModalConsent = (target: string) => {
    target === '1' ? (isModalConsent1Visible.value = true) : (isModalConsent2Visible.value = true)
  }

  const getConsentContent = async () => {
    loadingStore.setLoading(true)
    const requestData: ETermGroupDto = {
      route: 'Index',
      termsGroup: 'EMP_P2_FIRST_LOGIN',
    }
    await $selfPayEFormApi
      .getTermsAndNoticeUsingPOST(requestData)
      .then(resp => {
        modalConsentContent1.value = resp.data.data[0]
        modalConsentContent2.value = resp.data.data[1]
      })
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      //   // console.log('error status = ', error.status)
      // })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  return {
    modalConsentContent1,
    modalConsentContent2,
    isModalConsent1Visible,
    isModalConsent2Visible,
    closeModalConsent,
    openModalConsent,
    getConsentContent,
  }
}

function useHandleForm() {
  // 清空錯誤資訊
  const resetErrors = () => {
    errorInfos.value = {
      companyNo: null,
      idNo: null,
      password: null,
      captcha: null,
    }
  }
  const signIn = () => {
    $user.signIn(accessToken.value, userInfo.value)
    $router.push({ name: 'Index' })
  }
  return { resetErrors, signIn }
}

function useFormApi() {
  // 生成驗證碼圖片API
  const getCaptcha = (): Promise<void> => {
    return $authApi.kaptchaUsingPOST().then(resp => {
      captcha.value.imgBase64 = `data:image/png;base64,${resp.data.imgBase64}`
      captcha.value.hashDate = resp.data.hashDate
      captcha.value.hashId = resp.data.hashId
    })
  }

  // 員工登入API
  const login = () => {
    loadingStore.setLoading(true)
    const requestData: EmpCredentials = {
      companyNo: modelRef.value.companyNo,
      hashDate: captcha.value.hashDate,
      hashId: captcha.value.hashId,
      idNo: modelRef.value.idNo,
      password: modelRef.value.password,
      word: modelRef.value.captcha,
    }
    $authApi
      .empLoginUsingPOST(requestData)
      .then(async resp => {
        console.log(resp)
        if (resp.data.status === 200) {
          const data = resp.data.data
          accessToken.value = data.accessToken
          userInfo.value = data
          accountId.value = data.accountId
          if (data.isShowNotice === 'Y') {
            // 是P2會員打開同意書彈窗
            await getConsentContent()
            openModalConsent('1')
          } else {
            signIn()
          }
        } else {
          const errorType = $global.getApiErrorType(resp?.data?.errors)
          const getError = JSON.parse(JSON.stringify(resp?.data?.apiError))
          if (errorType === ErrorType.ColumnErrorException) {
            getError.map(i => {
              if (!modelRef.value[i.column]) {
                $modal.error({
                  title: '錯誤',
                  content: i.message || '部分欄位有誤',
                })
              } else {
                errorInfos.value[i.column] = i.message || '欄位有誤'
                validate(i.column)
              }
            })
            // 捲到錯誤欄
            setTimeout(() => {
              document.querySelector('.ant-form-item-has-error')?.scrollIntoView()
            }, 100)
          } else {
            if ($global.getApiErrorMsg(resp?.data?.apiError).includes('您尚未成為會員')) {
              showConfirmModal()
            } else {
              $modal.error({
                title: '錯誤',
                content: $global.getApiErrorMsg(resp?.data?.apiError) || '欄位有誤',
              })
            }
          }
        }
      })
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      //   // console.log('error status = ', error)
      // })
      .finally(() => {
        loadingStore.setLoading(false)
      })
  }

  // 同意P3會員告知聲明API
  const agreeConsentAndLogin = () => {
    loadingStore.setLoading(true)
    $authApi
      .agreeMemberNoticeUsingPOST(accountId.value)
      .then(resp => {
        // 成功到首頁
        if (resp.data.status === 200) {
          signIn()
        }
      })
      // .catch(() => {
      //   $modal.error({
      //     title: '錯誤',
      //     content: '系統有誤，請洽系統管理者',
      //   })
      //   // console.log('error status = ', error.status)
      // })
      .finally(() => {
        loadingStore.setLoading(false)
        closeModalConsent('all')
      })
  }

  return { getCaptcha, login, agreeConsentAndLogin }
}

//(無P2P3會員時)
const showConfirmModal = () => {
  $modal.confirm({
    title: '查無會員身分',
    content: '您尚未註冊會員，是否前往註冊？',
    okText: '註冊',
    onOk: () => {
      $router.push({ name: 'SignUp' })
    },
  })
}

// 送出表單
const onSubmit = () => {
  resetErrors()
  validate()
    .then(() => {
      login()
    })
    .catch(err => {
      console.log('error', err)
    })
}

onMounted(() => {
  loadingStore.setLoading(true)
  Promise.all([
    getCaptcha(),
    fetchSystemLinks('LINK_GROUP_PROMO'), //團險好康
    fetchSystemLinks('LINK_PRODUCT_INTRO'), //產品介紹
  ])
    // .catch(() => {
    //   $modal.error({
    //     title: '錯誤',
    //     content: '系統有誤，請洽系統管理者',
    //   })
    // })
    .finally(() => loadingStore.setLoading(false))

  sessionStorage.clear()
})
</script>

<template>
  <LayoutHeader />
  <Loading />
  <div
    class="flex flex-1 bg-none bg-cover bg-fixed bg-center bg-no-repeat md:bg-[url('@/assets/imgs/image_loginbg.jpg')] lg:items-center"
  >
    <div class="container grid justify-items-center p-0 lg:justify-items-end lg:px-[15px]">
      <div class="w-full md:my-[40px] md:w-[540px] lg:w-[612px]">
        <CardShadowRound title="會員登入">
          <p class="mb-4 text-lg">本功能為經申請核准之團險客戶提供所屬員工使用。</p>
          <a-form layout="vertical">
            <a-form-item v-bind="validateInfos.companyNo" label="公司統一編號" required>
              <a-input
                v-model:value.trim="modelRef.companyNo"
                :maxLength="8"
                oninput="this.value = this.value.replace(/[^0-9.]/g, '')"
                placeholder="e.g. 12345678"
              />
            </a-form-item>
            <a-form-item v-bind="validateInfos.idNo" label="身分證字號/居留證號" required>
              <a-input
                v-model:value.trim="modelRef.idNo"
                :maxLength="10"
                @input="modelRef.idNo = $event.target.value.trim().toUpperCase()"
                onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                placeholder="e.g. A123456789"
              />
            </a-form-item>
            <a-form-item v-bind="validateInfos.password" label="密碼" required>
              <a-input-password
                v-model:value.trim="modelRef.password"
                :minLength="8"
                :maxLength="12"
                onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                placeholder="8-12位數密碼，請留意英文大小寫"
              />
            </a-form-item>
            <a-form-item v-bind="validateInfos.captcha" label="驗證碼" required>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <a-input
                    v-model:value="modelRef.captcha"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"
                    class="w-full"
                    :maxLength="6"
                    placeholder="圖中6碼數字"
                    :controls="false"
                  />
                </div>
                <div class="flex items-center justify-end text-right">
                  <img class="max-w-[calc(100%-35px)] pe-[18px]" :src="captcha.imgBase64" />
                  <sync-outlined @click="getCaptcha" class="cursor-pointer text-lg text-primary" />
                </div>
              </div>
            </a-form-item>
            <!-- <a-form-item class="error-infos" :wrapper-col="{ span: 14, offset: 4 }" v-bind="errorInfos">
            <a-button type="primary" @click.prevent="onSubmit">Create</a-button>
          </a-form-item> -->
            <ButtonRoundedPrimary class="mt-[16px]" @click.prevent="onSubmit" size="full">登入</ButtonRoundedPrimary>
          </a-form>
          <div class="pb-[32px] pt-[16px] text-center md:pb-0">
            <div class="pb-[15px] lg:pb-[10px]">
              <router-link to="/forget-password">
                <a class="hover:text-black hover:underline" href="#">忘記/重設密碼</a>
              </router-link>
            </div>
            <div class="divide-x divide-neutral-entry">
              <router-link to="/sign-up">
                <a class="px-[15px] hover:text-black hover:underline" href="#">會員註冊</a>
              </router-link>
              <a class="px-[15px] hover:text-black hover:underline" :href="links.LINK_GROUP_PROMO">團險好康</a>
              <a class="px-[15px] hover:text-black hover:underline" :href="links.LINK_PRODUCT_INTRO">商品介紹</a>
            </div>
          </div>
        </CardShadowRound>
      </div>
    </div>
  </div>
  <LayoutFooter />

  <ModalConsent
    v-model:visible="isModalConsent1Visible"
    @confirm="openModalConsent('2')"
    @reject="closeModalConsent('1')"
  >
    <template #content>
      <div class="text-lg font-semibold">{{ modalConsentContent1.title }}</div>
      <div v-html="modalConsentContent1.content"></div>
    </template>
  </ModalConsent>

  <ModalConsent
    v-model:visible="isModalConsent2Visible"
    @confirm="agreeConsentAndLogin"
    @reject="closeModalConsent('')"
  >
    <template #content>
      <div class="text-lg font-semibold">{{ modalConsentContent2.title }}</div>
      <div v-html="modalConsentContent2.content"></div>
    </template>
  </ModalConsent>
</template>

<style scoped></style>
