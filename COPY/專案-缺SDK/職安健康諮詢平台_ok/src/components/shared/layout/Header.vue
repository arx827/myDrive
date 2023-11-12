<template>
  <div>
    <header class="header">
      <!-- 由於選單太過複雜，且版型差異過大，決定切兩版 @Eason -->
      <!-- pc版選單 -->
      <div
        v-if="$user.getMe()"
        class="pc__header"
      >
        <nav class="header__navBar navbar navbar-expand-sm">
          <div class="container">
            <router-link to="/">
              <a
                class="header__logo"
                href="javascript:void(0)"
              >
                <img
                  class="header__logo-img"
                  src="@/assets/images/image_logoMerge.svg"
                  alt=""
                >
              </a>
            </router-link>
            <div
              v-if="!isLoginPage"
              id="navbarNavDropdown"
              class="collapse navbar-collapse"
            >
              <!-- 主選單 第一層 -->
              <ul
                v-if="menuGroup"
                class="navbar-nav ms-auto align-items-center"
              >
                <!-- 首頁 -->
                <li class="nav-item nav-item__home">
                  <a
                    class="nav-link"
                    :class="{ active: currentMenuGroup == 'index' }"
                    @click="onClickHome"
                  >
                    首頁
                  </a>
                </li>
                <template v-for="item in menuGroup">
                  <!-- 排除 沒有子層 且 沒有 uri -->
                  <li
                    v-if="item.children.length > 0 || item.uri !== null"
                    :key="item.id"
                    class="nav-item"
                  >
                    <a
                      v-if="item.uri !== null"
                      class="nav-link"
                      :href="item.uri"
                    >{{
                      item.title
                    }}</a>
                    <a
                      v-else-if="item.children.some( (i) => i.children.length > 0 || i.route !== null)"
                      class="nav-link"
                      href="javascript:void(0)"
                      :class="{ active: currentMenuGroup == item.id }"
                      @click="onClickMenu(item.id)"
                    >
                      {{ item.title }}
                    </a>
                  </li>
                </template>
                <!-- 固定不變的按鈕群 -->
                <li class="nav-item nav-item-icon position-relative">
                  {{ /* 會員 popover */ }}
                  <a
                    class="nav-link"
                    href="javascript:void(0)"
                    @click="showMemberCard = !showMemberCard"
                  ><span class="menu-icon id-icon" /></a>
                  <div
                    v-show="showMemberCard"
                    class="memberCard"
                  >
                    <div class="memberCard-topBg" />
                    <div class="memberCard-data">
                      <p class="memberCard-name">
                        {{ userInfo.name }}
                      </p>
                      <a-select
                        v-if="currentMenuGroup!=='index'"
                        v-model="authId"
                        :show-arrow="true"
                        class="memberCard-auth"
                        dropdown-class-name="memberCard-auth__option"
                        :dropdown-match-select-width="false"
                      >
                        <a-select-option
                          v-for="(item, index) in authIdOptions"
                          :key="index"
                          :value="item.roleId"
                        >
                          {{ item.roleName }}
                        </a-select-option>
                      </a-select>
                      <p class="memberCard-contDp">
                        {{ userInfo.dptName }}
                      </p>
                      <!-- <p class="memberCard-contUt">
                        {{ userInfo.userUnit }}
                      </p> -->
                    </div>
                    <button
                      class="btn memberCard-btn"
                      @click="onAvatarAction"
                    >
                      登出
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <!-- 展開第二層選單 -->
        <div
          v-if="showSecondMenuBlock"
          class="menulinkblock"
          @mouseover="menuHover"
          @mouseleave="menuleave"
        >
          <div class="d-flex justify-content-center">
            <template v-for="f in menuGroup">
              <div
                v-if="f.children.length > 0"
                :key="f.id"
                class="ml_block"
                :class="{ show: currentMenuGroup == f.id }"
              >
                <template v-for="s in f.children">
                  <div
                    v-if="s.children.length > 0 || s.route !== null"
                    :key="s.id"
                    class="ml_blockGroup"
                    :class="{'ml_blockGroup--active': s.id === currentSecondMenu}"
                  >
                    <p class="ml_block-title">
                      <a
                        v-if="!s.children && s.children.length === 0"
                        class="ml_block-link"
                        @click="onLinkTo(s.id)"
                      >{{ s.title }}</a>
                      <span
                        v-else
                        class="ml_block-link"
                      >{{ s.title }}</span>
                    </p>
                    <transition name="slide">
                      <ul
                        v-if="s.children.length > 0 && showThirdMenuBlock"
                        class="ml_block-lists"
                      >
                        <li
                          v-for="t in s.children"
                          :key="t.id"
                          class="ml_block-list"
                        >
                          <a
                            class="ml_block-link"
                            @click="onLinkTo(t.id)"
                          >{{ t.title }}</a>
                        <!-- <span
                            v-else
                            class="ml_block-link"
                          >{{ t.title }}</span> -->
                        </li>
                      </ul>
                    </transition>
                    <!-- <slide-up-down
                      v-if="menuGroup"
                      class="menulink__slide"
                      :active="showThirdMenuBlock"
                      :duration="300"
                    >

                    </slide-up-down> -->
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 手機、平板版選單 -->
      <nav
        v-if="$user.getMe()"
        class="mobile__header navbar-light"
      >
        <div class="mobile__container">
          <button
            v-if="!isLoginPage"
            class="navbar-toggler"
            type="button"
            @click.prevent="onToggleOffcanvas"
          >
            <span class="navbar-toggler-icon" />
          </button>
          <div class="header__title">
            健康資源系統
          </div>
          <ul
            v-if="!isLoginPage"
            class="mobile__control d-flex"
          >
            <!-- 固定不變的按鈕群 -->
            <li
              v-if="isTodo()"
              class="nav-item nav-item-icon position-relative"
            >
              <a
                class="nav-link"
                href="javascript:void(0)"
                @click="openTodoModal"
              ><span class="menu-icon note-black-icon" /></a>
            </li>
            <li class="nav-item nav-item-icon position-relative">
              {{ /* 會員 popover */ }}
              <a
                class="nav-link"
                href="javascript:void(0)"
                @click="showMemberCard = !showMemberCard"
              ><span class="menu-icon id-icon" /></a>
            </li>
          </ul>
        </div>
        <div
          v-if="!isLoginPage"
          v-show="showMemberCard"
          class="mobile__member__wrap"
          @click.self="closeMemberCard"
        >
          <div
            class="memberCard"
          >
            <div class="memberCard-topBg" />
            <div class="memberCard-data">
              <p class="memberCard-name">
                {{ userInfo.name }}
              </p>
              <a-select
                v-if="currentMenuGroup!=='index'"
                v-model="authId"
                :show-arrow="true"
                class="memberCard-auth"
                dropdown-class-name="memberCard-auth__option"
                :dropdown-match-select-width="false"
              >
                <a-select-option
                  v-for="(item, index) in authIdOptions"
                  :key="index"
                  :value="item.roleId"
                >
                  {{ item.roleName }}
                </a-select-option>
              </a-select>
              <p class="memberCard-contDp">
                {{ userInfo.dptName }}
              </p>
              <!-- <p class="memberCard-contUt">
                {{ userInfo.userUnit }}
              </p> -->
            </div>
            <button
              class="btn memberCard-btn"
              @click.self="onAvatarAction"
            >
              登出
            </button>
          </div>
        </div>
      </nav>
      <!-- 手機、平版 展開選單 -->
      <div
        v-if="!isLoginPage && this.$user.getMe()"
        class="offcanvas offcanvas-start"
        :class="{'show' : showOffCanvas}"
        :style="{ visibility: showOffCanvas ? 'visible' : 'hidden' }"
      >
        <div class="offcanvas-header">
          <router-link to="/">
            <a
              class="header__logo"
              href="javascript:void(0)"
            >
              <img
                class="header__logo-img"
                src="@/assets/images/image_logoMerge.svg"
                alt=""
              >
            </a>
          </router-link>
          <button
            type="button"
            class="btn-close text-reset"
            @click.prevent="() => onToggleOffcanvas(false)"
          />
        </div>
        <div class="offcanvas-body">
          <ul class="offcanvas__menu__ul">
            <li
              class="offcanvas__menu__li level__one"
              @click.stop="onClickHome"
            >
              <button class="menu__btn">
                <span class="menu__btn__title">首頁</span>
              </button>
            </li>
            {{ /*  系統別  */}}
            <li
              v-for="f in menuGroup"
              :key="f.id"
              class="offcanvas__menu__li level__one"
            >
              <button
                class="menu__btn"
                @click.stop="onClickMenu(f.id)"
              >
                <span class="menu__btn__title">{{ f.title }}</span>
                <a-icon
                  v-if="f.children && f.children.length > 0"
                  class="menu__btn__icon"
                  :type="(mobileCurrentMenu == f.id) ? 'up' : 'down'"
                />
              </button>
              <div
                class="offcanvas__menuWrap"
                :class="{'show': (mobileCurrentMenu == f.id) }"
              >
                <ul class="offcanvas__menu__ul">
                  <li
                    v-for="s in f.children"
                    :key="s.id"
                    class="offcanvas__menu__li level__two"
                  >
                    <button
                      class="menu__btn"
                      @click.stop="onClickMobileSecond(s.id)"
                    >
                      <span
                        class="menu__btn__title"
                        :class="{'menu__btn__title--active': currentSecondMenu == s.id}"
                      >{{ s.title }}</span>
                      <a-icon
                        v-if="(f.children && f.children.length > 0)"
                        class="menu__btn__icon"
                        :type="mobileCurrentSecondMenu == s.id ? 'up' : 'down'"
                      />
                    </button>
                    <div
                      class="offcanvas__menuWrap"
                      :class="{'show offcanvas__menuWrap--bgActive': mobileCurrentSecondMenu == s.id}"
                    >
                      <ul class="offcanvas__menu__ul">
                        <li
                          v-for="t in s.children"
                          :key="t.id"
                          class="offcanvas__menu__li level__three"
                          @click.stop="() => { onLinkTo(t.id); onToggleOffcanvas(false);}"
                        >
                          <button class="menu__btn">
                            <span class="menu__btn__title">{{ t.title }}</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- offcanvas 遮罩 -->
      <div
        v-if="showOffCanvas"
        class="modal-backdrop fade"
        :class="{'show' : windowWidthChange}"
        @click.self="() => {onToggleOffcanvas(false)}"
      />
    </header>
    <TodoButton
      v-if="isTodo()"
      @openTodoModal="openTodoModal"
    />
    <ToDoListModal
      :visible="toDoListModalVisible"
      :route="$route"
      @closeToDoListModal="closeToDoListModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { Subject, range } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// import { MenuNode } from '@fubonlife/co-giiss-api-axios-sdk';

