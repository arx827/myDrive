<template>
    <div>
        <a-modal title="代碼加密(Jasypt Encryption)" :visible="true" :footer="null" :closable="false"
            :width="300" style="white-space: pre">
            <a-form @submit="handleSubmit">
                <a-form-model-item>
                    <a-input class="maskpassword" type="text" placeholder="請輸入欲加密代碼" v-model="OriginCode.originCode" />
                </a-form-model-item>
                <a-form-model-item>
                    <a-button :block="true" type="primary" html-type="submit" :loading="is_loading">
                        Encrypt
                    </a-button>
                </a-form-model-item>
            </a-form>
            <a-modal v-model="is_show" title="加密後代碼(Encryted Code)" :closable=false>
                <template #footer>
                    <a-button key="submit" type="primary" @click="handleDismiss">Dismiss</a-button>
                </template>
                <p>{{ encrptedCode }}</p>
            </a-modal>
        </a-modal>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";


@Component  //要下component才 v-model得上
export default class JasyptPage extends Vue {
    
    OriginCode = {
        originCode:"",
    }
    encrptedCode : String="";
    is_show : boolean=false;
    is_loading : boolean=false;
    
    handleDismiss() {
        this.is_show = false;
        this.is_loading = false;
        this.encrptedCode = "";
        this.OriginCode.originCode = "";
    }

    handleSubmit(e) {
        e.preventDefault();
        this.is_loading = true;
        setTimeout(() => {
            if (this.OriginCode.originCode) {
                this.encrypt();
            } else {
                this.is_loading = false;
                console.log("encrypt error");
                return false;
            }

        }, 500)

    }
    encrypt() {
        this.$jasyptApi.jasyptEncryptUsingPOST(this.OriginCode).then(
            (response)=>{
            this.encrptedCode = response.data;
            this.is_show = true;
        }).catch((error)=>{
        console.log(error)
        })

    }
}



</script>

<style scoped>
.maskpassword {
    -webkit-text-security: disc;
}
</style>