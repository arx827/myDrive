# 表單驗證套件 VeeValidate3
> 此教學文章針對 Vue2 套用方法講解。

[[VeeValidate 3]](https://vee-validate.logaretm.com/v3/)、[[Github]](https://github.com/logaretm/vee-validate)
VeeValidate 是專用於 Vue.js 的表單驗證套件。它有很多預設驗證規則，也支持自定義驗證規則。

## 1. 安裝
  #### 安裝v3.x版本 `vee-validate`：
  ```sh
  npm install vee-validate@3 --save
  ```

  #### 導入：
  ```js
  // main.js
  import { ValidationObserver, ValidationProvider, extend, localize} from 'vee-validate';
  import * as rules from 'vee-validate/dist/rules';
  import TW from 'vee-validate/dist/locale/zh_TW.json';

  Object.keys(rules).forEach((rule) => {
    extend(rule, rules[rule]);
  });

  localize('zh_TW', TW);

  Vue.component('ValidationObserver', ValidationObserver);
  Vue.component('ValidationProvider', ValidationProvider);
  ```
  <!-- 安裝內容會在下方依序說明。 -->

## 2. 添加規則
  預設情況下，VeeValidate 不附帶任何驗證規則，這是為了使檔案輕量。
  首先導入定義規則所需的 `extend` 函式：
  ```js
  import { extend } from 'vee-validate';
  // rules
  ```
  接下來，就是加入規則。

  ### 2.1 安裝所有規則
  安裝所有規則有兩種遍歷作法：
  ```js
  import { extend } from 'vee-validate';
  import * as rules from 'vee-validate/dist/rules';

  // 作法一
  Object.keys(rules).forEach((rule) => {
    extend(rule, rules[rule]);
  });

  // 作法二(with typescript)
  for (let [rule, validation] of Object.entries(rules)) {
    extend(rule, {
      ...validation,
    });
  }
  ```
  除了上述方法，另一種方法是安裝 `vee-validate` 的完整捆綁包，而不是預設捆綁包，該捆綁包預裝了所有驗證規則及其英文消息。

  將 `'vee-validate'` 替換成 `'vee-validate/dist/vee-validate.full.esm'`，就可以一次安裝所有驗證規則，而不用導入 extend 函式。
  ```js
  import { ValidationObserver, ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
  ```
  > 但不建議一次安裝全部規則，應該使用下面的方式，按照需求安裝。

  ### 2.2 導入規則
  為了避免一次加載全部規則，可以選擇需求來導入規則：
  ```js
  import { extend } from 'vee-validate';
  import { required, email } from 'vee-validate/dist/rules';  // 按需求導入規則

  extend('required', required);
  extend('email', email);
  ```
  更多可用規則可以參考 [官方文件](https://vee-validate.logaretm.com/v3/guide/basics.html)。

## 3. 基本用法
  導入 `ValidationProvider` 元件：
  ```js
  import { ValidationProvider } from 'vee-validate';

  // 在 main.js 全域註冊元件
  Vue.component('ValidationProvider', ValidationProvider);  

  // 區域註冊元件（推薦）
  export default {
    components: {
      ValidationProvider,
    },
  };
  ```

  2.X 版原本是添加 `v-validate`，而 3.X版則改用 `ValidationProvider` 元件進行包裹：
  ```html
  <ValidationProvider v-slot="{ failed, errors }" name="name" rules="required">
      <label for="username">*收件人姓名</label>
      <input
        type="text"
        name="name"
        :class="{ 'is-invalid': failed }"
        placeholder="輸入姓名"
      />
      <span v-if="failed" class="text-danger">{{ errors[0] }}</span>
  </ValidationProvider>
  ```
  - `name` 為報錯時，顯示的名稱。
  - 在 `rules` 上，添加要驗證的規則。
  - 插槽範圍內可用的屬性，可以參考 [官方文件](https://vee-validate.logaretm.com/v3/api/validation-provider.html)。
    - `errors`：錯誤訊息列表，`errors[0]` 則代表驗證錯誤規則底下定義的 `messages`
    - `failed`：如果經過驗證且無效，則值為 `false`

  預設情況下，ValidationProvider 渲染器為 `span` 標籤，可以使用套件提供的 `prop` 來改變呈現標籤：
  ```html
  <ValidationProvider tag="div"></ValidationProvider>
  ```

## 4. 表單提交前的處理
  ```js
  import { ValidationObserver } from 'vee-validate';

  // 在 main.js 全域註冊元件
  Vue.component('ValidationObserver', ValidationObserver);

  // 區域註冊元件（推薦）
  export default {
    components: {
      ValidationObserver,
    },
  };
  ```

  ##### 基本範例：
  ```html
  <ValidationObserver v-slot="{ invalid }">
    <form @submit.prevent="onSubmit">
      <!--   ....   -->
      <button type="submit" :disabled="invalid">Submit</button>
    </form>
  </ValidationObserver>
  ```
  提交按鈕目前為禁用，只有當表單通過驗證才可以送出。

  ##### 提交前驗證：
  ```html
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(onSubmit)">
      <!--   ....   -->
      <button type="submit">Submit</button>
  </ValidationObserver>
  ```
  ValidationObserver 提供了一個 handleSubmit 可用於保護表單提交的 handleSubmit 功能。

  ##### 重置表單：
  ```html
  <ValidationObserver v-slot="{ reset }">
    <form @reset.prevent="reset">
      <!--   ....   -->
      <button type="reset">Reset</button>
    </form>
  </ValidationObserver>
  ```

  ### 4.1 使用 $refs
  先通過 `$refs` 找到 `ValidationObserver` 元件，呼叫組件中的方法 `validate()`，如果所有條件都為真（就是說所有的校驗都通過了）回傳 `true`，否則回傳 `false`。
  ```html
  <ValidationObserver ref="form">
    <form @submit.prevent="onSubmit">
    
    </form>
  </ValidationObserver>
  ```
  ```js
  onSubmit () {
    this.$refs.form.validate().then((success) => {
      if (success) {
        // 證成功後的行為包含 AJAX傳送、重製表單等等
      } else {
        // 驗證失敗產生的行為
      }
    });
  },
  ```

  ### 4.2 顯示初始驗證狀態
  使用 `immediate`顯示　初始驗證狀態：
  ```html
  <ValidationObserver rules="required"  v-slot="{ errors }"　immediate>
    <!-- ... -->
  </ValidationObserver>
  ```
  
## 5. 中文化
  `vee-validate` 附帶了一個很小的 i18n 字典，可滿足基本的 i18n 需求。`vee-validate` 的預設語言是 en。

  雖然 `vee-validate` 具有 40 多個可用於互動的驗證的語言環境，但是預設情況下不會安裝它們，因此需要導入所需的語言環境。

  導入安裝語言環境所需的 `localize` 函式：
  ```js
  import { localize } from 'vee-validate';
  ```
  安裝需要的使用語言環境，並使用 `localize()` 增加新的語言環境：
  ```js
  import TW from 'vee-validate/dist/locale/zh_TW.json';
  localize('zh_TW', TW);
  ```

