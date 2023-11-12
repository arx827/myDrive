<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="8" >
        <a-card style="width: 400px ;height:500px">
          <img
            slot="cover"
            src="@/assets/imgs/logo/vueLogo.png"
          />
          <a-card-meta title="Web資訊">
            <template slot="description" >
              <h1> {{ $t("global_versionNo") }}: {{frontendVersion}} </h1>               
              </template>
          </a-card-meta>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card style="width: 400px ;height:500px">
          <img
            style="height:400px"
            slot="cover"
            src="@/assets/imgs/logo/springBootLogo.png"
          />
          <a-card-meta title="Api資訊">
            <template slot="description" > 
              <h1>{{ $t("global_versionNo") }}: {{backendVersion}}</h1> 
              </template>
          </a-card-meta>
        </a-card>
      </a-col>
            <a-col :span="8">
        <a-card style="width: 400px ;height:500px">
          <img
            style="height:400px"
            slot="cover"
            src="@/assets/imgs/logo/springBootLogo.png"
          />
          <a-card-meta title="Batch資訊">
            <template slot="description" > 
              <h1>{{ $t("global_versionNo") }}: {{batchVersion}}</h1> 
              </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script src="./VersionCheckPage.ts" lang="ts"></script>
<style scoped></style>