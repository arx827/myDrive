<script setup lang="ts">
// import Img_1 from '@img/doc7-1.png'
// import Img_2 from '@img/doc7-2.png'
// import Img_3 from '@img/doc7-3.png'

import {reactive, ref} from 'vue'
import type { Rule } from 'ant-design-vue/es/form';
import { Form } from 'ant-design-vue';


// form1
const tmpl = `<template>
  <a-form :model="formState"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{required: true, message:'必填!'}]"
    >
      <input v-model:value="formState.username" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>`
const tmpl1_2 = `const formState = ref({
  username: '',
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
`
// form2
const tmpl2 = `<template>
  <a-form :model="formState"
          :rules="rules"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
    >
      <input v-model:value="formState.username" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>`

// form3
const tmpl3 = `<template>
  <a-form>
    <a-form-item
      label="Username"
      name="username"
      v-bind="validateInfos.username"
    >
      <input v-model:value="modelRef.username" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click.prevent="onSubmit">submit</a-button>
    </a-form-item>
  </a-form>
</template>`

// demo form
const useForm = Form.useForm
// form model
const modelRef = ref({
  username: undefined,
})
// form rule
const rulesRef = ref({
  username : [{
    required: true,
    message: '此欄位必填',
  }]
})
// 將以上資訊綁定方法
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const onSubmit = () => {
  validate()
    .then(() => {
      console.log('success');
    })
    .catch(err => {
      console.log('error', err);
    });
};
</script>
<template>
  <div class="page__container flex-fill gap-3">
    <div class="container__wrap">
      <h5 class="d-flex align-items-center text-primary">說明</h5>
      <div>
        表單驗證使用 Ant Design Vue 表單驗證功能 (<a href="https://www.antdv.com/components/form-cn" target="_blank"
          >官方文件</a
        >)
      </div>
      <a-form class="mt-5" :label-col="{ span: 8 }"
    :wrapper-col="{ span: 8 }">
        <a-form-item
          label="Username"
          name="username"
          v-bind="validateInfos.username"
        >
          <a-input v-model="modelRef.username" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 8 }">
          <a-button type="primary" @click.prevent="onSubmit">submit</a-button>
        </a-form-item>
      </a-form>
      <ul class="doc__tool-ul">
        <li>
          <div>將驗證寫在單一表單元件上</div>
          <!-- <a-image-preview-group>
              <a-image class="border" :src="Img_1" />
            </a-image-preview-group> -->
          <PreCode type="vue" class="mt-2">
            <template #code>
              {{ tmpl1_2 }}
            </template>
          </PreCode>
          <PreCode type="html" class="mt-2">
            <template #code>
              {{ tmpl }}
            </template>
          </PreCode>
        </li>
        <li>
          <div>將驗證統一寫在form上</div>

          <PreCode type="vue" class="mt-2">
            <template #code>
              {{ `import type { Rule } from 'ant-design-vue/es/form';

const rules: Record<string, Rule[]> = {
  username: [{ required: true, trigger: 'change' }],
}
const formState = ref({
  username: '',
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}` }}
            </template>
          </PreCode>
          <PreCode type="html" class="mt-2">
            <template #code>
              {{ tmpl2 }}
            </template>
          </PreCode>
        </li>
        <li>
          <div>使用useForm</div>
          <PreCode type="vue" class="mt-2">
            <template #code>
              {{
                `import { Form } from 'ant-design-vue'

const useForm = Form.useForm
// form model
const modelRef = ref({
  username: undefined,
})
// form rule
const rulesRef = ref({
  username : [{
    required: true,
    message: '此欄位必填',
  }]
})
// 將以上資訊綁定方法
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
// 送出事件
const onSubmit = () => {
  validate()
    .then(() => {
      console.log('success');
    })
    .catch(err => {
      console.log('error', err);
    });
};
`
              }}
            </template>
          </PreCode>
          <PreCode type="html" class="mt-2">
            <template #code>
              {{ tmpl3 }}
            </template>
          </PreCode>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
