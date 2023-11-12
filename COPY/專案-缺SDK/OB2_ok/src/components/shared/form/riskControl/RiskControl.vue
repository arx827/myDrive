<template>
  <div class="contentscrollbar">
    <!-- <div>
      <label>垂直或水平：</label><a-switch default-checked @change="onSwitch" />
      <br />
      <label>欄位數目：</label
      ><a-slider v-model="columnStyle" :min="1" :max="4" />
      <br />
      <label>尺寸大小：</label>
      <a-radio-group v-model="sizeStyle">
        <a-radio :value="'default'">default</a-radio>
        <a-radio :value="'middle'">middle</a-radio>
        <a-radio :value="'small'">small</a-radio>
      </a-radio-group>
    </div>
    <hr /> -->
    <a-collapse v-model="activeKey" class="modal-collapse">
      <!-- 風控資訊 -->
      <a-collapse-panel key="1" :header="$t('riskControl_riskControlInfo')">
        <!-- 法源依據 -->
        <a-descriptions
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
          ><a-descriptions-item :label="$t('riskControl_policyLawSource')">{{
            theRiskControlDetailsData.policyLawSource
          }}</a-descriptions-item>
          <!-- 承辦備註 -->
          <a-descriptions-item :label="$t('riskControl_memoContractorMemo')"
            ><li
              v-for="item in theRiskControlDetailsData.memoContractorMemo"
              :key="item"
            >
              {{ item }}
            </li></a-descriptions-item
          >
          <!-- 受理案號 -->
          <a-descriptions-item :label="$t('riskControl_policyChangeNo')">{{
            theRiskControlDetailsData.policyChangeNo
          }}</a-descriptions-item>
          <!-- 風控項目 -->
          <a-descriptions-item :label="$t('riskControl_ctrlRiskCtrlItems')"
            ><li
              v-for="item in theRiskControlDetailsData.ctrlRiskCtrlItems"
              :key="item.ctrlRiskCtrlItem"
            >
              {{ item.ctrlRiskCtrlItem + " " + item.ctrlRiskCtrlItemDesc }}
            </li></a-descriptions-item
          >
          <!-- 電訪特殊註記 -->
          <a-descriptions-item
            :label="$t('riskControl_policyContSpecilMemo')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.policyContSpecilMemo
            }}</a-descriptions-item
          >
          <!-- 密戶件 -->
          <a-descriptions-item :label="$t('riskControl_policyIsSecretCase')">{{
            theRiskControlDetailsData.policyIsSecretCase
          }}</a-descriptions-item>
          <!-- 監護宣告 -->
          <a-descriptions-item
            :label="$t('riskControl_policyLegalDisaStatus')"
            v-if="theBusinessTypeCode != 'CL'"
            >{{
              theRiskControlDetailsData.policyLegalDisaStatus
            }}</a-descriptions-item
          >
          <!-- 法定代理人∕監護人 -->
          <a-descriptions-item :label="$t('riskControl_policyLegalName')">{{
            theRiskControlDetailsData.policyLegalName
          }}</a-descriptions-item>
          <!-- 法定代理人∕監護人ID -->
          <a-descriptions-item :label="$t('riskControl_policyLegalId')">{{
            theRiskControlDetailsData.policyLegalId
          }}</a-descriptions-item>
          <!-- 法定代理人∕監護人關係 -->
          <a-descriptions-item :label="$t('riskControl_policyLegalRelate')">{{
            theRiskControlDetailsData.policyLegalRelate
          }}</a-descriptions-item>
        </a-descriptions>
      </a-collapse-panel>
      <!-- 保單基本資料 -->
      <a-collapse-panel
        key="2"
        :header="$t('riskControl_policyBasicDate')"
        :disabled="false"
      >
        <a-descriptions
          class="compare-change"
          v-if="isPolicyBasicDateChanged"
          layout="horizontal"
          :column="1"
          size="small"
          bordered
        >
          <a-descriptions-item>
            <table>
              <tr align="center">
                <!-- 保單基本資料變更(變更前) -->
                <th :style="beforeChangeStyle">
                  {{ $t("riskControl_policyBasicDateBefore") }}
                </th>
                <!-- 保單基本資料變更(變更後) -->
                <th :style="afterChangeStyle">
                  {{ $t("riskControl_policyBasicDateAfter") }}
                </th>
              </tr>
            </table>
          </a-descriptions-item>
          <a-descriptions-item>
            <template slot="label">
              <!-- 保單號碼 -->
              <span>{{ $t("riskControl_policyCasePolicy") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.casePolicy !=
                  theRiskControlDetailsData.policyCasePolicy
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.casePolicy }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyCasePolicy }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <!-- <a-descriptions-item
            :label="
              thePolicyBasicBackupData.policyNo ==
              theRiskControlDetailsData.policyPolicyNo
                ? '保單號碼'
                : '保單號碼 ※'
            "
          >
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.policyNo }}
                </th>
                <th
                  :style="afterChangeStyle"
                  v-if="
                    thePolicyBasicBackupData.policyNo !=
                    theRiskControlDetailsData.policyPolicyNo
                  "
                >
                  {{ theRiskControlDetailsData.policyPolicyNo }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item
            :label="
              thePolicyBasicBackupData.policySeq ==
              theRiskControlDetailsData.policyPolicySeq
                ? '保單序號'
                : '保單序號 ※'
            "
          >
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.policySeq }}
                </th>
                <th
                  :style="afterChangeStyle"
                  v-if="
                    thePolicyBasicBackupData.policySeq !=
                    theRiskControlDetailsData.policyPolicySeq
                  "
                >
                  {{ theRiskControlDetailsData.policyPolicySeq }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item
            :label="
              thePolicyBasicBackupData.idDup ==
              theRiskControlDetailsData.policyIdDup
                ? '重複碼'
                : '重複碼 ※'
            "
          >
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.idDup }}
                </th>
                <th
                  :style="afterChangeStyle"
                  v-if="
                    thePolicyBasicBackupData.idDup !=
                    theRiskControlDetailsData.policyIdDup
                  "
                >
                  {{ theRiskControlDetailsData.policyIdDup }}
                </th>
              </tr>
            </table></a-descriptions-item
          > -->
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人姓名 -->
              <span>{{ $t("riskControl_policyPherName") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherName !=
                  theRiskControlDetailsData.policyPherName
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.pherName }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyPherName }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人戶籍/住所地址 -->
              <span>{{
                $t("riskControl_policyPherPermanentAddrApplicant")
              }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherPermanentZipCode !=
                    theRiskControlDetailsData.policyPherPermanentZipCode ||
                  thePolicyBasicBackupData.pherPermanentAddr !=
                    theRiskControlDetailsData.policyPherPermanentAddr
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{
                    thePolicyBasicBackupData.pherPermanentZipCode +
                    " " +
                    thePolicyBasicBackupData.pherPermanentAddr
                  }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{
                    theRiskControlDetailsData.policyPherPermanentZipCode +
                    " " +
                    theRiskControlDetailsData.policyPherPermanentAddr
                  }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人戶籍/住所電話 -->
              <span>{{ $t("riskControl_policyPherPermanentTel") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherContTel !=
                    theRiskControlDetailsData.policyPherContTel ||
                  thePolicyBasicBackupData.pherPermanentTel !=
                    theRiskControlDetailsData.policyPherPermanentTel
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.pherPermanentTel }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyPherPermanentTel }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人戶籍/住所電話2 -->
              <span>{{ $t("riskControl_policyPherPermanentTel2") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherContTel2 !=
                    theRiskControlDetailsData.policyPherContTel2 ||
                  thePolicyBasicBackupData.pherPermanentTel2 !=
                    theRiskControlDetailsData.policyPherPermanentTel2
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.pherPermanentTel2 }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyPherPermanentTel2 }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人行動電話 -->
              <span>{{ $t("riskControl_policyPherMobApplicant") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherMob !=
                  theRiskControlDetailsData.policyPherMob
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.pherMob }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyPherMob }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人收費/聯絡電話 -->
              <span>{{ $t("riskControl_policyPherContTel") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherContTel !=
                  theRiskControlDetailsData.policyPherContTel
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.pherContTel }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyPherContTel }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人收費/聯絡電話2 -->
              <span>{{ $t("riskControl_policyPherContTel2") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherContTel2 !=
                  theRiskControlDetailsData.policyPherContTel2
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.pherContTel2 }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyPherContTel2 }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人收費/聯絡地址 -->
              <span>{{ $t("riskControl_policyPherContAddrApplicant") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherContZipCode !=
                    theRiskControlDetailsData.policyPherContZipCode ||
                  thePolicyBasicBackupData.pherContAddr !=
                    theRiskControlDetailsData.policyPherContAddr
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{
                    thePolicyBasicBackupData.pherContZipCode +
                    " " +
                    thePolicyBasicBackupData.pherContAddr
                  }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{
                    theRiskControlDetailsData.policyPherContZipCode +
                    " " +
                    theRiskControlDetailsData.policyPherContAddr
                  }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 要保人Email信箱 -->
              <span>{{ $t("riskControl_policyPherEmail") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.pherEmail !=
                  theRiskControlDetailsData.policyPherEmail
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.pherEmail }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyPherEmail }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 被保險人姓名 -->
              <span>{{ $t("riskControl_policyInsuName") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.insuName !=
                  theRiskControlDetailsData.policyInsuName
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.insuName }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyInsuName }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 被保險人住所地址 -->
              <span>{{ $t("riskControl_policyInsuContAddr") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.insuContZipCode !=
                    theRiskControlDetailsData.policyInsuContZipCode ||
                  thePolicyBasicBackupData.insuContAddr !=
                    theRiskControlDetailsData.policyInsuContAddr
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{
                    thePolicyBasicBackupData.insuContZipCode +
                    " " +
                    thePolicyBasicBackupData.insuContAddr
                  }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{
                    theRiskControlDetailsData.policyInsuContZipCode +
                    " " +
                    theRiskControlDetailsData.policyInsuContAddr
                  }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 被保險人聯絡電話 -->
              <span>{{ $t("riskControl_policyInsuTel") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.insuTel !=
                  theRiskControlDetailsData.policyInsuTel
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.insuTel }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyInsuTel }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 被保險人聯絡電話2 -->
              <span>{{ $t("riskControl_policyInsuTel2") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.insuTel2 !=
                  theRiskControlDetailsData.policyInsuTel2
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.insuTel2 }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyInsuTel2 }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 被保險人行動電話 -->
              <span>{{ $t("riskControl_policyInsuMob") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.insuMob !=
                  theRiskControlDetailsData.policyInsuMob
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.insuMob }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyInsuMob }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <a-descriptions-item>
            <template slot="label">
              <!-- 被保險人Email信箱 -->
              <span>{{ $t("riskControl_policyInsuEmailb") }}</span>
              <span
                v-if="
                  thePolicyBasicBackupData.insuEmail !=
                  theRiskControlDetailsData.policyInsuEmail
                "
                class="different"
              >
                ※
              </span>
            </template>
            <table>
              <tr align="center">
                <th :style="beforeChangeStyle">
                  {{ thePolicyBasicBackupData.insuEmail }}
                </th>
                <th :style="afterChangeStyle" v-if="theRiskControlDetailsData">
                  {{ theRiskControlDetailsData.policyInsuEmail }}
                </th>
              </tr>
            </table></a-descriptions-item
          >
          <!-- 系統別(A、F) -->
          <a-descriptions-item :label="$t('riskControl_policySysSourceType')">
            <a-row justify="center" type="flex">
              <a-col>
                {{ theRiskControlDetailsData.policySysSourceType }}
              </a-col>
            </a-row>
          </a-descriptions-item>
          <!-- 通路別(1.2.3) -->
          <a-descriptions-item :label="$t('riskControl_policySysType')">
            <a-row justify="center" type="flex">
              <a-col>
                {{ theRiskControlDetailsData.policySysType }}
              </a-col>
            </a-row>
          </a-descriptions-item>
          <!-- 要保人ID -->
          <a-descriptions-item :label="$t('riskControl_policyPherId')">
            <a-row justify="center" type="flex">
              <a-col>
                {{ theRiskControlDetailsData.policyPherId }}
              </a-col>
            </a-row>
          </a-descriptions-item>
          <!-- 要保人生日 -->
          <a-descriptions-item :label="$t('riskControl_policyPherBirthday')">
            <a-row justify="center" type="flex">
              <a-col>
                {{ theRiskControlDetailsData.policyPherBirthday }}
              </a-col>
            </a-row>
          </a-descriptions-item>
          <!-- 被保險人ID -->
          <a-descriptions-item :label="$t('riskControl_policyInsuId')">
            <a-row justify="center" type="flex">
              <a-col>
                {{ theRiskControlDetailsData.policyInsuId }}
              </a-col>
            </a-row>
          </a-descriptions-item>
          <!-- 被保險人生日 -->
          <a-descriptions-item :label="$t('riskControl_policyInsuBirthday')">
            <a-row justify="center" type="flex">
              <a-col>
                {{ theRiskControlDetailsData.policyInsuBirthday }}
              </a-col>
            </a-row>
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions
          v-else
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
        >
          <!-- 保單號碼 -->
          <a-descriptions-item :label="$t('riskControl_policyCasePolicy')">{{
            theRiskControlDetailsData.policyCasePolicy
          }}</a-descriptions-item>
          <!-- <a-descriptions-item label="保單號碼">{{
            theRiskControlDetailsData.policyPolicyNo
          }}</a-descriptions-item> -->
          <!-- <a-descriptions-item label="保單序號">{{
            theRiskControlDetailsData.policyPolicySeq
          }}</a-descriptions-item>
          <a-descriptions-item label="重複碼">{{
            theRiskControlDetailsData.policyIdDup
          }}</a-descriptions-item> -->
          <!-- 系統別(A、F) -->
          <a-descriptions-item :label="$t('riskControl_policySysSourceType')">{{
            theRiskControlDetailsData.policySysSourceType
          }}</a-descriptions-item>
          <!-- 通路別(1.2.3) -->
          <a-descriptions-item :label="$t('riskControl_policySysType')">{{
            theRiskControlDetailsData.policySysType
          }}</a-descriptions-item>
          <!-- 要保人姓名 -->
          <a-descriptions-item :label="$t('riskControl_policyPherName')">{{
            theRiskControlDetailsData.policyPherName
          }}</a-descriptions-item>
          <!-- 要保人ID -->
          <a-descriptions-item :label="$t('riskControl_policyPherId')">{{
            theRiskControlDetailsData.policyPherId
          }}</a-descriptions-item>
          <!-- 要保人生日 -->
          <a-descriptions-item :label="$t('riskControl_policyPherBirthday')">{{
            theRiskControlDetailsData.policyPherBirthday
          }}</a-descriptions-item>
          <!-- 要保人戶籍/住所地址 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherPermanentAddrApplicant')"
            >{{
              theRiskControlDetailsData.policyPherPermanentZipCode +
              " " +
              theRiskControlDetailsData.policyPherPermanentAddr
            }}</a-descriptions-item
          >
          <!-- 要保人戶籍/住所電話 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherPermanentTel')"
            >{{
              theRiskControlDetailsData.policyPherPermanentTel
            }}</a-descriptions-item
          >
          <!-- 要保人戶籍/住所電話2 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherPermanentTel2')"
            >{{
              theRiskControlDetailsData.policyPherPermanentTel2
            }}</a-descriptions-item
          >
          <!-- 要保人行動電話 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherMobApplicant')"
            >{{ theRiskControlDetailsData.policyPherMob }}</a-descriptions-item
          >
          <!-- 要保人收費/聯絡電話 -->
          <a-descriptions-item :label="$t('riskControl_policyPherContTel')">{{
            theRiskControlDetailsData.policyPherContTel
          }}</a-descriptions-item>
          <!-- 要保人收費/聯絡電話2 -->
          <a-descriptions-item :label="$t('riskControl_policyPherContTel2')">{{
            theRiskControlDetailsData.policyPherContTel2
          }}</a-descriptions-item>
          <!-- 要保人收費/聯絡地址 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherContAddrApplicant')"
            >{{
              theRiskControlDetailsData.policyPherContZipCode +
              " " +
              theRiskControlDetailsData.policyPherContAddr
            }}</a-descriptions-item
          >
          <!-- 要保人Email信箱 -->
          <a-descriptions-item :label="$t('riskControl_policyPherEmail')">{{
            theRiskControlDetailsData.policyPherEmail
          }}</a-descriptions-item>
          <!-- 被保險人姓名 -->
          <a-descriptions-item :label="$t('riskControl_policyInsuName')">{{
            theRiskControlDetailsData.policyInsuName
          }}</a-descriptions-item>
          <!-- 被保險人ID -->
          <a-descriptions-item :label="$t('riskControl_policyInsuId')">{{
            theRiskControlDetailsData.policyInsuId
          }}</a-descriptions-item>
          <!-- 被保險人生日 -->
          <a-descriptions-item :label="$t('riskControl_policyInsuBirthday')">{{
            theRiskControlDetailsData.policyInsuBirthday
          }}</a-descriptions-item>
          <!-- 被保險人住所地址 -->
          <a-descriptions-item :label="$t('riskControl_policyInsuContAddr')">{{
            theRiskControlDetailsData.policyInsuContZipCode +
            " " +
            theRiskControlDetailsData.policyInsuContAddr
          }}</a-descriptions-item>
          <!-- 被保險人聯絡電話 -->
          <a-descriptions-item :label="$t('riskControl_policyInsuTel')">{{
            theRiskControlDetailsData.policyInsuTel
          }}</a-descriptions-item>
          <!-- 被保險人聯絡電話2 -->
          <a-descriptions-item :label="$t('riskControl_policyInsuTel2')">{{
            theRiskControlDetailsData.policyInsuTel2
          }}</a-descriptions-item>
          <!-- 被保險人行動電話 -->
          <a-descriptions-item :label="$t('riskControl_policyInsuMob')">{{
            theRiskControlDetailsData.policyInsuMob
          }}</a-descriptions-item>
          <!-- 被保險人Email信箱 -->
          <a-descriptions-item :label="$t('riskControl_policyInsuEmailb')">{{
            theRiskControlDetailsData.policyInsuEmail
          }}</a-descriptions-item>
        </a-descriptions>
        <a-descriptions
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
        >
          <!-- 單件年化保費金額(NTD) -->
          <a-descriptions-item
            :label="$t('riskControl_policySingleAnnualisedPremiums')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.policySingleAnnualisedPremiums
            }}</a-descriptions-item
          >
          <!-- 期繳總保費=單件年繳化保費X繳費年度 -->
          <a-descriptions-item
            :label="$t('riskControl_policyTotallPolicyCost')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.policyTotallPolicyCost
            }}</a-descriptions-item
          >
          <!-- 應繳保費 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPolicyCost')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.policyPolicyCost
            }}</a-descriptions-item
          >
          <!-- 每期保險費 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPrePolicyCost')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.policyPrePolicyCost
            }}</a-descriptions-item
          >
          <!-- 期次 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPeriod')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{ theRiskControlDetailsData.policyPeriod }}</a-descriptions-item
          >
          <!-- 繳費方式 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPayKindDesc')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.policyPayKindDesc
            }}</a-descriptions-item
          >
          <!-- 保單寄送方式 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPolicySendType')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.policyPolicySendType
            }}</a-descriptions-item
          >
          <!-- 應繳費日期 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPolicyCostDate')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.policyPolicyCostDate
            }}</a-descriptions-item
          >
          <!-- 投保目的 -->
          <a-descriptions-item
            :label="$t('riskControl_nbInsurancePurposeAnswer')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.nbInsurancePurposeAnswer
            }}</a-descriptions-item
          >
          <!-- 保費來源 -->
          <a-descriptions-item
            :label="$t('riskControl_nbPremiumSourceAnswer')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{
              theRiskControlDetailsData.nbPremiumSourceAnswer
            }}</a-descriptions-item
          >
          <!-- 商品別 -->
          <a-descriptions-item
            :label="$t('riskControl_nbProductCode')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
            >{{ theRiskControlDetailsData.nbProductCode }}</a-descriptions-item
          >
          <!-- 實際繳款人資訊 -->
          <a-descriptions-item
            :label="$t('riskControl_realPayerInfo')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >
            <!-- 開啟清單 -->
            <a v-if="realPayerInfoFlag" @click="realPayerInfoShow = true">{{
              $t("riskControl_openList")
            }}</a>
            <span v-else class="noDataList">
              {{ $t("riskControl_openList") }}
            </span>
          </a-descriptions-item>
          <!-- 應繳未繳資訊 -->
          <a-descriptions-item
            :label="$t('riskControl_shouldPayNotPayInfo')"
            v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >
            <!-- 開啟清單 -->
            <a
              v-if="shouldPayNoPayInfoFlag"
              @click="shouldPayNoPayInfoShow = true"
              >{{ $t("riskControl_openList") }}</a
            >
            <span v-else class="noDataList">
              {{ $t("riskControl_openList") }}
            </span>
          </a-descriptions-item>
          <!-- 業務員姓名 -->
          <a-descriptions-item :label="$t('riskControl_policyAgentName')">{{
            theRiskControlDetailsData.policyAgentName
          }}</a-descriptions-item>
          <!-- 業務員ID -->
          <a-descriptions-item :label="$t('riskControl_policyAgentId')">{{
            theRiskControlDetailsData.policyAgentId
          }}</a-descriptions-item>
          <!-- 業務員單位代號 -->
          <a-descriptions-item :label="$t('riskControl_policyAgentUnitNo')">{{
            theRiskControlDetailsData.policyAgentUnitNo
          }}</a-descriptions-item>
          <!-- 業務員單位名稱 -->
          <a-descriptions-item :label="$t('riskControl_policyAgentUnitName')">{{
            theRiskControlDetailsData.policyAgentUnitName
          }}</a-descriptions-item>
          <!-- 第二業務員姓名 -->
          <a-descriptions-item :label="$t('riskControl_policyAgentName2')">{{
            theRiskControlDetailsData.policyAgentName2
          }}</a-descriptions-item>
          <!-- 第二業務員ID -->
          <a-descriptions-item :label="$t('riskControl_policyAgentId2')">{{
            theRiskControlDetailsData.policyAgentId2
          }}</a-descriptions-item>
          <!-- 第二業務員單位代號 -->
          <a-descriptions-item :label="$t('riskControl_policyAgentUnitNo2')">{{
            theRiskControlDetailsData.policyAgentUnitNo2
          }}</a-descriptions-item>
          <!-- 第二業務員單位名稱 -->
          <a-descriptions-item
            :label="$t('riskControl_policyAgentUnitName2')"
            >{{
              theRiskControlDetailsData.policyAgentUnitName2
            }}</a-descriptions-item
          >
          <!-- 應電訪日期 -->
          <a-descriptions-item
            :label="$t('riskControl_policyDueContDateChg')"
            >{{
              theRiskControlDetailsData.policyDueContDateChg
            }}</a-descriptions-item
          >
          <!-- 承辦窗口 -->
          <a-descriptions-item :label="$t('riskControl_mcContWindowName')">{{
            theRiskControlDetailsData.mcContWindowName
          }}</a-descriptions-item>
          <!-- 受理人員 -->
          <a-descriptions-item :label="$t('riskControl_policyReceiveId')">{{
            theRiskControlDetailsData.policyReceiveId
          }}</a-descriptions-item>
          <!-- 承辦人員單位代號 -->
          <a-descriptions-item :label="$t('riskControl_policyProcessUnitNo')">{{
            theRiskControlDetailsData.policyProcessUnitNo
          }}</a-descriptions-item>
          <!-- 申請日期 -->
          <a-descriptions-item
            :label="$t('riskControl_policyApplicantyDate')"
            >{{
              theRiskControlDetailsData.policyApplicantyDate
            }}</a-descriptions-item
          >
          <!-- 結案日期 -->
          <a-descriptions-item :label="$t('riskControl_policyCaseCloseDate')">{{
            theRiskControlDetailsData.policyCaseCloseDate
          }}</a-descriptions-item>
          <!-- 受理案號 -->
          <a-descriptions-item :label="$t('riskControl_policyChangeNo')">{{
            theRiskControlDetailsData.policyChangeNo
          }}</a-descriptions-item>
          <!-- 見證人資訊 -->
          <a-descriptions-item :label="$t('riskControl_illIteracy')">
            <!-- 開啟清單 -->
            <a v-if="illIteracyFlag" @click="illIteracyShow = true">{{
              $t("riskControl_openList")
            }}</a>
            <span v-else class="noDataList">
              {{ $t("riskControl_openList") }}
            </span>
          </a-descriptions-item>
          <!-- 門號核實行動電話 -->
          <a-descriptions-item :label="'門號核實行動電話'">
            <div
              v-if="theRiskControlDetailsData.phoneFailedPhoneNumber != null"
            >
              {{ theRiskControlDetailsData.phoneFailedPhoneNumber[0] }}
              <!-- <li
                v-for="(
                  r, i
                ) in theRiskControlDetailsData.phoneFailedPhoneNumber"
                :key="i"
              >
                {{ r }}
              </li> -->
            </div>
          </a-descriptions-item>
          <!-- 與門號申辦人關係及留存行動電話原因 -->
          <a-descriptions-item :label="'與門號申辦人關係及留存行動電話原因'">
            <div
              v-if="
                theRiskControlDetailsData.phoneFailedPhoneNumberApplyRelatedAndReasons !=
                null
              "
            >
              {{
                theRiskControlDetailsData
                  .phoneFailedPhoneNumberApplyRelatedAndReasons[0]
              }}
              <!-- <li
                v-for="(
                  r, i
                ) in theRiskControlDetailsData.phoneFailedPhoneNumberApplyRelatedAndReasons"
                :key="i"
              >
                {{ r }}
              </li> -->
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-collapse-panel>
      <!-- 契約變更 -->
      <a-collapse-panel
        key="3"
        :header="$t('riskControl_contractChange')"
        :disabled="false"
        v-if="theBusinessTypeCode == 'PS'"
      >
        <a-descriptions
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
          v-if="theBusinessTypeCode == 'PS'"
        >
          <!-- 新要保人姓名 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherNameChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{ theRiskControlDetailsData.mcPherNameChg }}</a-descriptions-item
          >
          <!-- 要保人指定匯款帳戶 -->
          <a-descriptions-item
            :label="$t('riskControl_applicantDesignatedRemittanceAccount')"
            v-if="theBusinessTypeCode == 'PS'"
          >
            <!-- 開啟清單 -->
            <a
              v-if="applicantDesignatedRemittanceAccountData.data.length > 0"
              @click="applicantDesignatedRemittanceAccountShow = true"
              >{{ $t("riskControl_openList") }}</a
            >
            <span v-else class="noDataList">
              {{ $t("riskControl_openList") }}
            </span>
          </a-descriptions-item>
          <!-- 新要保人ID -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherIdChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{ theRiskControlDetailsData.mcPherIdChg }}</a-descriptions-item
          >
          <!-- 新要保人生日 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherBirthdayChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPherBirthdayChg
            }}</a-descriptions-item
          >
          <!-- 新要保人戶籍電話 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherPermanentTelChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPherPermanentTelChg
            }}</a-descriptions-item
          >
          <!-- 新要保人戶籍電話2 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherPermanentTel2Chg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPherPermanentTel2Chg
            }}</a-descriptions-item
          >
          <!-- 新要保人行動電話 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherMobChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{ theRiskControlDetailsData.mcPherMobChg }}</a-descriptions-item
          >
          <!-- 新要保人收費電話 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherContTelChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPherContTelChg
            }}</a-descriptions-item
          >
          <!-- 新要保人Email信箱 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherEmailChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.policyPherEmailChg
            }}</a-descriptions-item
          >
          <!-- 新要保人戶籍/住所地址 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherPermanentAddrChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPherZipCodeChg +
              " " +
              theRiskControlDetailsData.mcPherPermanentAddrChg
            }}</a-descriptions-item
          >
          <!-- 新要保人收費/聯絡地址 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPherContAddrChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPherContZipCodeChg +
              " " +
              theRiskControlDetailsData.mcPherContAddrChg
            }}</a-descriptions-item
          >
          <!-- 變更後被保險人姓名 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuNameChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{ theRiskControlDetailsData.mcInsuNameChg }}</a-descriptions-item
          >
          <!-- 變更後被保險人ID -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuIdChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{ theRiskControlDetailsData.mcInsuIdChg }}</a-descriptions-item
          >
          <!-- 變更後被保人生日 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuBirthdayChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcInsuBirthdayChg
            }}</a-descriptions-item
          >
          <!-- 變更後被保險人手機 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuMobChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{ theRiskControlDetailsData.mcInsuMobChg }}</a-descriptions-item
          >
          <!-- 變更後被保險人家裡電話 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuTelChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{ theRiskControlDetailsData.mcInsuTelChg }}</a-descriptions-item
          >
          <!-- 變更後被保人公司電話 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuOfficeTelChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcInsuOfficeTelChg
            }}</a-descriptions-item
          >
          <!-- 變更後被保險人地址 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuAddrChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcInsuZipCodeChg +
              " " +
              theRiskControlDetailsData.mcInsuAddrChg
            }}</a-descriptions-item
          >
          <!-- 變更後受益人清單 -->
          <a-descriptions-item
            :label="$t('riskControl_listOfBeneficiariesAfterChange')"
            v-if="theBusinessTypeCode == 'PS'"
          >
            <!-- 開啟清單 -->
            <a
              v-if="listOfBeneficiariesAfterChangeData.data.length > 0"
              @click="listOfBeneficiariesAfterChangeShow = true"
              >{{ $t("riskControl_openList") }}</a
            >
            <span v-else class="noDataList">
              {{ $t("riskControl_openList") }}
            </span>
          </a-descriptions-item>
          <!-- 變更後被保險人Email信箱 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuEmailChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{ theRiskControlDetailsData.mcInsuEmailChg }}</a-descriptions-item
          >
          <!-- 變更後商品中文名稱 -->
          <a-descriptions-item
            :label="$t('riskControl_mcProductDescChang')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcProductDescChang
            }}</a-descriptions-item
          >
          <!-- 變更後險種 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuranceCodeChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcInsuranceCodeChg
            }}</a-descriptions-item
          >
          <!-- 變更後年期 -->
          <a-descriptions-item
            :label="$t('riskControl_mcInsuranceYearChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcInsuranceYearChg
            }}</a-descriptions-item
          >
          <!-- 變更後繳別說明 -->
          <a-descriptions-item
            :label="$t('riskControl_mcPayTypeDescChg')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPayTypeDescChg
            }}</a-descriptions-item
          >
          <!-- 總退費金額(參考值)： -->
          <a-descriptions-item
            :label="$t('riskControl_mcPayDesigRefundTotalAmt')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPayDesigRefundTotalAmt
            }}</a-descriptions-item
          >
          <!-- 繳付資訊：繳付清單 -->
          <a-descriptions-item
            :label="$t('riskControl_paymentInformationPaymentChecklist')"
            v-if="theBusinessTypeCode == 'PS'"
          >
            <!-- 開啟清單 -->
            <a
              v-if="paymentInformationPaymentChecklistFlag"
              @click="paymentInformationPaymentChecklistShow = true"
              >{{ $t("riskControl_openList") }}</a
            >
            <span v-else class="noDataList">
              {{ $t("riskControl_openList") }}
            </span>
          </a-descriptions-item>
          <!-- 實際退費金額(參考值)： -->
          <a-descriptions-item
            :label="$t('riskControl_mcPayDesigActualRefundAmt')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPayDesigActualRefundAmt
            }}</a-descriptions-item
          >
          <!-- 總繳付金額(參考值)： -->
          <a-descriptions-item
            :label="$t('riskControl_mcPayDesigActualPayAmt')"
            v-if="theBusinessTypeCode == 'PS'"
            >{{
              theRiskControlDetailsData.mcPayDesigActualPayAmt
            }}</a-descriptions-item
          >
          <!-- 變更作業名稱 -->
          <a-descriptions-item
            :label="$t('riskControl_changeEventDescList')"
            v-if="theBusinessTypeCode == 'PS'"
          >
            <div v-if="nestedChangeEventDescList != null">
              <li v-for="(r, i) in nestedChangeEventDescList" :key="i">
                <span v-for="(c, j) in r" :key="j">
                  <span v-if="c" style="margin-right: 8px">{{ c }}</span>
                </span>
              </li>
            </div>
          </a-descriptions-item>
        </a-descriptions>
      </a-collapse-panel>
      <!-- 保費相關資訊 -->
      <a-collapse-panel
        key="4"
        :header="$t('riskControl_premiumRelatedInformation')"
        :disabled="false"
        v-if="theBusinessTypeCode == 'RN'"
      >
        <a-descriptions
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
          v-if="theBusinessTypeCode == 'RN'"
        >
          <!-- 保費資訊受訪者無其他有效契約 -->
          <a-descriptions-item
            :label="$t('riskControl_rnHasCustEffectiveContract')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnHasCustEffectiveContract
            }}</a-descriptions-item
          >
          <!-- 匯款金額 -->
          <a-descriptions-item
            :label="$t('riskControl_rnRemitTotal')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.rnRemitTotal }}</a-descriptions-item
          >
          <!-- 匯款分攤額 -->
          <a-descriptions-item
            :label="$t('riskControl_rnRemitShareQuota')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnRemitShareQuota
            }}</a-descriptions-item
          >
          <!-- 繳費項目 -->
          <a-descriptions-item
            :label="$t('riskControl_rnPayMode')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.rnPayMode }}</a-descriptions-item
          >
          <!-- 受訪者與要被保人關係 -->
          <a-descriptions-item
            :label="$t('riskControl_rnPayRelation')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.rnPayRelation }}</a-descriptions-item
          >
          <!-- 匯款日期 -->
          <a-descriptions-item
            :label="$t('riskControl_rnRemitDate')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.rnRemitDate }}</a-descriptions-item
          >
          <!-- 支票來源 -->
          <a-descriptions-item
            :label="$t('riskControl_rnReturnCheckSource')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckSource
            }}</a-descriptions-item
          >
          <!-- <a-descriptions-item
            label="支票的保單號碼"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckPolicyNo
            }}</a-descriptions-item
          >
          <a-descriptions-item
            label="支票保單重覆別"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckIdDup
            }}</a-descriptions-item
          >
          <a-descriptions-item
            label="支票的保單序號"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckPolicySeq
            }}</a-descriptions-item
          > -->
          <!-- 支票的保單號碼 -->
          <a-descriptions-item
            :label="$t('riskControl_rnReturnCheckCasePolicy')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckCasePolicy
            }}</a-descriptions-item
          >
          <!-- 支票要保人姓名 -->
          <a-descriptions-item
            :label="$t('riskControl_rnReturnCheckPherName')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckPherName
            }}</a-descriptions-item
          >
          <!-- 支票被保人姓名 -->
          <a-descriptions-item
            :label="$t('riskControl_rnReturnCheckInsuName')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckInsuName
            }}</a-descriptions-item
          >
          <!-- 支票繳別 -->
          <a-descriptions-item
            :label="$t('riskControl_rnReturnCheckPayType')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckPayType
            }}</a-descriptions-item
          >
          <!-- 支票繳別說明 -->
          <a-descriptions-item
            :label="$t('riskControl_rnReturnCheckPayTypeDesc')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckPayTypeDesc
            }}</a-descriptions-item
          >
          <!-- 支票繳費方式 -->
          <a-descriptions-item
            :label="$t('riskControl_rnReturnCheckPayKind')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckPayKind
            }}</a-descriptions-item
          >
          <!-- 支票繳費方式說明 -->
          <a-descriptions-item
            :label="$t('riskControl_rnReturnCheckPayKindDesc')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnReturnCheckPayKindDesc
            }}</a-descriptions-item
          >
          <!-- 支票面額 -->
          <a-descriptions-item
            :label="$t('riskControl_rnBookValue')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.rnBookValue }}</a-descriptions-item
          >
          <!-- 支票分攤額 -->
          <a-descriptions-item
            :label="$t('riskControl_rnCheckShareQuota')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.rnCheckShareQuota
            }}</a-descriptions-item
          >
          <!-- 支票號碼 -->
          <a-descriptions-item
            :label="$t('riskControl_rnCheckNo')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.rnCheckNo }}</a-descriptions-item
          >
          <!-- 支票帳號 -->
          <a-descriptions-item
            :label="$t('riskControl_rnCheckAccount')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.rnCheckAccount }}</a-descriptions-item
          >
          <!-- 業務員姓名(聲明表上之業務人員) -->
          <a-descriptions-item
            :label="$t('riskControl_policyAgentNameOnDeclarationForm')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              [
                theRiskControlDetailsData.policyAgentName,
                theRiskControlDetailsData.policyAgentName2,
              ].join(" ")
            }}</a-descriptions-item
          >
        </a-descriptions>
      </a-collapse-panel>
      <!-- 退函資訊 -->
      <a-collapse-panel
        key="5"
        :header="$t('riskControl_returnInformation')"
        :disabled="false"
        v-if="theBusinessTypeCode == 'RN'"
      >
        <a-descriptions
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
          v-if="theBusinessTypeCode == 'RN'"
        >
          <!-- 退回文件種類 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnLetterName')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnLetterName }}</a-descriptions-item
          >
          <!-- 退回日期 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnReturnDate')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnReturnDate }}</a-descriptions-item
          >
          <!-- 退回原因 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnReturnReason')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.ntrnReturnReason
            }}</a-descriptions-item
          >
          <!-- 最近一次繳費日 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnRecentPayDate')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.ntrnRecentPayDate
            }}</a-descriptions-item
          >
          <!-- 繳費項目 -->
          <a-descriptions-item
            :label="$t('riskControl_rnPayMode')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnPayKind }}</a-descriptions-item
          >
          <!-- 繳費方式 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPayKindDesc')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnPayType }}</a-descriptions-item
          >
          <!-- 繳費金額 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnPayAmt')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnPayAmt }}</a-descriptions-item
          >
          <!-- 最近一次還款日 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnRepayDate')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnRepayDate }}</a-descriptions-item
          >
          <!-- 還款方式 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnRepayType')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnRepayType }}</a-descriptions-item
          >
          <!-- 還款金額 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnRepayAmt')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnRepayAmt }}</a-descriptions-item
          >
          <!-- 收費/聯絡地址 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherContAddr')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.policyPherContZipCode +
              " " +
              theRiskControlDetailsData.policyPherContAddr
            }}</a-descriptions-item
          >
          <!-- 戶籍/住所地址 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherPermanentAddr')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.policyPherPermanentZipCode +
              " " +
              theRiskControlDetailsData.policyPherPermanentAddr
            }}</a-descriptions-item
          >
          <!-- 行動電話 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPherMob')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.policyPherMob }}</a-descriptions-item
          >
          <!-- 要保人Email -->
          <a-descriptions-item
            :label="$t('riskControl_policyCustEmail')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.policyCustEmail
            }}</a-descriptions-item
          >
          <!-- 寄送方式 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnSendType')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnSendType }}</a-descriptions-item
          >
          <!-- 寄送日期 -->
          <a-descriptions-item
            :label="$t('riskControl_ntrnSendDate')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.ntrnSendDate }}</a-descriptions-item
          >
        </a-descriptions>
      </a-collapse-panel>
      <!-- 保費授權書 -->
      <a-collapse-panel
        key="6"
        :header="$t('riskControl_premiumAttorneyPower')"
        :disabled="false"
        v-if="theBusinessTypeCode == 'RN'"
      >
        <a-descriptions
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
          v-if="theBusinessTypeCode == 'RN'"
        >
          <!-- 授權項目 -->
          <a-descriptions-item
            :label="$t('riskControl_premAuthItem')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premAuthItem }}</a-descriptions-item
          >
          <!-- 授權書編號 -->
          <a-descriptions-item
            :label="$t('riskControl_premAuthNo')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premAuthNo }}</a-descriptions-item
          >
          <!-- 授權書類型 -->
          <a-descriptions-item
            :label="$t('riskControl_premAuthType')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premAuthType }}</a-descriptions-item
          >
          <!-- 案件類型 -->
          <a-descriptions-item
            :label="$t('riskControl_premCaseType')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premCaseType }}</a-descriptions-item
          >
          <!-- 繳費方式 -->
          <a-descriptions-item
            :label="$t('riskControl_policyPayKindDesc')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.policyPayKindDesc
            }}</a-descriptions-item
          >
          <!-- 代繳機構 -->
          <a-descriptions-item
            :label="$t('riskControl_premRemitUnit')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premRemitUnit }}</a-descriptions-item
          >
          <!-- 帳/卡號 -->
          <a-descriptions-item
            :label="$t('riskControl_premAcntNo')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premAcntNo }}</a-descriptions-item
          >
          <!-- 有效期限 -->
          <a-descriptions-item
            :label="$t('riskControl_premCreditValid')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.premCreditValid
            }}</a-descriptions-item
          >
          <!-- 代繳人姓名 -->
          <a-descriptions-item
            :label="$t('riskControl_premRemitName')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premRemitName }}</a-descriptions-item
          >
          <!-- 代繳人ID -->
          <a-descriptions-item
            :label="$t('riskControl_premRemitId')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premRemitId }}</a-descriptions-item
          >
          <!-- 代繳人與要/被保險人關係 -->
          <a-descriptions-item
            :label="$t('riskControl_premRemitRelation')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.premRemitRelation
            }}</a-descriptions-item
          >
          <!-- 代繳人國籍 -->
          <a-descriptions-item
            :label="$t('riskControl_premRemitNation')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{
              theRiskControlDetailsData.premRemitNation
            }}</a-descriptions-item
          >
          <!-- 代繳人出生日期 -->
          <a-descriptions-item
            :label="$t('riskControl_premRemitBirth')"
            v-if="theBusinessTypeCode == 'RN'"
            >{{ theRiskControlDetailsData.premRemitBirth }}</a-descriptions-item
          >
        </a-descriptions>
      </a-collapse-panel>
      <!-- 客利相關資訊 -->
      <a-collapse-panel
        key="7"
        :header="$t('riskControl_customerInterestRelatedInformation')"
        :disabled="false"
        v-if="['CB', 'PL'].includes(theBusinessTypeCode)"
      >
        <a-descriptions
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
          v-if="['CB', 'PL'].includes(theBusinessTypeCode)"
        >
          <!-- 受益人ID -->
          <a-descriptions-item
            :label="$t('riskControl_loan1BeneId')"
            v-if="theBusinessTypeCode == 'CB'"
            >{{ theRiskControlDetailsData.loan1BeneId }}</a-descriptions-item
          >
          <!-- 受益人姓名 -->
          <a-descriptions-item
            :label="$t('riskControl_loan1BeneName')"
            v-if="theBusinessTypeCode == 'CB'"
            >{{ theRiskControlDetailsData.loan1BeneName }}</a-descriptions-item
          >
          <!-- 英文戶名 -->
          <a-descriptions-item
            :label="$t('riskControl_loan1BeneAccountEnglishName')"
            v-if="theBusinessTypeCode == 'CB'"
            >{{
              theRiskControlDetailsData.loan1BeneAccountEnglishName
            }}</a-descriptions-item
          >
          <!-- 給付項目 -->
          <a-descriptions-item
            :label="$t('riskControl_loan1PayItemName')"
            v-if="theBusinessTypeCode == 'CB'"
            >{{
              theRiskControlDetailsData.loan1PayItemName
            }}</a-descriptions-item
          >
          <!-- 預告函回覆方式 -->
          <a-descriptions-item
            :label="$t('riskControl_loan1NoticeReplyLetterKind')"
            v-if="theBusinessTypeCode == 'CB'"
            >{{
              theRiskControlDetailsData.loan1NoticeReplyLetterKind
            }}</a-descriptions-item
          >
          <!-- 應給付日 -->
          <a-descriptions-item
            :label="$t('riskControl_loan1DuePayDate')"
            v-if="theBusinessTypeCode == 'CB'"
            >{{
              theRiskControlDetailsData.loan1DuePayDate
            }}</a-descriptions-item
          >
          <!-- 給付金額 -->
          <a-descriptions-item
            :label="$t('riskControl_loan1PayAmt')"
            v-if="theBusinessTypeCode == 'CB'"
            >{{ theRiskControlDetailsData.loan1PayAmt }}</a-descriptions-item
          >
          <!-- 受益人匯款帳號 -->
          <a-descriptions-item
            :label="$t('riskControl_loan1PayBeneRemitAccount')"
            v-if="theBusinessTypeCode == 'CB'"
            >{{
              theRiskControlDetailsData.loan1PayBeneRemitAccount
            }}</a-descriptions-item
          >
          <!-- 銀行(郵局)／分行 -->
          <a-descriptions-item
            :label="$t('riskControl_loan2BankBranchName')"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.loan2BankBranchName
            }}</a-descriptions-item
          >
          <!-- 借款匯入戶名 -->
          <a-descriptions-item
            :label="$t('riskControl_loan2LoanRemitAccountName')"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.loan2LoanRemitAccountName
            }}</a-descriptions-item
          >
          <!-- 申請借款金額 -->
          <a-descriptions-item
            :label="$t('riskControl_loan2LoanAmt')"
            v-if="theBusinessTypeCode == 'PL'"
            >{{ theRiskControlDetailsData.loan2LoanAmt }}</a-descriptions-item
          >
          <!-- 借款匯入帳號 -->
          <a-descriptions-item
            :label="$t('riskControl_loan2LoanRemitAccountId')"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.loan2LoanRemitAccountId
            }}</a-descriptions-item
          >
          <!-- 支票寄送地址 -->
          <a-descriptions-item
            :label="$t('riskControl_loan2CheckSendAddr')"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.loan2CheckSendAddr
            }}</a-descriptions-item
          >
          <!-- 自動墊繳本金加利息 -->
          <a-descriptions-item
            :label="$t('riskControl_loan2AplPriAddInterest')"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.loan2AplPriAddInterest
            }}</a-descriptions-item
          >
          <!-- 實付借款金額 -->
          <a-descriptions-item
            :label="$t('riskControl_loan2ActualPayLoanAmt')"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.loan2ActualPayLoanAmt
            }}</a-descriptions-item
          >
          <!-- <a-descriptions-item
            label="繳付順序"
            v-if="theBusinessTypeCode == 'PL'"
            >{{ theRiskControlDetailsData.detallPaySeq }}</a-descriptions-item
          >
          <a-descriptions-item
            label="繳付保單號碼"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.detallPayPolicyNo
            }}</a-descriptions-item
          >
          <a-descriptions-item
            label="被保人ID"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.detallPayInsuId
            }}</a-descriptions-item
          >
          <a-descriptions-item
            label="繳付保單之被保人姓名"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.detallPayInsuName
            }}</a-descriptions-item
          >
          <a-descriptions-item
            label="繳付保單之要保人姓名"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.detallPayPolicyholderName
            }}</a-descriptions-item
          >
          <a-descriptions-item
            label="與要保人關係"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.detallPayRelation
            }}</a-descriptions-item
          >
          <a-descriptions-item
            label="繳付項目"
            v-if="theBusinessTypeCode == 'PL'"
            >{{ theRiskControlDetailsData.detallPayItem }}</a-descriptions-item
          >
          <a-descriptions-item
            label="實際繳付金額"
            v-if="theBusinessTypeCode == 'PL'"
            >{{
              theRiskControlDetailsData.detallActualPayTotal
            }}</a-descriptions-item
          > -->
        </a-descriptions>
      </a-collapse-panel>
      <!-- EASY GO 理賠關懷資訊區 -->
      <a-collapse-panel
        key="8"
        :header="$t('riskControl_easyGoClaimsCareInformationArea')"
        :disabled="false"
        v-if="theBusinessTypeCode == 'CL'"
      >
        <a-descriptions
          :layout="layoutStyle"
          :column="columnStyle"
          :size="sizeStyle"
          bordered
          v-if="theBusinessTypeCode == 'CL'"
        >
          <!-- 理賠區部 -->
          <a-descriptions-item
            :label="$t('riskControl_clClaimUnit')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{ theRiskControlDetailsData.clClaimUnit }}</a-descriptions-item
          >
          <!-- 前次理賠說明 -->
          <a-descriptions-item
            :label="$t('riskControl_clLastTimeClaimDesc')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{
              theRiskControlDetailsData.clLastTimeClaimDesc
            }}</a-descriptions-item
          >
          <!-- 前次理賠金額 -->
          <a-descriptions-item
            :label="$t('riskControl_clLastTimeClaimAmt')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{
              theRiskControlDetailsData.clLastTimeClaimAmt
            }}</a-descriptions-item
          >
          <!-- 罹癌日 -->
          <a-descriptions-item
            :label="$t('riskControl_clCancerDate')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{ theRiskControlDetailsData.clCancerDate }}</a-descriptions-item
          >
          <!-- 殘核日 -->
          <a-descriptions-item
            :label="$t('riskControl_clDisabilityDate')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{
              theRiskControlDetailsData.clDisabilityDate
            }}</a-descriptions-item
          >
          <!-- 給付次數(殘等) -->
          <a-descriptions-item
            :label="$t('riskControl_clDisabilityPayCount')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{
              theRiskControlDetailsData.clDisabilityPayCount
            }}</a-descriptions-item
          >
          <!-- 受款人姓名 -->
          <a-descriptions-item
            :label="$t('riskControl_clPayeeName')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{ theRiskControlDetailsData.clPayeeName }}</a-descriptions-item
          >
          <!-- 受款人ID -->
          <a-descriptions-item
            :label="$t('riskControl_clPayeeId')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{ theRiskControlDetailsData.clPayeeId }}</a-descriptions-item
          >
          <!-- 給付方式 -->
          <a-descriptions-item
            :label="$t('riskControl_clClaimPayKind')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{ theRiskControlDetailsData.clClaimPayKind }}</a-descriptions-item
          >
          <!-- 匯款行庫中文 -->
          <a-descriptions-item
            :label="$t('riskControl_clClaimRemitBankDesc')"
            v-if="theBusinessTypeCode == 'CL'"
            >{{
              theRiskControlDetailsData.clClaimRemitBankDesc
            }}</a-descriptions-item
          >
        </a-descriptions>
      </a-collapse-panel>
    </a-collapse>
    <a-descriptions
      :layout="layoutStyle"
      :column="columnStyle"
      :size="sizeStyle"
      bordered
      style=""
    >
      <template v-slot:title>
        <div class="modal-descriptions-telList">
          <a-icon type="switcher" />
          <!-- 電話清單 -->
          <a v-if="telListData.data.length > 0" @click="telListShow = true">{{
            $t("riskControl_telList")
          }}</a>
          <span v-else class="noDataList">{{ $t("riskControl_telList") }}</span>
        </div>
      </template>
    </a-descriptions>
    <!-- 實際繳款人資訊 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="realPayerInfoShow"
      :title="$t('riskControl_realPayerInfo')"
      width="45%"
      :okText="$t('onDutyPage_close')"
      :closable="false"
      :removeCancelButton="true"
      :isMasked="false"
      @ok="realPayerInfoShow = false"
    >
      <a-descriptions
        :layout="layoutStyle"
        :column="columnStyle"
        :size="sizeStyle"
        bordered
        v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
      >
        <!-- 繳款人姓名 -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerName')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerName }}</a-descriptions-item
        >
        <!-- 繳款人ID -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerId')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerId }}</a-descriptions-item
        >
        <!-- 繳款人生日 -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerBitrhday')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerBitrhday }}</a-descriptions-item
        >
        <!-- 繳款人與要被保人關係 -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerRelate')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerRelate }}</a-descriptions-item
        >
        <!-- 繳款人法代姓名 -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerLegalName')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerLegalName }}</a-descriptions-item
        >
        <!-- 繳款人法代ID -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerLegalId')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerLegalId }}</a-descriptions-item
        >
        <!-- 首期授權方式 -->
        <a-descriptions-item
          :label="$t('riskControl_nbFirstAuthKind')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbFirstAuthKind }}</a-descriptions-item
        >
        <!-- 首期授權銀行 -->
        <a-descriptions-item
          :label="$t('riskControl_nbFirstAuthBankName')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{
            theRiskControlDetailsData.nbFirstAuthBankName
          }}</a-descriptions-item
        >
        <!-- 繳款人住家電話 -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerTel')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerTel }}</a-descriptions-item
        >
        <!-- 繳款人公司電話 -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerOfficeTel')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerOfficeTel }}</a-descriptions-item
        >
        <!-- 繳款人行動電話 -->
        <a-descriptions-item
          :label="$t('riskControl_nbPayerMob')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.nbPayerMob }}</a-descriptions-item
        >
      </a-descriptions>
    </DragModal>
    <!-- 應繳未繳資訊 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="shouldPayNoPayInfoShow"
      :title="$t('riskControl_shouldPayNotPayInfo')"
      width="45%"
      :okText="$t('onDutyPage_close')"
      :closable="false"
      :removeCancelButton="true"
      :isMasked="false"
      @ok="shouldPayNoPayInfoShow = false"
    >
      <a-descriptions
        :layout="layoutStyle"
        :column="columnStyle"
        :size="sizeStyle"
        bordered
        v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
      >
        <!-- 保單號碼 -->
        <a-descriptions-item
          :label="$t('riskControl_policyCasePolicy')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.policyCasePolicy }}</a-descriptions-item
        >
        <!-- 業務員姓名 -->
        <a-descriptions-item
          :label="$t('riskControl_policyAgentName')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.policyAgentName }}</a-descriptions-item
        >
        <!-- 業務員ID -->
        <a-descriptions-item
          :label="$t('riskControl_policyAgentId')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.policyAgentId }}</a-descriptions-item
        >
        <!-- 業務員單位代號 -->
        <a-descriptions-item
          :label="$t('riskControl_policyAgentUnitNo')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{
            theRiskControlDetailsData.policyAgentUnitNo
          }}</a-descriptions-item
        >
        <!-- 業務員單位名稱 -->
        <a-descriptions-item
          :label="$t('riskControl_policyAgentUnitName')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{
            theRiskControlDetailsData.policyAgentUnitName
          }}</a-descriptions-item
        >
        <!-- 應繳保費日 -->
        <a-descriptions-item
          :label="$t('riskControl_policyPolicyCostDay')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{
            theRiskControlDetailsData.policyPolicyCostDate
          }}</a-descriptions-item
        >
        <!-- 幣別 -->
        <a-descriptions-item
          :label="$t('riskControl_policyCurrencyTypeName')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{
            theRiskControlDetailsData.policyCurrencyTypeName
          }}</a-descriptions-item
        >
        <!-- 應繳保費 -->
        <a-descriptions-item
          :label="$t('riskControl_policyPolicyCost')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.policyPolicyCost }}</a-descriptions-item
        >
        <!-- 繳費方式 -->
        <a-descriptions-item
          :label="$t('riskControl_policyPayKindDesc')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{
            theRiskControlDetailsData.policyPayKindDesc
          }}</a-descriptions-item
        >
        <!-- 寬限期滿日 -->
        <a-descriptions-item
          :label="$t('riskControl_rnGracePeriodEndDate')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{
            theRiskControlDetailsData.rnGracePeriodEndDate
          }}</a-descriptions-item
        >
        <!-- 自動墊繳日 -->
        <a-descriptions-item
          :label="$t('riskControl_rnAplDate')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{ theRiskControlDetailsData.rnAplDate }}</a-descriptions-item
        >
        <!-- 停效日 -->
        <a-descriptions-item
          :label="$t('riskControl_rnStopEffectiveDate')"
          v-if="businessTypeNbGpDs.includes(theBusinessTypeCode)"
          >{{
            theRiskControlDetailsData.rnStopEffectiveDate
          }}</a-descriptions-item
        >
      </a-descriptions>
    </DragModal>
    <!-- 要保人指定匯款帳戶 -->
    <!-- 關閉 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="applicantDesignatedRemittanceAccountShow"
      :title="$t('riskControl_applicantDesignatedRemittanceAccount')"
      width="45%"
      :okText="$t('riskControl_close')"
      :closable="false"
      :removeCancelButton="true"
      :isMasked="false"
      @ok="applicantDesignatedRemittanceAccountShow = false"
    >
      <FblDataGrid
        :themeColor="'theme2'"
        :row-key="applicantDesignatedRemittanceAccountData.rowKey"
        :columns="applicantDesignatedRemittanceAccountData.columns"
        :data="applicantDesignatedRemittanceAccountData.data"
      ></FblDataGrid>
      <!-- <a-descriptions
        :layout="layoutStyle"
        :column="columnStyle"
        :size="sizeStyle"
        bordered
        v-if="theBusinessTypeCode == 'PS'"
      >
        <a-descriptions-item
          label="銀行戶名"
          v-if="theBusinessTypeCode == 'PS'"
          >{{
            theRiskControlDetailsData.payBeneAccountName
          }}</a-descriptions-item
        >
        <a-descriptions-item
          label="銀行簡稱"
          v-if="theBusinessTypeCode == 'PS'"
          >{{
            theRiskControlDetailsData.payBenePayBankAbbreviation
          }}</a-descriptions-item
        >
        <a-descriptions-item label="帳號" v-if="theBusinessTypeCode == 'PS'">{{
          theRiskControlDetailsData.payBeneAccountId
        }}</a-descriptions-item>
      </a-descriptions> -->
    </DragModal>
    <!-- 變更後受益人清單 -->
    <!-- 關閉 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="listOfBeneficiariesAfterChangeShow"
      :title="$t('riskControl_listOfBeneficiariesAfterChange')"
      width="45%"
      :okText="$t('riskControl_close')"
      :closable="false"
      :removeCancelButton="true"
      :isMasked="false"
      @ok="listOfBeneficiariesAfterChangeShow = false"
    >
      <FblDataGrid
        :themeColor="'theme2'"
        :row-key="listOfBeneficiariesAfterChangeData.rowKey"
        :columns="listOfBeneficiariesAfterChangeData.columns"
        :data="listOfBeneficiariesAfterChangeData.data"
      >
        <template v-slot:benefitBeneAddrTemp="slotProps">
          <p>
            {{
              slotProps.data.benefitBeneZipCode +
              " " +
              slotProps.data.benefitBeneAddr
            }}
          </p>
        </template>
      </FblDataGrid>
      <!-- <a-descriptions-item label="受益人" v-if="theBusinessTypeCode == 'PS'">{{
        theRiskControlDetailsData.benefitBeneName
      }}</a-descriptions-item>
      <a-descriptions-item
        label="聯絡電話"
        v-if="theBusinessTypeCode == 'PS'"
        >{{ theRiskControlDetailsData.benefitBeneTel }}</a-descriptions-item
      >
      <a-descriptions-item
        label="行動電話"
        v-if="theBusinessTypeCode == 'PS'"
        >{{ theRiskControlDetailsData.benefitBeneMobile }}</a-descriptions-item
      >
      <a-descriptions-item
        label="聯絡地址"
        v-if="theBusinessTypeCode == 'PS'"
        >{{
          theRiskControlDetailsData.benefitBeneZipCode +
          " " +
          theRiskControlDetailsData.benefitBeneAddr
        }}</a-descriptions-item
      > -->
    </DragModal>
    <!-- 繳付資訊：繳付清單 -->
    <!-- 關閉 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="paymentInformationPaymentChecklistShow"
      :title="$t('riskControl_paymentInformationPaymentChecklist')"
      width="45%"
      :okText="$t('riskControl_close')"
      :closable="false"
      :removeCancelButton="true"
      :isMasked="false"
      @ok="paymentInformationPaymentChecklistShow = false"
    >
      <a-descriptions
        :layout="layoutStyle"
        :column="columnStyle"
        :size="sizeStyle"
        bordered
        v-if="theBusinessTypeCode == 'PS'"
      >
        <!-- 繳付順序 -->
        <a-descriptions-item
          :label="$t('riskControl_detallPaySeq')"
          v-if="theBusinessTypeCode == 'PS'"
          >{{ theRiskControlDetailsData.detallPaySeq }}</a-descriptions-item
        >
        <!-- 繳付保單號碼 -->
        <a-descriptions-item
          :label="$t('riskControl_detallPayCasePolicy')"
          v-if="theBusinessTypeCode == 'PS'"
          >{{
            theRiskControlDetailsData.detallPayCasePolicy
          }}</a-descriptions-item
        >
        <!-- 被保人ID -->
        <a-descriptions-item
          :label="$t('riskControl_detallPayInsuId')"
          v-if="theBusinessTypeCode == 'PS'"
          >{{ theRiskControlDetailsData.detallPayInsuId }}</a-descriptions-item
        >
        <!-- 繳付保單之被保人姓名 -->
        <a-descriptions-item
          :label="$t('riskControl_detallPayInsuName')"
          v-if="theBusinessTypeCode == 'PS'"
          >{{
            theRiskControlDetailsData.detallPayInsuName
          }}</a-descriptions-item
        >
        <!-- 繳付保單之要保人姓名 -->
        <a-descriptions-item
          :label="$t('riskControl_detallPayPolicyholderName')"
          v-if="theBusinessTypeCode == 'PS'"
          >{{
            theRiskControlDetailsData.detallPayPolicyholderName
          }}</a-descriptions-item
        >
        <!-- 與要保人關係 -->
        <a-descriptions-item
          :label="$t('riskControl_detallPayRelation')"
          v-if="theBusinessTypeCode == 'PS'"
          >{{
            theRiskControlDetailsData.detallPayRelation
          }}</a-descriptions-item
        >
        <!-- 繳付項目 -->
        <a-descriptions-item
          :label="$t('riskControl_detallPayItem')"
          v-if="theBusinessTypeCode == 'PS'"
          >{{ theRiskControlDetailsData.detallPayItem }}</a-descriptions-item
        >
        <!-- 實際繳付金額 -->
        <a-descriptions-item
          :label="$t('riskControl_detallActualPayTotal')"
          v-if="theBusinessTypeCode == 'PS'"
          >{{
            theRiskControlDetailsData.detallActualPayTotal
          }}</a-descriptions-item
        >
      </a-descriptions>
    </DragModal>
    <!-- 電話清單 -->
    <!-- 關閉 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="telListShow"
      :title="$t('riskControl_telList')"
      width="45%"
      :okText="$t('riskControl_close')"
      :closable="false"
      :removeCancelButton="true"
      :isMasked="false"
      @ok="telListShow = false"
    >
      <FblDataGrid
        :themeColor="'theme2'"
        :row-key="telListData.rowKey"
        :columns="telListData.columns"
        :data="telListData.data"
      >
        <template v-slot:policyPolicyNoTemp>
          <p>{{ theRiskControlDetailsData.policyPolicyNo }}</p>
        </template>
        <template v-slot:policyCustNameTemp>
          <p>{{ theRiskControlDetailsData.policyCustName }}</p>
        </template>
      </FblDataGrid>
      <!-- <a-descriptions-item label="保單號碼">{{
        theRiskControlDetailsData.policyPolicyNo
      }}</a-descriptions-item>
      <a-descriptions-item label="受訪者姓名">{{
        theRiskControlDetailsData.policyCustName
      }}</a-descriptions-item>
      <a-descriptions-item label="順序">{{
        theRiskControlDetailsData.listSeqNo
      }}</a-descriptions-item>
      <a-descriptions-item label="取用原則">{{
        theRiskControlDetailsData.listUseReason
      }}</a-descriptions-item>
      <a-descriptions-item label="聯絡電話">{{
        theRiskControlDetailsData.listContTel
      }}</a-descriptions-item>
      <a-descriptions-item label="來源(保單/受理案號)">{{
        theRiskControlDetailsData.listSourceCaseNo
      }}</a-descriptions-item> -->
    </DragModal>
    <!-- 見證人資訊 -->
    <!-- 關閉 -->
    <DragModal
      class="c-section c-section--else pointer-events-none"
      :visible="illIteracyShow"
      :title="$t('riskControl_illIteracyChecklist')"
      width="45%"
      :okText="$t('riskControl_close')"
      :closable="false"
      :removeCancelButton="true"
      :isMasked="false"
      @ok="illIteracyShow = false"
    >
      <a-descriptions
        :layout="layoutStyle"
        :column="columnStyle"
        :size="sizeStyle"
        bordered
      >
        <!-- 客戶身份 -->
        <a-descriptions-item
          :label="$t('riskControl_illIteracyCustomerType')"
          >{{ riskControlDetailsShowData.custType }}</a-descriptions-item
        >
        <!-- 客戶姓名 -->
        <a-descriptions-item
          :label="$t('riskControl_illIteracyCustomerName')"
          >{{ riskControlDetailsShowData.custName }}</a-descriptions-item
        >
        <!-- 蓋手印 -->
        <a-descriptions-item
          :label="$t('riskControl_illIteracySignatureHand')"
          >{{ riskControlDetailsShowData.isSignatureHand }}</a-descriptions-item
        >
        <!-- 不識字 -->
        <a-descriptions-item :label="$t('riskControl_illIteracyItacy')">{{
          riskControlDetailsShowData.isItacy
        }}</a-descriptions-item>
        <!-- 見證人1姓名 -->
        <a-descriptions-item :label="$t('riskControl_illIteracyNameOne')">{{
          riskControlDetailsShowData.witnessNameOne
        }}</a-descriptions-item>
        <!-- 見證人1ID -->
        <a-descriptions-item :label="$t('riskControl_illIteracyIDOne')">{{
          riskControlDetailsShowData.witnessIDOne
        }}</a-descriptions-item>
        <!-- 見證人2姓名 -->
        <a-descriptions-item :label="$t('riskControl_illIteracyNameTwo')">{{
          riskControlDetailsShowData.witnessNameTwo
        }}</a-descriptions-item>
        <!-- 見證人2ID -->
        <a-descriptions-item :label="$t('riskControl_illIteracyIDTwo')">{{
          riskControlDetailsShowData.witnessIDTwo
        }}</a-descriptions-item>
      </a-descriptions>
    </DragModal>
  </div>
