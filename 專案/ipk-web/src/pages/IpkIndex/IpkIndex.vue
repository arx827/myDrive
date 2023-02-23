<template>
  <div>
    <div class="event__img event--shadow">
      <a-row class="d-flex align-items-center img__title__block">
        <a-col offset="3" :span="8">
          <div class="img__title__small">
            歡迎來到
          </div>
          <div class="img__title__large">
            投資部位系統
          </div>
        </a-col>
      </a-row>
    </div>
    <a-row :gutter="[48,8]">
      <a-col :span="19">
        <div class="event__title">
          公告事項
        </div>
        <IpkVxeTable
          :ipkGrid="ipkGrid"
          @openCheckInfoModal="openCheckInfoModal($event)"
          @handlePageChange="handlePageChange($event)"
        />
      </a-col>
      <a-col :span="5">
        <div class="event__title">
          我的通知
        </div>
        <a-row type="flex" align="middle" class="notice__block">
          <a-col :span="4" class="text-center">
            <img
              src="@/assets/images/icon_bell_yellow.svg"
              alt="logo"
            >
          </a-col>
          <a-col :span="20">
            <a-row>
              <a-col class="notice__count">
                訊息通知
                <span class="notice__count--link link" @click="openMyNoticePage">
                  {{ noticeTotalCount }}筆
                </span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <div class="event__title d-flex">
          <div class="event__wrap">
            常用功能
          </div>
          <div class="notice__icon__block event--shadow">
            <a-icon type="plus" class="notice__icon" @click="openSetFunctionModal" />
          </div>
        </div>
        <!--設定常用功能modal -->
        <a-modal
          v-model="functionModalVisible"
          width="600px"
          title="設定常用功能"
          :destroyOnClose="true"
        >
          <a-row :gutter="16" justify="space-between">
            <a-row>
              <a-tooltip placement="top" title="新增資料夾">
                <button class="btn__wrap btn__main btn__main--lightBlue" @click="addFile()">
                  <p class="icon_padding">
                    <img src="~@images/add-folder.png" class="icon_space">
                    新增
                  </p>
                </button>
              </a-tooltip>
            </a-row>
            <a-row>
              <a-tree
                class="boxBorder"
                :defaultExpandAll="true"
                :selectedKeys="selectedKeys"
                draggable
                show-icon
                show-line
                :treeData="customizeFileList"
                @drop="onDrop"
              >
                <a-icon slot="switcherIcon" type="down" />
                <template slot="custom" slot-scope="item">
                  <a-row justify="space-between" class="tree__item">
                    <a-col :span="16">
                      {{ item.title }}
                    </a-col>
                    <!--資料夾操作按鈕列 -->
                    <a-col v-if="item.slots.icon === 'folder-open'" :span="8">
                      <a-tooltip placement="top" title="新增功能">
                        <button class="action__btn" @click="openAddFunctionModal(item)">
                          <a-icon type="plus-circle" />
                        </button>
                      </a-tooltip>
                      <a-tooltip placement="top" title="移除資料夾">
                        <button class="action__btn" @click="deleteFile(item.key, item)">
                          <a-icon type="delete" />
                        </button>
                      </a-tooltip>
                      <a-tooltip placement="top" title="編輯名稱">
                        <button class="action__btn" @click="showEditModal(item.title, item.key)">
                          <a-icon type="edit" />
                        </button>
                      </a-tooltip>
                      <a-tooltip placement="top" title="複製資料夾">
                        <button class="action__btn" @click="copyFile(item, item.title)">
                          <a-icon type="copy" />
                        </button>
                      </a-tooltip>
                    </a-col>
                    <!--功能操作按鈕列 -->
                    <a-col v-else :span="8">
                      <a-tooltip placement="top" title="移除功能">
                        <button class="action__btn btn__space" @click="deleteFunction(item)">
                          <a-icon type="delete" />
                        </button>
                      </a-tooltip>
                      <a-tooltip placement="top" title="複製功能">
                        <button class="action__btn" @click="copyFunction(item)">
                          <a-icon type="copy" />
                        </button>
                      </a-tooltip>
                    </a-col>
                  </a-row>
                </template>
              </a-tree>
            </a-row>
          </a-row>
          <template slot="footer">
            <button key="close" class="btn__main btn__main--lightBlue" @click="closeSetFunctionModal">
              <a-icon type="close" class="icon_margin" />
              關閉
            </button>
            <button key="save" class="btn__main btn__main--primary" @click="submitSave()">
              <a-icon type="save" class="icon_margin" />
              儲存
            </button>
          </template>
        </a-modal>
        <!--修改資料夾名稱modal -->
        <a-modal
          v-model="editNameModalVisible"
          title="修改"
          :destroyOnClose="true"
          @ok="submitEditName"
        >
          <p>請輸入資料夾名稱</p>
          <a-input v-model="fileName" placeholder="請輸入資料夾名稱" />
        </a-modal>
        <!--新增功能modal -->
        <a-modal
          v-model="addFunctionModalVisible"
          width="350px"
          title="新增功能"
          :destroyOnClose="true"
          @ok="submitAddFunc"
          @cancel="closeAddFunctionModal"
        >
          <p>請勾選要加入的功能，按確定即可新增</p>
          <a-tree
            v-model="checkedKeys"
            :autoExpandParent="true"
            :defaultExpandAll="true"
            :selectedKeys="selectedKeys"
            checkable
            :multiple="true"
            :treeData="allFileList"
            @check="onCheck"
          />
        </a-modal>
        <!--資料夾管理區塊 -->
        <div class="notice__block function__box">
          <a-tree
            :treeData="finalFileList"
            show-icon
            show-line
          >
            <a-icon slot="switcherIcon" type="down" />
            <!-- <a-icon slot="folder-open" type="folder-open" />
            <a-icon slot="file" type="file" /> -->
            <template slot="custom" slot-scope="item">
              {{ item.title }}
            </template>
          </a-tree>
        </div>
      </a-col>
    </a-row>

    <AnnouncementModal
      :modal-announcement-show="showCheckInfoModal"
      :detail="detail"
      @closeAnnouncementModal="closeCheckInfoModal"
    />
  </div>