import TodoButton from '@compononts/to-do/TodoButton.vue';
import ToDoListModal from '@/components/modal/toDoListModal.vue';
import notification from '@/plugins/notification/infoNotification';
import infoModal from '@/plugins/notification/infoModal';
import store from '@/store';

@Component({
	components: { TodoButton, ToDoListModal },
})
export default class LayoutHeader extends Vue {
  @Action('setLoading') setLoading;

  @Prop({ default: false })
  isLoginPage;

	unsubscribe$ = new Subject<void>();

  authId = null; // 角色代碼:預設員工1

  authIdOptions = null; // 角色清單

	userInfo = null; // 使用者資訊

	// 目前螢幕寬度
	windowWidth = 0;

	xlWidth = 1199.98;

	showOffCanvas = false; // 選單遮罩開關

	// 顯示權限選取下拉
	// get isShowMemberAuth() {
	// 	return this.currentMenuGroup && this.currentMenuGroup != 'index';
	// }

  // 紀錄目前 current menu
  currentMenuGroup = 'index';

  currentSecondMenu = '';

	mobileCurrentMenu = '';

	mobileCurrentSecondMenu = '';

	// 第二層選單 顯示？
	get showSecondMenuBlock() {
  	return this.currentMenuGroup && this.currentMenuGroup != 'index';
	}