</template>


<script src="./RiskControl.ts" lang="ts"></script>

<style lang="less" scoped>
/deep/ .compare-change {
  .ant-descriptions-item-label {
    width: 200px;
  }
}
.modal-collapse {
  border-radius: 4px 4px 0 0;
  /deep/ .ant-collapse-item {
    &:first-child {
      .ant-collapse-header {
        border-radius: 4px 4px 0 0;
      }
    }
    &:last-child {
      border-radius: 0;
      .ant-collapse-header {
        border-radius: 0;
      }
      .ant-collapse-content-active {
        border-radius: 0;
      }
    }
  }
}
.modal-descriptions-telList {
  background-color: @DESCRIPTION-HEADER-BG-DARK;
  padding: 12px 16px;
  border: 1px solid @DESCRIPTION-BORDER-COLOR;
  border-top: none;
  border-radius: 0 0 4px 4px;
  cursor: pointer;
}

/deep/ .ant-descriptions {
  &-title {
    font-size: 14px;
    font-weight: 100;
    margin: 0;
    a {
      padding-left: 10px;
      .text-white-format();
    }
    .anticon {
      svg {
        width: 12px;
        height: 12px;
      }
      .text-white-format();
    }
  }
  &-view {
    border: none;
  }
}

/deep/ .ant-collapse-header {
  background-color: @COLLAPSE-HEADER-BG;
  .text-white-format();
}

/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
  background-color: @DESCRIPTION-HEADER-BG;
  font-weight: 600;
  .text-white-format();
}
// 如果不同標記符號要給紅色
.different {
  color: red;
  font-weight: 600;
  font-size: 16px;
}
// 如果清單內沒有資料需灰化
.noDataList {
  color: Silver;
}
.contentscrollbar {
     display: block;
     width: "100%";
     height: 500px;
     overflow-y: auto;
 }
</style>
