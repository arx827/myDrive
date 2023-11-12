<template>
  <div class="container">
    <div class="page__title">
      查詢結果
    </div>
    <div class="d-flex header">
      <div class="header__radio">
        <a-radio-group
          :default-value="tableTypeOption[0].value"
          button-style="solid"
          @change="onClickRadio"
        >
          <a-radio-button
            v-for="(item,index) in tableTypeOption"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class="header__btn">
        <button
          class="btn__radius--primary--outline--small"
          @click="downloadSearch()"
        >
          下載
        </button>
      </div>
    </div>
    <div class="table">
      <a-table
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data-source="gridData.data"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
        :pagination="gridData.pagination"
        bordered
        @change="onPageChange($event)"
      >
        <span slot="customTitle"><div @click="error()">派件</div></span>
        <div
          slot="handleSend"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              :disabled="slotProps.closeCaseDesc==='已結案' || !isDispatch"
              @click="slotProps.senddisabled=!slotProps.senddisabled"
            />
          </div>
        </div>
        <div
          slot="handleNurse"
          slot-scope="slotProps"
        >
          <div class="text-center">
            {{ slotProps.ownerName }}
          </div>
        </div>
        <div
          slot="handleNeck"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.neck === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.neck }}
            </div>
          </div>
          <div
            v-else-if="slotProps.neck === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.neck }}
            </div>
          </div>
          <div
            v-else-if="slotProps.neck === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.neck }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.neck }}
          </div>
        </div>
        <div
          slot="handleLeft_shoulder"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.leftShoulder === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.leftShoulder }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftShoulder === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.leftShoulder }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftShoulder === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.leftShoulder }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.leftShoulder }}
          </div>
        </div>
        <div
          slot="handleLeft_hand_front"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.leftElbowLeftForearm === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.leftElbowLeftForearm }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftElbowLeftForearm === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.leftElbowLeftForearm }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftElbowLeftForearm === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.leftElbowLeftForearm }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.leftElbowLeftForearm }}
          </div>
        </div>
        <div
          slot="handleLeft_hand_palm"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.leftHandLeftWrist === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.leftHandLeftWrist }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftHandLeftWrist === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.leftHandLeftWrist }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftHandLeftWrist === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.leftHandLeftWrist }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.leftHandLeftWrist }}
          </div>
        </div>
        <div
          slot="handleLeft_butt"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.lefHipLeftThigh === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.lefHipLeftThigh }}
            </div>
          </div>
          <div
            v-else-if="slotProps.lefHipLeftThigh === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.lefHipLeftThigh }}
            </div>
          </div>
          <div
            v-else-if="slotProps.lefHipLeftThigh === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.lefHipLeftThigh }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.lefHipLeftThigh }}
          </div>
        </div>
        <div
          slot="handleLeft_knee"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.leftKnee === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.leftKnee }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftKnee === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.leftKnee }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftKnee === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.leftKnee }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.leftKnee }}
          </div>
        </div>
        <div
          slot="handleLeft_ankle"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.leftAnkleLeftFoot === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.leftAnkleLeftFoot }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftAnkleLeftFoot === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.leftAnkleLeftFoot }}
            </div>
          </div>
          <div
            v-else-if="slotProps.leftAnkleLeftFoot === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.leftAnkleLeftFoot }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.leftAnkleLeftFoot }}
          </div>
        </div>
        <div
          slot="handleUp_back"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.upperBack === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.upperBack }}
            </div>
          </div>
          <div
            v-else-if="slotProps.upperBack === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.upperBack }}
            </div>
          </div>
          <div
            v-else-if="slotProps.upperBack === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.upperBack }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.upperBack }}
          </div>
        </div>
        <div
          slot="handleRight_shoulder"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.rightShoulder === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.rightShoulder }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightShoulder === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.rightShoulder }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightShoulder === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.rightShoulder }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.rightShoulder }}
          </div>
        </div>
        <div
          slot="handleRight_hand_front"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.rightElbowRightForearm === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.rightElbowRightForearm }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightElbowRightForearm === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.rightElbowRightForearm }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightElbowRightForearm === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.rightElbowRightForearm }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.rightElbowRightForearm }}
          </div>
        </div>
        <div
          slot="handleDown_back"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.lowerBack === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.lowerBack }}
            </div>
          </div>
          <div
            v-else-if="slotProps.lowerBack === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.lowerBack }}
            </div>
          </div>
          <div
            v-else-if="slotProps.lowerBack === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.lowerBack }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.lowerBack }}
          </div>
        </div>
        <div
          slot="handleRight_hand_palm"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.rightHandRightWrist === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.rightHandRightWrist }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightHandRightWrist === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.rightHandRightWrist }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightHandRightWrist === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.rightHandRightWrist }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.rightHandRightWrist }}
          </div>
        </div>
        <div
          slot="handleRight_butt"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.rightHipRightThigh === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.rightHipRightThigh }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightHipRightThigh === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.rightHipRightThigh }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightHipRightThigh === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.rightHipRightThigh }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.rightHipRightThigh }}
          </div>
        </div>
        <div
          slot="handleRight_knee"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.rightKnee === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.rightKnee }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightKnee === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.rightKnee }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightKnee === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.rightKnee }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.rightKnee }}
          </div>
        </div>
        <div
          slot="handleRight_ankle"
          slot-scope="slotProps"
        >
          <div
            v-if="slotProps.rightAnkleRightFoot === '5'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--red" />
            </div>
            <div>
              {{ slotProps.rightAnkleRightFoot }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightAnkleRightFoot === '4'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--yellow" />
            </div>
            <div>
              {{ slotProps.rightAnkleRightFoot }}
            </div>
          </div>
          <div
            v-else-if="slotProps.rightAnkleRightFoot === '3'"
            class="d-flex justify-content-center"
          >
            <div class="d-flex flex-column justify-content-center">
              <div class="mark--green" />
            </div>
            <div>
              {{ slotProps.rightAnkleRightFoot }}
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-content-center"
          >
            {{ slotProps.rightAnkleRightFoot }}
          </div>
        </div>
        <div
          slot="handleTea"
          slot-scope="slotProps"
          class="checkbox__column"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              @click="slotProps.teadisabled=!slotProps.teadisabled"
            />
          </div>
        </div>
        <div
          slot="handleDoc"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              @click="slotProps.docdisabled=!slotProps.docdisabled"
            />
          </div>
        </div>
        <div
          slot="handleForm"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              @click="slotProps.formdisabled=!slotProps.formdisabled"
            />
          </div>
        </div>
        <div
          slot="handleDownload"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <a-checkbox
              @click="slotProps.downloaddisabled=!slotProps.downloaddisabled"
            />
          </div>
        </div>
        <div
          slot="handleCase"
          slot-scope="slotProps"
        >
          <div class="d-flex justify-content-center">
            <div class="d-flex justify-content-center align-items-center iconblock">
              <a-icon
                type="idcard"
                theme="outlined"
                @click="push(slotProps.userId)"
              />
            </div>
          </div>
        </div>
      </a-table>
    </div>
    <div class="btn__wrap text-center">
      <router-link :to="'/occupationSafety/ErgonomicHazard/QueryData/index'">
        <button class="btn__radius--primary--outline mb-2">
          返回查詢
        </button>
      </router-link>
      <button
        class="btn__radius--primary--outline mb-2"
        :disabled="!isDispatch"
        @click="openSendModal"
      >
        派件
      </button>
      <button
        class="btn__radius--primary--outline mb-2"
        @click="downloadEr()"
      >
        下載人因工程檢核表
      </button>
      <button
        class="btn__radius--primary mb-2"
        @click="onSubmit()"
      >
        發送
      </button>
    </div>
    <ChooseSendNurseModal
      :visible="sendModalVisible"
      @closeSendModal="closeSendModal"
      @toSendModalResult="toSendModalResult"
    />
    <EmailModal
      :visible="emailModalVisible"
      :mail-drop-list="mailSend.mailDropList"
      :user-data="mailSend.sendUser"
      :send-case-id="mailSend.sendCaseId"
      :send-form-id="mailSend.sendFormId"
      :send-form-status="mailSend.sendFormStatus"
      @closeModal="emailModalVisible=false"
      @toSendMailModalResult="toSendMailModalResult"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import InfoModal from '@/plugins/notification/infoModal';
import ChooseSendNurseModal from '@/components/modal/ChooseSendNurseModal.vue';

import {
	CheckDispatchNurseDto,
	HfeBuildingHumanHazardQueryInputDto,
	HfeBuildingHumanDispatchListDto,
	UidDto,
	HfeBuildingHumanSendNotificationListDto,
	HfeBuildingHumanHazardEmailDropListInputDto,
	UidstDto,
} from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import EmailModal from '@/pages/OccupationalSafety/ErgonomicHazard/QueryData/EmailNotificationModal.vue';

@Component({ components: { FblDataGrid, ChooseSendNurseModal, EmailModal } })
export default class BuildDataList extends Vue {
	@Action('setLoading') setLoading;

  pageWidth = document.documentElement.scrollWidth;

  // table顯示的類別
	tableType = 'ALL';

	// radio的button選項
	tableTypeOption = [
		{ label: '全部地區', value: 'ALL' },
		{ label: '北區', value: 'NORTH' },
		{ label: '中區', value: 'CENTRAL' },
		{ label: '南區', value: 'SOUTH' },
	]

  data = [];

  // 表格欄位名稱資料
  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['5', '10', '25'],
  		showSizeChanger: true,
  		showQuickJumper: true,
  	},
  	columns: [
  		{
  			fixed: 'left',
  			slots: { title: 'customTitle' },
  			scopedSlots: { customRender: 'handleSend' },
  		},
  		{
  			title: '負責護理人員',
  			scopedSlots: { customRender: 'handleNurse' },
  			fixed: 'left',
  			width: 100,
  		},
  		// 組織樹
  		{
  			title: '組織樹',
  			dataIndex: 'org_tree',
  			key: 'org_tree',
  			children: [
  				{
  					title: '姓名',
  					align: 'center',
  					dataIndex: 'name',
  					key: 'name',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '部門/單位',
  					align: 'center',
  					dataIndex: 'deptNameNow',
  			    key: 'deptNameNow',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '職稱',
  					align: 'center',
  					dataIndex: 'title',
  		    	key: 'title',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '在職狀態',
  					align: 'center',
  					dataIndex: 'curStatus',
  		    	key: 'curStatus',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '工作地點',
  					align: 'center',
  					dataIndex: 'workArea',
  		    	key: 'workArea',
  					width: 190,
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '聯繫電話',
  					align: 'center',
  					dataIndex: 'phoneNo',
  		    	key: 'phoneNo',
  					customRender: (data) => ((data) || '-'),
  				},
  			],
  		},
  		// 基本資料 (Excel匯入)
  		{
  			title: '基本資料 (Excel匯入)',
  			dataIndex: 'detail',
  			key: 'detail',
  			children: [
  				{
  					title: '部門/單位',
  					align: 'center',
  					dataIndex: 'deptName',
  			    key: 'deptName',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '性別',
  					align: 'center',
  					dataIndex: 'sex',
  		    	key: 'sex',
  					customRender: (data) => ((data) || '-'),
  					// customRender: (data) => {
  					// 	if (data) {
  					// 		if (data === 'M') {
  					// 			return '男';
  					// 		}
  					// 		return '女';
  					// 	}
  					// },
  				},
  				{
  					title: '員工編號',
  					align: 'center',
  					dataIndex: 'empId',
  		    	key: 'empId',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '作業名稱',
  					align: 'center',
  					dataIndex: 'jobName',
  		    	key: 'jobName',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '慣用手',
  					align: 'center',
  					dataIndex: 'dominantHand',
  		    	key: 'dominantHand',
  					customRender: (data) => ((data) || '-'),
  				},
  			],
  		},
  		// 問卷調查
  		{
  			title: '問卷調查',
  			dataIndex: 'qa',
  			key: 'qa',
  			children: [
  				{
  					title: '問卷完成狀態',
  					align: 'center',
  					dataIndex: 'recordStatus',
  			    key: 'recordStatus',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '不適症狀',
  					align: 'center',
  					dataIndex: 'symptoms',
  		    	key: 'symptoms',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '持續時間',
  					align: 'center',
  					dataIndex: 'duration',
  		    	key: 'duration',
  					customRender: (data) => ((data) || '-'),
  				},
  			],
  		},
  		// 症狀調查
  		{
  			title: '症狀調查',
  			dataIndex: 'survey',
  			key: 'survey',
  			children: [
  				{
  					title: '1. 頸部',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleNeck' },
  				},
  				{
  					title: '2. 左肩',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleLeft_shoulder' },
  				},
  				{
  					title: '3. 左手肘/左前臂',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleLeft_hand_front' },
  				},
  				{
  					title: '4. 左手/左手腕',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleLeft_hand_palm' },
  				},
  				{
  					title: '5. 左臀/左大腿',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleLeft_butt' },
  				},
  				{
  					title: '6. 左膝',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleLeft_knee' },
  				},
  				{
  					title: '7. 左腳踝/左腳',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleLeft_ankle' },
  				},
  				{
  					title: '8. 上背',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleUp_back' },
  				},
  				{
  					title: '9. 右肩',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleRight_shoulder' },
  				},
  				{
  					title: '10. 右手肘/右前臂',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleRight_hand_front' },
  				},
  				{
  					title: '11. 下背',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleDown_back' },
  				},
  				{
  					title: '12. 右手/右手腕',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleRight_hand_palm' },
  				},
  				{
  					title: '13. 右臀/右大腿',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleRight_butt' },
  				},
  				{
  					title: '14. 右膝',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleRight_knee' },
  				},
  				{
  					title: '15. 右腳踝/右腳',
  					width: 110,
  					align: 'center',
  					scopedSlots: { customRender: 'handleRight_ankle' },
  				},
  			],
  		},
  		// 系統帶入
  		{
  			title: '系統帶入',
  			dataIndex: 'sys',
  			key: 'sys',
  			children: [
  				{
  					title: '級別標示備註',
  					width: 100,
  					align: 'center',
  					dataIndex: 'level',
  			    key: 'level',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '簡易人因工程改善',
  					width: 100,
  					align: 'center',
  					dataIndex: 'simpleImprovement',
  		    	key: 'simpleImprovement',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '收案日期',
  					align: 'center',
  					dataIndex: 'closedDate',
  		    	key: 'closedDate',
  					customRender: (data) => {
  						if (data) {
  							if (data === 'Y') {
  								return '是';
  							}
  							if (data === 'N') {
  								return '否';
  							}
  							if (data.length > 3) {
  								return moment(data).format('YYYY/MM/DD');
  							}
  						} else {
  							return '-';
  						}
  					},
  				},
  				{
  					title: '發送衛教時間',
  					align: 'center',
  					dataIndex: 'snedEduDate',
  		    	key: 'snedEduDate',
  					customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : '-'),
  				},
  				{
  					title: '臨場醫師諮詢時間/或拒絕諮詢',
  					width: 130,
  					align: 'center',
  					dataIndex: 'phyConsultDate',
  		    	key: 'phyConsultDate',
  					customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : '-'),
  				},
  			],
  		},
  		// 個人維護
  		{
  			title: '個人維護',
  			dataIndex: 'personal',
  			key: 'personal',
  			children: [
  				{
  					title: '級別檢核結果',
  					width: 100,
  					align: 'center',
  					dataIndex: 'checkLevel',
  			    key: 'checkLevel',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '級別改變原因',
  					width: 100,
  					align: 'center',
  					dataIndex: 'changeLevelReason',
  		    	key: 'changeLevelReason',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '簡易人因工程改善：是否改善',
  					width: 120,
  					align: 'center',
  					dataIndex: 'isImproved',
  		    	key: 'isImproved',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '職業病',
  					align: 'center',
  					dataIndex: 'occupationalDisease',
  		    	key: 'occupationalDisease',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '通報中',
  					align: 'center',
  					dataIndex: 'isNotice',
  		    	key: 'isNotice',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '追蹤紀錄',
  					align: 'center',
  					dataIndex: 'traceLog',
  		    	key: 'traceLog',
  					customRender: (data) => ((data) || '-'),
  				},
  				{
  					title: '備註',
  					align: 'center',
  					dataIndex: 'remark',
  		    	key: 'remark',
  					customRender: (data) => ((data) || '-'),
  				},
  			],
  		},
  		{
  			title: '發送衛教指導通知(跟催)',
  			fixed: this.pageWidth > 1000 ? 'right' : null,
  			scopedSlots: { customRender: 'handleTea' },
  			width: 100,
  		},
  		{
  			title: '發送醫師諮詢通知(跟催)',
  			fixed: this.pageWidth > 1000 ? 'right' : null,
  			scopedSlots: { customRender: 'handleDoc' },
  			width: 100,
  		},
  		{
  			title: '發送表單填寫通知(跟催)',
  			fixed: this.pageWidth > 1000 ? 'right' : null,
  			scopedSlots: { customRender: 'handleForm' },
  			width: 100,
  		},
  		{
  			title: '下載人因工程檢核表',
  			fixed: this.pageWidth > 1000 ? 'right' : null,
  			scopedSlots: { customRender: 'handleDownload' },
  			width: 100,
  		},
  		{
  			title: '個案維護',
  			fixed: this.pageWidth > 1000 ? 'right' : null,
  			scopedSlots: { customRender: 'handleCase' },
  			width: 100,
  		},
  	],
  }

  period = null; // 查詢年份

  ownerId = null;

  toDoId = null;

  type = '';

  // 獲取表格資料
  async getGridData() {
  	this.setLoading(true);
  	this.gridData.data = [];
  	const query = this.$global.getQuery();
  	console.log('query', query);
  	this.period = query.period;
  	console.log('this.period', this.period);
  	if (this.type == 'todo') {
  		this.ownerId = this.$user.getMe().userId;
  	  console.log('ownerId', this.ownerId);
  		this.toDoId = query.todoId;
  		console.log('toDoId', this.toDoId);
  	}
  	// const [startDate, endDate] = DateTimeFormmat.filterRangeDate([new Date(query.range[0]), new Date(query.range[1])]);
  	// 測試用
  	// const queryData: HfeBuildingHumanHazardQueryInputDto = {
  	// 	endDate: '2022-07-20T02:49:12.410Z',
  	// 	pageNo: this.gridData.pagination.current - 1,
  	// 	pageSize: this.gridData.pagination.pageSize,
  	// 	startDate: '2022-06-20T02:49:12.410Z',
  	// 	level: query.surveyLev,
  	// 	execStatus: query.status,
  	// };
  	const queryData: HfeBuildingHumanHazardQueryInputDto = {
  		area: this.tableType,
  		deptName: query.dept_name,
  		period: query.period,
  		empId: query.id,
  		execStatus: query.status,
  		level: query.surveyLev,
  		name: query.name,
  		toDoId: this.toDoId,
  		ownerId: this.ownerId,
  		pageNo: this.gridData.pagination.current - 1,
  		pageSize: this.gridData.pagination.pageSize,
  	};
  	if (this.tableType === 'ALL') {
  		queryData.area = null;
  	}
  	await this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.humanHazardInformationInquiryUsingPOST(queryData)
  		.then((resp) => {
  			console.log('resp.data => ', resp.data.data);
  			this.gridData.data = resp.data.data.content;
  			this.gridData.pagination.total = Number(resp.data.data.totalElements);
  			this.gridData.data.forEach((item, index) => {
  				this.$set(item, 'rowkey', index + 1);
  				this.$set(item, 'senddisabled', false);
  				this.$set(item, 'teadisabled', false);
  				this.$set(item, 'docdisabled', false);
  				this.$set(item, 'formdisabled', false);
  				this.$set(item, 'downloaddisabled', false);
  			});
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 操作錯誤彈窗
  error() {
  	InfoModal.alertSuccess({
  		title: '錯誤操作',
  		confirm: false,
  		content: '欲發送通知，請選擇項目後點擊「發送」。 欲派件，請選擇項目後點擊「派件」。',
  	});
  }

  // 個案維護按鈕
  push(userId) {
  	const type: any = 'ergonomic';
  	sessionStorage.setItem('caseMaintainType', JSON.stringify({ tableType: type }));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CaseMaintainList',
  		query: {
  			data: { uid: userId, period: this.period },
  			type: 'ergonomic',
  		},
  	});
  }

	// 有勾選
	isCheck = false;

	onSubmit() {
		this.isCheck = false;

		this.gridData.data.forEach((item, index) => {
			const block: HfeBuildingHumanSendNotificationListDto = {
				caseId: item.caseId,
				form: item.formdisabled,
				health: item.teadisabled,
				phyConsult: item.docdisabled,
			};
			if (item.formdisabled || item.teadisabled || item.docdisabled) {
				this.isCheck = true;
			}
			this.data.push(block);
		});
		if (this.isCheck) {
			console.log('data => ', this.data);
			this.openEmailModal(this.data);
		} else {
			this.error();
		}
	}

	onClickRadio(e) {
  	this.tableType = e.target.value;
  	console.log(this.tableType);
  	this.getGridData();
	}

	onPageChange(e) {
  	this.gridData.pagination = e;
  	// this.gridData.pagination.current = e.pagination.current;
  	// this.gridData.pagination.pageSize = e.pagination.pageSize;
  	this.getGridData();
	}

	// 控制派件Modal
	sendModalVisible=false;

  emailModalVisible = false;

  status = '';

	// 派件勾選列
	sendCaseIds = [];

	// 信件發送資料
	mailSend = {
		mailDropList: [],
		sendUser: null,
		sendCaseId: null,
		sendFormId: null,
		sendFormStatus: null,
	}

	openSendModal() {
		this.isCheck = false;
		this.gridData.data.forEach((item) => {
			if (item.senddisabled) {
				this.isCheck = true;
				this.sendCaseIds.push(item.caseId);
			}
		});
		if (this.isCheck) {
			this.sendModalVisible = true;
		} else {
			this.error();
		}
	}

	closeSendModal() {
		this.sendModalVisible = false;
	}

	openEmailModal(data) {
		this.mailSend.mailDropList = [];
		// this.setLoading(true);
		const srcFrom = 'D0104';
		let contentType = 0;

		data.forEach((item) => {
			console.log('item:', item);
			if (item.health == true) {
				contentType = 1;
			}
			if (item.phyConsult == true) {
				contentType = 2;
			}
			if (item.form == true) {
				contentType = 3;
			}
		});

		const mailData: HfeBuildingHumanHazardEmailDropListInputDto = {
			srcFrom,
			contentType,
		};

		this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.humanFactorCaseDropDownListQueryUsingPOST1(mailData)
			.then((resp) => {
				console.log(resp.data.data);
				this.mailSend.mailDropList = resp.data.data;
			});
		this.emailModalVisible = true;
	}

	toSendMailModalResult(contentId) {
		console.log('toSendMailModalResult contentId:', contentId);

		this.data.forEach((item) => {
			console.log('item:', item);
			item.contentId = contentId;
		});

		console.log('toSendMailModalResult data:', this.data);

		this.setLoading(true);
		this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.sendNotificationUsingPOST(this.data)
			.then((resp) => {
				if (resp.data.status === 200) {
					this.$global.changeRouterAndaddParam({
						toRouter: 'QueryDataResult',
						query: {
							data: resp.data.data,
							result: 'success',
						},
					});
				} else {
					this.$global.changeRouterAndaddParam({
						toRouter: 'QueryDataResult',
						query: {
							message: this.$global.getApiErrorMsg(resp.data.apiError),
							result: 'fail',
						},
					});
				}
			})
			.catch((error) => {
				console.log('error status => ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	toSendModalResult(uid) {
		this.setLoading(true);
		const sendData: HfeBuildingHumanDispatchListDto = {
			caseId: this.sendCaseIds,
    		uid,
		};
		console.log('sendData => ', sendData);
		this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.buildingHumanDispatchUsingPOST(sendData)
			.then((resp) => {
				if (resp.data.status === 200) {
					this.$global.changeRouterAndaddParam({
						toRouter: 'QueryDataSendModalResult',
						query: {
							result: 'success',
						},
					});
				} else {
					this.$global.changeRouterAndaddParam({
						toRouter: 'QueryDataSendModalResult',
						query: {
							message: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
							result: 'fail',
						},
					});
				}
				console.log('resp', resp.data.data);
			})
			.catch((error) => {
				console.log('error status => ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	async created() {
		this.type = this.$router.currentRoute.params.type;
		console.log('type:', this.type);
		await this.getGridData();
		this.checkDispatch();
	}

	// 是否可以派件
	isDispatch = false;

	checkDispatch() {
		const data: CheckDispatchNurseDto = {
			srcFrom: 'ERGONOMIC_HAZARD_PN',
		};
  	this.setLoading(true);
  	// 是否可派件
  	this.$UtilityApi.isDispatchUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
					this.isDispatch = true;
				} else {
					this.isDispatch = false;
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// 下載人因工程檢核表
	downloadEr() {
		this.setLoading(true);
		const data: UidstDto = {
			uidList: [],
		};
		this.gridData.data.forEach((item, index) => {
			if (item.downloaddisabled === true) {
				data.uidList.push(item.userId);
			}
		});
		if (data.uidList.length > 0) {
			this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanFactorCaseDownLoadUsingPOST(data, { responseType: 'blob' })
				.then((resp) => {
					const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
						resp.data as Blob,
						filename,
						resp.headers['content-type'],
  				);
  			} else {
						this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanFactorCaseDownLoadUsingPOST(data)
							.then((resp) => {
								const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
							})
							.catch((error) => {
								console.log(error);
							})
							.finally(() => {
								this.setLoading(false);
							});
					}
				})
				.catch((error) => {
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
		} else {
			this.$infoNotification.error({ content: '請勾選欲下載的項目' });
			this.setLoading(false);
		}
	}

	// 下載查詢人因性危害資料結果API
	downloadSearch() {
		this.setLoading(true);
		const query = this.$global.getQuery();
		const data: HfeBuildingHumanHazardQueryInputDto = {
			// area: this.tableType,
  		deptName: query.dept_name,
  		period: query.period,
  		empId: query.id,
  		execStatus: query.status,
  		level: query.surveyLev,
  		name: query.name,
  		// pageNo: this.gridData.pagination.current - 1,
  		// pageSize: this.gridData.pagination.pageSize,
		};
		this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.humanhazardinfoDownloadExcelUsingPOST(data, { responseType: 'blob' })
			.then((resp) => {
				const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
						resp.data as Blob,
						filename,
						resp.headers['content-type'],
  				);
  			} else {
					this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.humanhazardinfoDownloadExcelUsingPOST(data)
						.then((resp) => {
							const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
						})
						.catch((error) => {
							console.log(error);
						})
						.finally(() => {
							this.setLoading(false);
						});
				}
			})
			.catch((error) => {
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
  .table {
    margin-bottom: 40px;
  }
  .btn__wrap {
    margin-bottom: 40px;
    button {
			margin-right: 5px;
      width: 200px;
      max-width: 100%;
    }
  }
  .mark--red {
    background-color: #FC001A;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    font-size: 20px;
    margin-right: 5px;
  }
  .mark--yellow {
    background-color: #FFD800;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    font-size: 20px;
    margin-right: 5px;
  }
  .mark--green {
    background-color: #24C7A7;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    font-size: 20px;
    margin-right: 5px;
  }
  .header {
		margin-bottom: 20px;
		.header__radio {
			width: 80%;
			display: flex;
			justify-content:flex-end;
			@include rwd-xl {
				width: 65%;
			}
		}
		.header__btn {
			width: 20%;
			display: flex;
			justify-content: flex-end;
			@include rwd-xl{
				width: 35%;
			}
		}
	}
  ::v-deep {
    .ant-table-thead > tr >th {
      background-color: $COLOR-MAIN1;
      color: white;
    }
    .iconblock{
      width: 46px;
      height: 32px;
      background-color: $COLOR-MAIN10;
      border-radius: 16px;
      color: $COLOR-MAIN1;
      .anticon svg {
        font-size: 20px;
      }
    }
    .ant-radio-button-wrapper {
			min-width: 95px;
			text-align: center;
		}
  }
</style>