  // 第三層選單 顯示？
  showThirdMenuBlock = false;

  // 會員彈窗 顯示？
  showMemberCard = false;

  menuObject = []; // 選單陣列

	fromRoute = null; // 從哪Route來

	nowRoute = null; // 當前Route

	// 處理選單object
	get menuGroup() {
  	// return this.menuObject;
  	return this.menuObject
  		.filter((i) => i.item.menuName !== '首頁') // 排除首頁，後端不用給
  		.map((i) => this.toMenuItem(i));
	}

	// get roleName() {
	// 	let name;
	// 	switch (this.$user.getSelectedRole()) {
	// 	case '1':
	// 		name = '員工';
	// 		break;

	// 	case '2':
	// 		name = '護理師';
	// 		break;

	// 	case '3':
	// 		name = '主管';
	// 		break;

	// 	case '4':
	// 		name = '系統管理員';
	// 		break;

	// 	default:
	// 		break;
	// 	}
	// 	return name;
	// }

	// 判斷是否顯示待辦
	isTodo() {
		const $role = this.$user.getSelectedRole();
		if ($role === '3') {
			if (this.$route.path.split('/')[2] !== 'Other') {
				return false;
			}
		}
  	if (this.$route.path.split('/')[2] === 'Other') {
  		if (this.$route.path.split('/')[3] === 'loginCheckWork' || this.$route.path.split('/')[3] === 'roleMaintain' || this.$route.path.split('/')[3] === 'userMaintain') {
  			return true;
  		}
  		return false;
  	}
		if (this.$route.name === 'OccupationalSafety' || this.$route.name === 'MainPage') {
			return false;
		}
  	return true;
	}