</template>
<script src="./IpkIndex.ts" lang="ts">
</script>
<style lang="scss" scoped>
.event__img {
  margin-bottom: 10px;
  margin-top: 10px;
  height: 200px;
  background-position: inherit;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("~@images/image_homebg.svg");
  border-radius: 8px;
}
.event__title {
  color: $COLOR-MAIN2;
  font-size: 21px;
  font-weight: $TEXT-BOLD;
  margin: 10px;
}
.icon_padding {
  padding-top: 3px;
}
.icon_space {
  margin-bottom: 5px;
  height: 19px;
  width: 19px;
}
.img__title__block {
  height: 200px;
}
.img__title__small {
  color: #034B66;
  font-size: 22px;
  font-weight: $TEXT-BOLD;
  text-shadow: 0px 2px 6px #DDDDDD29;
}
.img__title__large {
  color: $COLOR-MAIN2;
  font-size: 36px;
  font-weight: $TEXT-BOLD;
  margin-top: 10px;
}
.notice__block {
  color: $COLOR-GRAY17;
  box-shadow: 0px 2px 6px #00000029;
  border-radius: 4px;
  padding: 11px;
}
.function__box {
  height: 310px;
  overflow: scroll;
}
.action__btn {
  white-space: nowrap;
  border: 1px solid transparent;
  font-size: 14px;
  background-color: transparent;
  cursor: pointer;
  float: right;
}
.notice__icon__block {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.notice__icon {
 margin-left: 5px;
 cursor: pointer;
}
.notice__count {
  margin-left: 11px;
  display: flex;
}
.notice__count--link {
  margin-left: auto;
  text-align: right;
  cursor: pointer;
}
.event__wrap {
  flex: 1;
}
.tagStyle {
  color: $COLOR-WHITE;
  border: none;
}
.announcement__title {
  color: $COLOR-MAIN2;
  cursor: pointer;
}
.link {
  color: $COLOR-MAIN2;
  text-decoration: underline;
}
.boxBorder {
  border: 1px solid #e8e8e8;
  min-height: 500px;
  max-height: 500px;
  overflow: scroll;
  padding-top: 20px;
  padding-left: 20px;
}
.btn__wrap {
  float:right;
  margin-bottom: 2%;
}
.tree__item {
  display: flex;
  align-items: center;
}
.fileNameInput {
  color: #1890ff;
  width:200px
}
::v-deep{
  .ant-tree li span[draggable], .ant-tree li span[draggable='true'] {
    line-height: 20px;
  }
  .ant-tree li .ant-tree-node-content-wrapper {
    width: 90%;
    height: 30px;
    line-height: 30px;
  }
}
.tagStyle {
  color: $COLOR-WHITE;
  border: none;
  vertical-align: top;
  font-size: 14px;
}
</style>
