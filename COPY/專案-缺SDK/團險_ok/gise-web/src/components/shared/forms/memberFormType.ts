export enum MemberFormNameType {
  SIGNUP = 'signup',
  FORGET_PASSWORD = 'forget-password',
}

export enum MemberFormSessionName {
  STEP1 = 'memberFormStep1',
  STEP2 = 'memberFormStep2',
  STEP3 = 'memberFormStep3',
}

// 註冊表單
export interface FormSignUpType {
  idNo: string
  email: string
  password: string
  birthday: string
  identity: string
  carrier: string
  mobileNo: string
}

// 忘記密碼表單
export interface FormForgetPasswordType {
  idNo: string
  email: string
  newPassword: string
}

export interface FormStep2Type extends FormForgetPasswordType, FormSignUpType {}

// 密碼檢核規範
export interface PasswordValidateType {
  name: string
  isValid: boolean
  regex: RegExp | string
}

// 身份驗證選項
export interface IdentityOptionType {
  name: string
  value: string
  children: string[]
}