	// 將 menu init格式
	toMenuItem(node, rootTitle?: string) {
  	const { item, children } = node;
  	return {
  		id: item.menuId,
  		title: item.menuName,
  		route: item.route,
  		uri: item.uri,
  		children: children.map((c) => this.toMenuItem(c)),
  	};
	}

	// API: 取得 Menu
	getMenuApi(authID) {
  	if (!authID) return;
  	this.menuObject = [
  		{
  			item: {
  				menuId: 'occupationSafety',
  				isLeaf: false,
  				menuName: '健康資源系統',
  				route: 'OccupationalSafety',
  				uri: null,
  				enabled: true,
  				menuSort: 1,
  				parentId: null,
  			},
  			children: [],
  		},
			// 通訊錄系統Obj
  	];

  	this.$menuApi.getMenuTreeByCurrentUsingPOST(authID)
  	.then((res) => {
  	  if (res.data.status == 200) {
  	    const getData = res.data.data;
  	    this.menuObject[0].children = getData.children;
  	  } else {
  			notification.error({ content: this.$global.getApiErrorMsg(res.data.apiError).join('') });
  	  }
  	});
	}

	// 檢查頁面是否符合角色進入權限
	// checkPageAccess() {
	// 	const seletedRoleID = this.$user.getSelectedRole();
	// 	const role = this.$user.getRoles();
	// 	const nowRole = role.filter((e) => e.roleId === seletedRoleID);
	// 	if (!this.$router.currentRoute.meta.access.includes(nowRole[0].roleName)) {
	// 		notification.error({ content: `角色：${nowRole[0].roleName}，無此頁面權限，導回首頁` });
	// 		this.$router.replace({ name: 'Main' });
	// 	}
	// 	console.log(this.$router.currentRoute.meta.access);
	// }

	// 手機、平板 側邊選單的遮罩 顯示判斷
	get windowWidthChange() {
  	return this.windowWidth <= this.xlWidth && this.showOffCanvas;
	}

	/**
   * Event
   */
	// 點 第一層『首頁』
	onClickHome() {
  	if (this.currentMenuGroup !== 'index') {
  		if (this.showOffCanvas) {
  			this.onToggleOffcanvas(false);
  		}
  		this.$router.push('/');
  	}
  	this.currentMenuGroup = 'index';
	}

	// 點 第一層『系統名稱』
	onClickMenu(id) {
  	console.log(id);
  	const thatData = (this.menuGroup as any).find((item) => item.id == id);
  	const thatRouter = thatData.route;
  	// 欲切換的頁面 不是 當前頁面
  	if (thatRouter != this.$router.currentRoute.name) {
  		// 若系統有設定 route 則切換
  		if (thatRouter) {
  			this.onToggleOffcanvas(false);
  			this.$router.push({ name: thatRouter });
  		}
  	}
  	// 判斷是否有子選單 有才顯示
  	if (thatData && thatData.children.length > 0) {
  		if (this.mobileCurrentMenu == thatData.id) {
  			this.mobileCurrentMenu = null;
  		} else {
  			this.mobileCurrentMenu = thatData.id;
  		}
  	}
	}

	// 滑入 第二層 選單
	menuHover() {
  	this.showThirdMenuBlock = true;
	}

	// 滑出 第二層 選單
	menuleave() {
  	this.showThirdMenuBlock = false;
	}

