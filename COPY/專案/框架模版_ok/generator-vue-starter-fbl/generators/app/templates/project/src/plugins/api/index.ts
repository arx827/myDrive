import axios from 'axios';
import { Configuration, AuthApiFactory, AuthApi, DepartmentApi, DepartmentApiFactory, ProductApi, ProductSpecApi, ProductApiFactory, ProductSpecApiFactory, AccountApi, AccountApiFactory, RoleApi, RoleApiFactory, MenuApi, MenuApiFactory, GroupApi, GroupApiFactory } from '@fubonlife/<%= code %>-api-axios-sdk'
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $authApi: AuthApi
        $accountApi: AccountApi
        $departmentApi: DepartmentApi
        $productApi: ProductApi
        $productSpecApi: ProductSpecApi
        $roleApi: RoleApi
        $menuApi: MenuApi
        $groupApi: GroupApi
    }
}
export default new (class Api {
    public install(Vue, options: Configuration) {
        Vue.prototype.$authApi = AuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$accountApi = AccountApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$departmentApi = DepartmentApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$productApi = ProductApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$productSpecApi = ProductSpecApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$roleApi = RoleApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$menuApi = MenuApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$groupApi = GroupApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    }
})();