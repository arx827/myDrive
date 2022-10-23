# Vue3 + TypeScript

## 環境搭建
  - 安裝Vue3
  ```sh
  npm init vue@latest
  ```
  這一指令將會安裝並執行`create-vue`，它是 `Vue` 官方的項目腳手架工具。
  將會看到一些諸如 TypeScript 和測試支持之類的可選功能提示：
  ```sh
  ✔ Project name: … <your-project-name>
  ✔ Add TypeScript? … No / Yes
  ✔ Add JSX Support? … No / Yes
  ✔ Add Vue Router for Single Page Application development? … No / Yes
  ✔ Add Pinia for state management? … No / Yes
  ✔ Add Vitest for Unit testing? … No / Yes
  ✔ Add Cypress for both Unit and End-to-End testing? … No / Yes
  ✔ Add ESLint for code quality? … No / Yes
  ✔ Add Prettier for code formatting? … No / Yes

  Scaffolding project in ./<your-project-name>...
  Done.
  ```

如果不確定是否要開啟某個功能，可以直接選擇No。在項目被創建後，通過以下步驟安裝依賴並啟動開發服務器：
  ```sh
  cd <your-project-name>
  npm install
  npm run dev
  ```

## ref()
  `ref()`接受一個內部值，返回一個響應式的、可更改的 `ref` 對象，此對象只有一個指向其內部值的`property .value`。

  #### 類型定義
  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>
  interface Ref<T> {
    value: T
  }
  ```

  #### 為ref() 標註類型
  `ref()`標註類型有三種方式：
  1. 通過泛型參數的形式來給 `ref()`增加類型
  ```ts
  import { ref } from 'vue'

  const initCode = ref<string | number>('200')
  ```

  2. 如果是遇到復雜點的類型，可以自定義 `interface` 然後泛型參數的形式傳入
  ```ts
  import { ref } from 'vue'

  interface User {
    name: string
    age: string | number
  }

  const user = ref<User>({
    name:'前端開發',
    age: 20
  })
  ```

  3. 通過使用 `Ref` 這個類型為 `ref` 內的值指定一個更複雜的類型
  ```ts
  import { ref } from 'vue'
  import type { Ref } from 'vue'

  const initCode: Ref<string | number> = ref('200')
  ```

  #### 三種方式推薦
  比較推薦使用`前兩種`方式，前兩種方式其實都是以`泛型`的形式來標註類型的
  第三種方式需要額外的引入：
  ```ts
  import type { Ref } from 'vue'
  ```
  所以不是很推薦(本著能少寫一行是一行原則)

## reactive()
  `reactive()`返回一個對象的響應式代理。

  #### 類型定義
  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

  #### 為reactive() 標註類型
  `reactive()`標註類型有兩種方式：

  1. 直接給聲明的變數添加類型
  ```ts
  import { reactive } from 'vue'

  interface User {
    name: string
    age: string | number
  }

  const user:User = reactive({
    name:"前端開發",
    age:'20'
  })
  ```

  2. 通過泛型參數的形式來給 `reactive()`增加類型
  ```ts
  import { reactive } from 'vue'

  interface User {
    name: string
    age: string | number
  }

  const user = reactive<User>({
    name:"前端開發",
    age:'20'
  })
  ```

  #### 兩種方式推薦
  `不推薦`使用 `reactive()` 的泛型參數，因為處理了深層次ref 解包的返回值與泛型參數的類型不同。`推薦直接给聲明的變數添加類型`。

## computed ()
接受一個 `getter` 函數，返回一個只讀的響應式 `ref` 對象，即 `getter` 函數的返回值。它也可以接受一個帶有 `get` 和 `set` 函數的對象來創建一個可寫的 `ref` 對象。

  #### 類型定義
  ```ts
  // 唯讀
  function computed<T>(
    getter: () => T,
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // 可寫入
  function computed<T>(
    options: {
      get: () => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

  #### 為computed() 標註類型
  `computed()`標註類型有兩種方式：

  1. 從其計算函數的返回值上推導出類型
  ```ts
  import { ref, computed } from 'vue'

  const count = ref<number>(0)

  // 推導得到的類型：ComputedRef<string>
  const user = computed(() => count.value + '前端開發')
  ```

  2. 通過泛型參數顯式指定 `computed()` 類型
  ```ts
  const user = computed<string>(() => {
    // 若返回值不是 string 類型則會報錯
    return '前端開發'
  })
  ```

  #### 兩種方式推薦
  自動推導類型雖然簡單快捷，但是還是希望`手動`的去`指定`其類型，這樣更加利於代碼的可維護性，所以這裡推薦使用通過泛型參數顯式指定 `computed()` 類型

## defineProps()
為了在聲明 `props` 選項時獲得完整的類型推斷支持，我們可以使用`defineProps`API，它將自動地在 `script setup` 中使用

  #### 為defineProps() 標註類型
  1. 從它的參數中推導類型:
  ```ts
  const props = defineProps({
    name: { type: String, required: true },
    age: Number
  })
  ```

  2. 通過泛型參數來定義 props 的類型
  ```ts
  const props = defineProps<{
    name: string
    age?: number
  }>()
  ```
  當然，也可以把以上的泛型參數定義成一個單獨的`interface`
  ```ts
  interface Props {
    name: string
    age?: number
  }
  const props = defineProps<Props>()
  ```
  > 以上的兩種方式雖然都可以很方便的`標註類型`，但是失去了對 `props` 定義默認值的能力

  目前官方也給出了解決方案，但是目前這個方案還處於實驗性，並且需要`顯示地選擇開啟`。
  ```ts
  // vite.config.js
  export default {
    plugins: [
      vue({
        reactivityTransform: true
      })
    ]
  }
  ```
  通過對 `defineProps()` 的響應性解構來添加默認值：
  ```ts
  <script setup lang="ts">
  interface Props {
    name: string
    age?: number
  }

  const { name = '前端开发爱好者', age = 100 } = defineProps<Props>()
  </script>
  ```

## defineEmits()
為了在聲明 `emits` 選項時獲得完整的類型推斷支持，我們可以使用`defineEmits`API，它將自動地在 `script setup` 中使用

  #### 為defineEmits() 標註類型
  `defineEmits()` 標註類型直接推薦`泛型`形式
  ```ts
  import type { GlobalTheme } from 'naive-ui'

  const emit = defineEmits<{
    (e: 'setThemeColor', val: GlobalTheme): void
  }>()
  ```
  雖然官方還推薦了`運行時`自動推導的一種形式,但不是很推薦

## defineExpose()
`defineExpose()`編譯器來顯式指定在 `script setup` 組件中要暴露出去的`property`，使得父組件通過`模板ref`的方式獲取到當前組件的實例

  #### 為defineExpose() 標註類型
  `defineExpose()`類型推導直接使用參數類型自動推到即可
  ```ts
  <script setup>
  import { ref } from 'vue'

  const name = ref<string>('前端開發')

  defineExpose({
    name
  })
  ```

## provide()
`provide()`供給一個值，可以被後代組件注入
  #### 類型定義
  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

  #### 為provide() 標註類型
  為 `provide()` 標註類型, Vue 提供了一個 `InjectionKey` 接口，它是一個繼承自 `Symbol` 的泛型類型，可以用來在提供者和消費者之間同步注入值的類型
  ```js
  import type { InjectionKey } from 'vue'

  // 建議聲明 key (name) 放到公用的文件中
  // 這樣就可以在 inject 的時候直接導入使用
  const name = Symbol() as InjectionKey<string>

  provide(name, '前端開發') // 若提供的是非字符串值會導致錯誤
  ```
  以上方式是通過定義key 的類型來標註類型的,還有一種方式直接 `key` 採用`字符串`的形式添加
  ```ts
  provide('name', '前端開發')
  ```

## inject()
`inject()`注入一個由祖先組件或整個應用供給的值
  #### 類型定義
  ```js
  // 没有默認值
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // 带有默認值
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // 使用工廠函數
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

  #### 為inject() 標註類型
  `provide()`的 `key` 的類型是聲明式提供的話(provide()類型標註的第一種形式)
  `inject()`可以直接導入聲明的 `key` 來獲取父級組件提供的值
  ```ts
  // 由外部導入
  const name = Symbol() as InjectionKey<string>

  const injectName = inject(name)
  ```

  如果 `provide()` 的 `key` 直接使用的`字符串`形式添加的, 需要通過泛型參數聲明
  ```ts
  const injectName = inject<string>('name')
  ```

## 模板ref
模板 `ref` 需要通過一個顯式指定的`泛型參數`和一個`初始值 null` 來創建：
```ts
<img ref="el" class="logo" :src="Logo" alt="" />

const el = ref<HTMLImageElement | null>(null)
```

## 組件ref
有時，可能需要為一個子組件添加一個模板ref，以便調用它公開的方法
  ```html
  <!-- Child.vue -->
  <script setup lang="ts">
  const handleLog = () => console.log('前端开发爱好者')

  defineExpose({
    open
  })
  </script>
  ```
為了獲取 MyModal 的類型，我們首先需要通過 typeof 得到其類型，再使用 TypeScript 內置的 InstanceType 工具類型來獲取其實例類型：
  ```html
  <!-- parent.vue -->
  <script setup lang="ts">
  import Child from './Child.vue'

  // 为子组件 ref 声明类型
  const child = ref<InstanceType<typeof Child> | null>(null)

  // 调用子组件中的方法
  const getChildHandleLog = () => {
    child.value?.handleLog()
  }
  </script>
  ```

## 事件處理器
原生的DOM 事件標註類型
  ```html
  <template>
    <input type="text" @change="handleChange" />
  </template>

  <script setup lang="ts">
  function handleChange(event: Event) {
    console.log((event.target as HTMLInputElement).value)
  }
  </script>
  ```