	// 第二層、第三層 選單 Event
	onLinkTo(routerName) {
  	// 欲切換的頁面 不是 當前頁面
  	if (routerName != this.$router.currentRoute.name) {
  		this.$router.push({ name: routerName });
  	}
	}

	// 滑出 登入者資訊卡片
	// 有bug 權限的下拉選單 不在 會員卡片區塊內，滑到下拉選單 會誤判為 滑出
	mouseleaveMemberCard(e) {
  	const _this = this;
  	// 判斷是否滑出對象為 下拉選單
  	// 跑 loop判斷
  	if (!(e.toElement.classList && (Array.from(e.toElement.classList).includes('ant-select-dropdown-menu')))) {
  		console.log(Array.from(e.toElement.classList));
  		// 不是 下拉選單 表示滑出了登入者資訊卡片
  		_this.showMemberCard = false;
  	}
	}

	// 手機、平板 關閉登入者資訊卡片
	closeMemberCard() {
  	this.showMemberCard = false;
	}

	// 登出
	async onAvatarAction() {
  	await this.$user.signOut(true);
  	this.$router.replace({ path: '/login' });
	}

	// 收合offcanvas
	onToggleOffcanvas(toggle = true) {
  	this.showOffCanvas = toggle;
  	if (toggle) {
  		document.body.style.overflow = 'hidden';
  		document.body.style.paddingRight = '0px';
  	} else {
  		document.body.style.overflow = null;
  		document.body.style.paddingRight = null;
  	}
	}

	// 點選手機、平板側邊選單 第二層
	onClickMobileSecond(id) {
  	const thatParentData = (this.menuGroup as any).find((item) => item.id == this.mobileCurrentMenu);
  	const thatData = thatParentData.children.find((item) => item.id == id);
  	const thatRouter = thatData.route;

  	// 欲切換的頁面 不是 當前頁面
  	if (thatRouter != this.$router.currentRoute.name) {
  		// 若系統有設定 route 則切換
  		if (thatRouter) {
  			this.$router.push({ name: thatRouter });
  		}
  	}
  	// 判斷是否有子選單 有才顯示
  	if (thatData && thatData.children.length > 0) {
  		if (this.mobileCurrentSecondMenu == thatData.id) {
  			this.mobileCurrentSecondMenu = null;
  		} else {
  			this.mobileCurrentSecondMenu = thatData.id;
  		}
  	}
	}

	// todoList 控制項目
	toDoListModalVisible = false;

	openTodoModal() {
  	this.toDoListModalVisible = true;
	}

	closeToDoListModal() {
  	this.toDoListModalVisible = false;
	}

	/**
   * Hook
   */
	created() {
  	// 監聽window size
  	window.addEventListener('resize', () => {
  		this.windowWidth = window.innerWidth;
  	});

		this.$user.loginState$
  		.pipe(takeUntil(this.unsubscribe$))
  		.subscribe((state) => {
				console.log(state);
  			if (state && state.me) {
  				const user = state.me;
					this.userInfo = user;
					this.authIdOptions = state.roles;
					this.authId = state.selectedRole;
  		    // this.renderMenu();
  			}
  		});
	}

	destroyed() {
  	this.unsubscribe$.next();
  	this.unsubscribe$.complete();
	}

	mounted() {
  	this.windowWidth = window.innerWidth;
	}

  /**
   * 監聽
   */
  @Watch('$route', { immediate: true, deep: true })
	watchRouter(newVal, oldVal) {
  	// 切換頁面後，收合 Menu

  	// ============ 判斷 router 打開第二層 ========= //
  	// 判斷網址 改變 currentMenuGroup (自動切換)
  	this.currentMenuGroup = newVal.path.split('/')[1] && newVal.path.split('/')[1];
  	this.currentSecondMenu = newVal.path.split('/')[2] && newVal.path.split('/')[2];
  	this.mobileCurrentMenu = this.currentMenuGroup;
  	this.mobileCurrentSecondMenu = this.currentSecondMenu;
  	this.$emit('emitChangeHeight', this.currentMenuGroup && this.currentMenuGroup != 'index');
		this.fromRoute = oldVal ? oldVal.name : '';
		this.nowRoute = newVal ? newVal.name : '';
		// 關閉 登入者資訊
  	this.showMemberCard = false;
	}

