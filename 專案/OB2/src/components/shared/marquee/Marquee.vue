<template>
  <div style="height: 60px; background: #bbdde2">
    <a-row>
      <a-col :span="23">
        <div class="marquee">
          <a-row>
            <a-col :span="12">
              <a-row>
                <a-col :span="1">
                  <div class="emergency-icon" />
                </a-col>
                <a-col class="first-marquee" :span="23">
                  <vue-roll-up
                    :roll-list="rollFirstList"
                    :width="'100%'"
                    :height="25"
                    :color="'black'"
                    :speed="1000"
                  ></vue-roll-up>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-row>
                <a-col :span="1">
                  <div class="common-icon" />
                </a-col>
                <a-col :span="23" class="second-marquee">
                  <vue-roll-up
                    :roll-list="rollSecondList"
                    :width="'100%'"
                    :height="25"
                    :color="'black'"
                    :speed="1000"
                  ></vue-roll-up>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="1">
        <a-row type="flex" align="middle">
          <a-col>
            <a-popover
              :title="'訊息(' + marqueeList.length + ')'"
              trigger="click"
              :visible="clicked"
              @visibleChange="handleClickChange"
              placement="bottomLeft"
              :arrowPointAtCenter="true"
            >
              <div slot="content">
                <a-row v-for="item in marqueeList" :key="item.id" :gutter="16">
                  <a-col :span="1">
                    <div
                      :class="[
                        item.isEmergency ? 'emergency-icon' : 'common-icon',
                      ]"
                    />
                  </a-col>
                  <a-col class="first-marquee" :span="23">
                    <div>
                      <p>{{ item.message }}</p>
                    </div>
                  </a-col>
                  <!-- <div> -->
                  <a-divider />
                  <!-- </div> -->
                </a-row>
                <a-row type="flex" align="middle" justify="center">
                  <a-col>
                    <a-button type="primary" @click="hide"> 關閉</a-button>
                  </a-col>
                </a-row>
              </div>
              <div class="marquee-badge">
                <a-badge :count="marqueeList.length">
                  <a-icon
                    type="bell"
                    theme="filled"
                    :style="{ fontSize: '17px' }"
                  ></a-icon>
                </a-badge>
              </div> </a-popover
          ></a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./Marquee.ts" lang="ts"></script>