  // 監聽第一層選單
  @Watch('currentMenuGroup', { immediate: true, deep: true })
  watchCurrentMenuGroup(newVal) {
  	// 關閉 登入者資訊
  	this.showMemberCard = false;
  	this.$emit('emitChangeHeight', this.currentMenuGroup && this.currentMenuGroup != 'index');
  	if (newVal === 'occupationSafety') {
  		// 進入健康資源系統, 設定角色
  		this.authId = this.$user.getSelectedRole() || '1';
  	}
  }

  // 監聽角色切換
  @Watch('authId', { immediate: true, deep: true })
  watchAuthId(newVal, oldVal) {
  	this.showMemberCard = false;
  	if (!newVal) return;
  	if (newVal === '2') {
  		// 護理師須先驗證進入權限
  		this.checkCertPass(oldVal);
  		return;
  	}
  	if (newVal !== '2') {
  		this.getNewRoleAndChangeRoute(newVal, oldVal);
  	}
  }

  // API: 1.2.1.	護理師檢核是否可通行
  async checkCertPass(oldVal) {
  	this.setLoading(true);
  	await this.$AdminControlManagerApi.checkCertPassUsingPOST({ isRecord: false })
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (!resp.data.data) {
  					// 尚無登入權限
  					infoModal.alertSuccess({
  						title: '確定要登入系統嗎？',
  						content: '親愛的護理人員您好，欲使用本系統需取得主管覆核同意才可登入，有效登入權限將維持一日。請問您尚需登入本系統嗎？',
  						okText: '我要登入 (系統將發送覆核通知)',
  						cancelText: '不要',
  						confirm: true,
  						okType: 'primary',
  						onCallback: () => {
  							this.setLoading(true);
  							// 申請有效登入權限
  							this.$AdminControlManagerApi.checkCertPassUsingPOST({ isRecord: true })
  								.then((resp) => {
  									notification.success({ content: '已將申請發送主管覆核，請稍後再登入。' });
  									this.authId = this.$user.getSelectedRole(); // 切回上一動角色
  								})
  								.catch((error) => {
  									console.log('error status = ', error);
  								})
  								.finally(() => {
  									this.setLoading(false);
  								});
  						},
  						onCancel: () => {
  							// location.reload();
  							this.authId = this.$user.getSelectedRole();
  						},
  					});
  				} else {
  					this.getNewRoleAndChangeRoute('2', oldVal);
  				}
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  	  })
  	  .catch((error) => {
  	    console.log('error status = ', error.status);
  	  })
  	  .finally(() => {
  			this.setLoading(false);
  	  });
  }

  // 取得當前角色拿取選單並轉跳
  getNewRoleAndChangeRoute(nowRole, prevRole) {
  	this.$user.changeSelectedRole(nowRole); // 變更sessionStorage存的角色
  	store.dispatch('getRoleFromSession'); // 變更Vuex存的角色
  	this.getMenuApi(this.$user.getSelectedRole()); // 拿取當下角色menu
  	// 跳轉頁面
  	if (prevRole !== this.$user.getSelectedRole() && prevRole !== undefined) this.$router.push({ name: !this.fromRoute || this.fromRoute === 'Login' ? 'Main' : 'OccupationalSafety' });
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  width: 100%;
  z-index: 999;
	height: 50px;
	@include rwd-xl {
		height: var(--header-height);
	}
	.header__logo {
		display: block;
		width: 93px;
	}
}
.pc__header {
	display: none;
	@include rwd-xl {
		display: block;
	}
}
.mobile__header {
	display: block;
	@include rwd-xl {
		display: none;
	}
}

// .role__name{
// 	position: absolute;
// 	// z-index: 1;
// 	width: 100%;
// 	padding: 5px 0;
// 	color: $primary;
// 	background: #F5F8FC;
// }

/**
  *  pc版 navbar
  * ----------------------------------
  */
.pc__header {
	.navbar > .container {
		display: flex;
		flex-wrap: inherit;
		align-items: center;
		justify-content: space-between;
	}
	.header__navBar {
		background: #fff;
		box-shadow: 0 -3px 6px 5px rgba(0, 0, 0, 0.2);
		padding-top: 12px;
		padding-bottom: 12px;
		height: 80px;
		.nav-item {
			display: block;
		}

		#navbarNavDropdown {
			.nav-link {
				font-size: 18px;
				line-height: 1.3;
				color: $NARBARMENU-COLOR;
				display: block;
				align-items: center;
				margin: 0 10px;
				padding: 0;
				// font-weight: 600;
				// white-space: nowrap;
				position: relative;
				&::before {
					content: "";
					width: 100%;
					height: 4px;
					border-radius: 5px;
					display: inline-block;
					// background: #fff;
					position: absolute;
					bottom: -10px;
					left: 0;
				}
				&:hover,
				&.active {
					color: $NARBARMENU-ACTIVE-COLOR;
					font-weight: 600;
					&::before {
						background: $COLOR-MAIN1;
					}
				}
			}
			.nav-item__home {
				.nav-link {
					color: $COLOR-BLACK;
				}
			}
		}
	}
	.menulink__slide {
		&[aria-expanded = true] {
			margin-bottom: 30px;
		}
	}
	.menulinkblock {
		background: rgba(255, 255, 255, 0.8);
		width: 100%;
		// border-bottom: 1px solid $NARBARMENU-BOTTOM-BORDER-COLOR;
		box-shadow: 0 -3px 6px 5px rgba(0, 0, 0, 0.2);
		display: none;
		@include rwd-xl {
			display: block;
		}
	}

	.header__logo {
		width: 135px;
	}
	.header__logo-img {
		width: 135px;
	}

	.ml_block {
		display: none;
		max-width: 100%;
		color: $COLOR-BLACK;
		&.show {
			display: flex;
		}
	}
	.ml_blockGroup {
		// padding: 15px 0;
		@include rwd-xl {
			width: 190px;
		}
		&:hover {
			background: $COLOR-MAIN1;
			.ml_block-title {
				.ml_block-link {
					color: $COLOR-WHITE;
					&::before {
						background: $COLOR-WHITE;
					}
				}
			}
			.ml_block-link:not(:hover) {
				color: $COLOR-WHITE;
			}
		}
	}

	.ml_block-link {
		color: $COLOR-BLACK;
		transition: none;
		cursor: pointer;
		display: block;
	}
	.ml_block-title {
		margin-bottom: 0;
		font-size: 18px;
		font-weight: bold;
		.ml_block-link {
			padding: 14px 30px 15px;
			&::before {
				content: "";
				display: inline-block;
				width: 6px;
				height: 6px;
				background: $COLOR-MAIN1;
				vertical-align: middle;
				margin-right: 10px;
			}
		}
	}
	.ml_block-lists {
		margin-bottom: 0;
		list-style: none;
		padding-left: 0;
	}
	.ml_block-list {
		.ml_block-link {
			padding: 10px 30px;
			&:hover {
				background: $COLOR-WHITE;
				color: $COLOR-MAIN1;
				font-weight: 600;
			}
		}
		&:last-child {
			margin-bottom: 20px;
		}
	}

	.ml_blockGroup--active {
		background: $NARBARMENU-BOTTOM-ACTIVE-BG;
		.ml_block-link {
			color: $COLOR-WHITE;
			&::before {
				background: $COLOR-WHITE;
			}
		}
	}
}

/**
  *  手機、平板 navbar
  * ----------------------------------
  */
.mobile__header {
	background: #fff;
	box-shadow: 0 -3px 6px 5px rgba(0, 0, 0, 0.2);
	.mobile__container {
		margin: 0 20px;
		display: flex;
    align-items: center;
		justify-content: center;
    height: 50px;
		position: relative;
	}
	.navbar-toggler {
		position: absolute;
		left: 0;
		border: none;
    padding: 0;
		cursor: pointer;
		&:focus {
			box-shadow: none;
		}
	}
	.header__title {
		font-size: 20px;
	}
	.mobile__control {
		position: absolute;
		right: 0;
		margin-right: -10px;
		.nav-link {
			padding: 6px;
		}
	}
	.mobile__member__wrap {
		position: absolute;
		top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100vh;
		background: rgba(0, 0, 0, .5);
	}
	.memberCard {
		top: 45px;
		right: 20px;
		transform: none;
		min-width: 232px;
	}
}

/**
  *  手機、平板 sider 彈出窗
  * ----------------------------------
  */
.offcanvas {
	z-index: 1050;
	@include rwd-xl {
		display: none;
	}
	.offcanvas-header {
		padding: 15px 15px 10px;
	}
	.header__logo {
		margin-left: 15px;
	}
	.offcanvas-body {
		padding: 5px 0 30px;
	}

	.offcanvas__menu__li {
		> .menu__btn {
			border: 0;
			background: none;
			display: flex;
			align-items: center;
			width: 100%;
			padding: 13px 16px 13px 30px;
			cursor: pointer;
			.menu__btn__title {
				font-size: 16px;
				font-weight: 600;
				line-height: 1;
			}
		}
		.menu__btn__icon {
			margin-left: auto;
		}
	}

	.level__one {
		&.offcanvas__menu__li {
			border-bottom: 1px solid $COLOR-MAIN9;
		}
		> .offcanvas__menuWrap {
			border-top: 1px solid $COLOR-MAIN9;
		}
	}
	.level__two {
		> .menu__btn {
			padding: 13px 16px 13px 30px;
			&::before {
				content: "";
				display: block;
				width: 6px;
				height: 6px;
				background: #23C4A8;
				margin-right: 10px;
			}
			.menu__btn__title {
				font-weight: 400;
				&.menu__btn__title--active {
					color: $COLOR-MAIN1;
					font-weight: 600;
				}
			}
		}
	}
	.level__three {
		> .menu__btn {
			padding: 10px 16px 10px 46px;
			.menu__btn__title {
				font-weight: 400;
			}
		}
	}
	.offcanvas__menuWrap {
		&:not(.show) {
			display: none;
		}
		&.offcanvas__menuWrap--bgActive {
			background: $COLOR-MAIN1;
			color: $COLOR-WHITE;
			.offcanvas__menu__ul {
				padding-top: 10px;
				padding-bottom: 10px;
			}
		}
	}
	+ .modal-backdrop {
		display: none;
		z-index: 1040;
		&.show {
			display: block;
		}
	}
}

/**
	*  會員彈窗
	* ----------------------------------
	*/
.memberCard {
	position: absolute;
	top: 40px;
	right: 50%;
	transform: translateX(50%);
	min-width: 210px;
	background: $COLOR-WHITE;
	border-radius: 3px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	overflow: hidden;
	padding-bottom: 18px;
}
.memberCard-topBg {
	height: 26px;
	background: $COLOR-MAIN1;
	margin-bottom: 15px;
}
.memberCard-data {
	text-align: center;
	margin-bottom: 15px;
}
.memberCard-name {
	font-size: 20px;
	font-weight: 600;
	margin: 0 15px 10px;
	color: $COLOR-BLACK;
}
.memberCard-auth {
	width: 100%;
	color: $COLOR-MAIN1;
	font-size: 16px;
	margin-bottom: 10px;
	::v-deep {
		.ant-select-selection {
			border: none;
			border-radius: 0;
			background: $NARBARMENU-MEMBER-AUTH_BG;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.ant-select-arrow {
			color: $COLOR-MAIN1;
			right: 20px;
			.ant-select-arrow-icon {
				svg {
					font-size: 12px;
				}
			}
		}
	}
}
.ant-select-open,
.ant-select-focused {
	::v-deep {
		.ant-select-selection {
			box-shadow: none;
			&:active,
			&:focus {
				box-shadow: none;
			}
		}
	}
}
.memberCard-contDp,
.memberCard-contUt {
	font-size: 16px;
	margin: 0 15px;
	color: $COLOR-BLACK;
	word-break: break-word;
}
.memberCard-contDp {
	margin-bottom: 10px;
}
.memberCard-btn {
	display: block;
	font-size: 16px;
	color: $COLOR-GRAY1;
	background: $COLOR-WHITE;
	margin: 0 auto;
	border: 1px solid $COLOR-GRAY2;
	padding: 5px 14px;
}

.slide-enter-active {
   -moz-transition-duration: 0.3s;
   -webkit-transition-duration: 0.3s;
   -o-transition-duration: 0.3s;
   transition-duration: 0.3s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-leave-active {
   -moz-transition-duration: 0.3s;
   -webkit-transition-duration: 0.3s;
   -o-transition-duration: 0.3s;
   transition-duration: 0.3s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to, .slide-leave {
   max-height: 300px;
   overflow: hidden;
}

.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}

</style>

<style lang="scss">
	// 全域
	// 針對 antd 產生的下拉框 調整 (因為生成在app層，不在component裡，故寫成全域，className為自定義)
  .memberCard-auth__option {
    text-align: center;
  }
</style>
