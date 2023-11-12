<template>
  <header
    class="header"
  >
    <div
      v-if="$user.hasValidToken()"
      class="header-container"
    >
      <div
        class="header__logo"
        :class="{'header__logo--signout': !$user.hasValidToken()}"
      >
        <img
          src="@/assets/images/header/icon-fubon-logo.svg"
          alt="fubon logo"
          class="header__logo__img"
        >
        <div class="header__logo__text">
          內部稽核管理系統
        </div>
      </div>
      <div
        v-if="currentMenu"
        class="header__menu"
      >
        <ul class="header__menu__list">
          <li
            v-for="item in currentMenu.hierarchy"
            :key="item.router.id"
          >
            <template v-if="item.children.length == 0">
              <router-link
                :to="{name: item.router.route}"
              >
                <img
                  v-if="item.img"
                  class="header__menu__icon"
                  :src="item.img"
                  alt=""
                >
                <span class="align-middle header__meun__dropdown__text">
                  {{ item.router.title }}
                </span>
              </router-link>
            </template>
            <template v-else>
              <a-dropdown
                overlay-class-name="header__meun__dropdown"
              >
                <a
                  class="ant-dropdown-link"
                  @click="e => e.preventDefault()"
                >
                  <img
                    v-if="item.img"
                    class="header__menu__icon"
                    :src="item.img"
                    alt=""
                  >
                  <span class="align-middle header__meun__dropdown__text">
                    {{ item.router.title }}
                  </span>
                </a>
                <a-menu
                  slot="overlay"
                >
                  <a-menu-item
                    v-for="child in item.children"
                    :key="child.id"
                  >
                    <router-link :to="{name: child.route}">
                      {{ child.title }}
                    </router-link>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </li>
        </ul>
      </div>
      <div class="header__info">
        <div
          class="header__info__item"
          @click="handleOpenModal"
        >
          <div class="btn__icon--bell" />
        </div>
        <div class="header__info__line" />
        <div class="header__info__item">
          <router-link to="/index">
            <div class="btn__icon--house" />
          </router-link>
        </div>
        <div class="header__info__line" />
        <div class="header__info__item header__info__dropdown">
          <a-dropdown
            overlay-class-name="header__info__dropdown__meun"
          >
            <a
              class="ant-dropdown-link"
              @click="e => e.preventDefault()"
            >
              <img
                src="@/assets/images/header/icon-home-people.svg"
                alt=""
              >
              {{ roleName }} <a-icon type="down" />
            </a>
            <a-menu
              slot="overlay"
            >
              <a-menu-item
                v-for="role in rolesList"
                :key="role.roleId"
                class="d-flex"
                @click="changeRole(role)"
              >
                <span
                  class="dot"
                  :class="{'dot--hidden':!role.todoExisted}"
                />
                <a>{{ role.name }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <div class="header__info__line" />
        <div class="header__info__item header__info__dropdown">
          <a-dropdown>
            <a
              class="ant-dropdown-link"
              @click="e => e.preventDefault()"
            >
              {{ userName }} <a-icon type="down" />
            </a>
            <template slot="overlay">
              <div class="header__logout">
                <div
                  v-if="userDepartment"
                  class="d-flex"
                >
                  <img
                    class="header__logout__img"
                    src="@/assets/images/login/icon-acount-number.svg"
                    alt=""
                  >
                  <div class="header__logout__text">
                    {{ userDepartment }}
                  </div>
                </div>
                <button
                  class="btn--logout d-inline-block"
                  @click="signOut"
                >
                  登出
                </button>
              </div>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div
      v-else
      class="header-container"
    >
      <div
        class="header__logo header__logo--logout"
      >
        <img
          src="@/assets/images/header/icon-fubon-logo.svg"
          alt="fubon logo"
          class="header__logo__img header__logo__img--signout"
        >
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { RoleDto, AccountDto } from '@fubonlife/iams-api-axios-sdk';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';
import { Getter, Action, namespace } from 'vuex-class';

export type Role = RoleDto & {
  type: string;
  roleId: string;
  roleUnitId: string;
}
const modalModule = namespace('modalControl');

@Component({ components: { } })
export default class Header extends Vue {
  @Action('setLoading') setLoading;

  @modalModule.Action('setModalState') setModalState;

  unsubscribe$ = new Subject<void>();

  // 角色ID
  roleID: string = null;

  // 登入者全部角色清單
  rolesList: Role[] = null;

  // 當前角色資料(名稱、單位)
  currentRoleData = null;

  userName: string = null;

  userDepartment: string = null;

  userMe: AccountDto = null;

  menuList = null;

  currentMenu = null;

  get roleName() {
  	return this.rolesList && this.rolesList.length > 0 && this.rolesList.find((element) => element.roleId === this.roleID)?.name;
  }

  created() {
  	this.$user.loginState$
  		.pipe(takeUntil(this.unsubscribe$))
  		.subscribe((state) => {
  			if (state && state.me) {
  				this.userMe = state.me;
  				this.setRole();
  			}
  		});
  }

  getUserDepartmentName(department): string {
  	if (!department) return '';
  	if (department.name.indexOf('部') === -1 && department.name.indexOf('室') === -1) {
  		return department.name;
  	}
  	if (department.name.indexOf('部') !== -1) return department?.name.substring(0, department.name.indexOf('部') + 1);
  	if (department.name.indexOf('室') !== -1) return department?.name.substring(0, department.name.indexOf('室') + 1);
  }

  getMenu(rawMenu: Role[]) {
  	return rawMenu.map((e) => ({
  		roleId: e.roleId,
  		hierarchy: Object.entries(e.hierarchy).map((e) => {
  			const router = e[1].find((e) => e.id === e.parentMenuId);
  			return {
  				router,
  				img: this.getMenuIcon(router.id),
  				children: e[1].filter((e) => e.id !== e.parentMenuId),
  		  };
  		}),
  	}));
  }

  getMenuIcon(routerId: string) {
  	if (routerId === '000') return require('@/assets/images/header/icon-home-collect.svg');
  	if (routerId === '001') return require('@/assets/images/header/icon-home-process.svg');
  	if (routerId === '009') return require('@/assets/images/header/icon-home-stack.svg');
  	return null;
  }

  getRoleList(roles: RoleDto[]) {
  	let rolesList = [];
  	rolesList = roles.reduce((prvValue, curValue) => {
  		if (curValue.roleUnits.length > 0) {
  			const roles = [];
  			for (let i = 0; i < curValue.roleUnits.length; i++) {
  				roles.push({
  					...curValue,
  					type: 'roleUnitId',
  					roleUnits: [curValue.roleUnits[i]], // 切換角色API需要：有組別的角色則roleUnits、roleId 都為 roleUnits[i].id
  					roleId: curValue.roleUnits[i].id,
  					roleUnitId: curValue.roleUnits[i].id,
  					name: curValue.roleUnits[i].auditorTeamName, // 有組別角色的名字，取roleUnits裡的.auditorTeamName
  					todoExisted: curValue.roleUnits[i].todoExistedInTeam,
  				});
  			}
  			return prvValue.concat(roles);
  		}
  		return [...prvValue, {
  			...curValue,
  			type: 'roleId',
  			roleId: curValue.id, // 切換角色API需要：無組別的角色則roleUnits為null、roleId為 id
  			roleUnitId: null,
  		}];
  	}, []);
  	return rolesList;
  }

  reloadRole() {
  	this.getUserMe();
  }

  changeRole(role) {
  	this.setLoading(true);
  	const requset = role.roleUnitId ? { roleUnitId: role.roleUnitId } : { roleId: role.roleId };
  	this.$accountApi.switchRoleUnitUsingPOST(requset)
  		.then((resp) => {
  			this.getUserMe();
  			if (this.$route.name === 'Index') {
  				this.$router.replace('/refresh');
  			} else {
  				this.$router.push({ name: 'Index' });
  			}
  		})
  		.catch((resp) => {
  			console.log(resp);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '切換角色失敗',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  setRole() {
  	this.userName = this.userMe.employee?.name;
  	this.rolesList = this.getRoleList(this.userMe.roles);
  	this.roleID = this.userMe.defaultRoleUnitId ? this.userMe.defaultRoleUnitId : this.userMe.defaultRoleId;
  	this.currentRoleData = this.rolesList.find((element) => element.roleId === this.roleID);
  	this.userDepartment = this.getUserDepartmentName(this.userMe.employee.department);
  	this.menuList = this.getMenu(this.rolesList);
  	this.currentMenu = this.menuList.find((e) => e.roleId === this.roleID);
  	sessionStorage.setItem('currentRoleData', JSON.stringify(this.currentRoleData));
  }

  // API:
  getUserMe() {
  	const accessToken = JSON.parse(sessionStorage.getItem('login_state')).accessToken;
  	this.$user.signIn(accessToken);
  }

  signOut() {
  	sessionStorage.removeItem('currentRole');
  	this.$user.signOut();
  	this.$router.replace({ path: '/login' });
  	this.$emit('signOut');
  }

  handleOpenModal() {
  	this.$emit('open-modal');
  }

  destroyed() {
  	this.unsubscribe$.next();
  	this.unsubscribe$.complete();
  }
}
</script>

<style lang="scss" scoped>
  .header{
    position: fixed;
    top: 0;
    width: 100%;
    background-color: $COLOR-MAIN1;
    z-index: 1000;
  }
  .header-container{
    padding: 0px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header__logo{
    display: flex;
    margin: 14px 0px;
     @include rwd-xll {
      flex-grow: 1;
    }
  }
  .header__logo--logout{
   margin-left: 217px;
   padding: 2px 0px;
  }
  .header__logo__img{
    width: 106px;
    margin-left: 26px;
    @include rwd-xll {
      // width: 175px;
      margin-left: 12%;
    }
  }
  .header__logo__img--signout{
    margin-left: 12%;
  }
  .header__logo__text{
    font-size: 14px;
    font-weight: bold;
    color: $FONT-LIGHT;
    line-height: 1em;
    align-self: flex-end;
    margin-left: 12px;
    // @include rwd-xll {
    //   font-size: 22px;
    // }
  }
  .header__menu{
    align-self: stretch;
    @include rwd-xll {
      flex-grow: 1;
    }

    .header__menu__list{
      height: 100%;
      margin: 0;
      display: flex;
      list-style: none;
      li {
        font-size: 14px;
        align-self: center;
        height: 100%;
        display: flex;
        a {
          padding: 14px 25px;
          height: 100%;
          color: $FONT-LIGHT;
          align-self: center;
          font-weight: bold;
          transition: all .2s ease-in-out;
            &:hover {
            background-color: $COLOR-MAIN12;
          }
        }
      }

    }
    .router-link-exact-active .router-link-active{
      li {
        &:hover{
        color: $FONT-DARK;
        background-color: $COLOR-MAIN12;
        }
      }
    }
    .header__menu__icon{
      width: 26px;
      // @include rwd-xll{
      //   width: 38px;
      // }
    }

  }
  .header__info{
    display: flex;
    flex-direction: row;
    align-items: center;
    .header__info__item{
      img{
        width: 24px;
        // @include rwd-xll{
        //   width: 28px;
        // }
      }
    }
    .header__info__line{
      margin: 0px 10px;
      height: 20px;
      width: 1px;
      background-color: $BG-LIGHT;
    }
   .header__info__dropdown{
     ::v-deep{
       .ant-dropdown-link{
          font-size: 14px;
          color: $FONT-LIGHT;
          font-weight: bold;
          // @include rwd-xll {
          //   font-size: 22px;
          // }
       }
       .ant-dropdown-menu{
         width: auto;
       }
     }
   }

  }
  .header__logout{
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    background-color: $BG-LIGHT;
    padding: 16px 28px 9px 28px;
    border-radius: 4px;
    outline: none;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    .header__logout__img{
      width: 25px;
      margin-bottom: 13px;
    }
    .header__logout__text{
      font-size: 14px;
      padding-top: 3px;
    }
  }
  .dot{
    width: 10px;
    height: 10px;
    display: inline;
    background-color: #E03E57;
    border-radius: 50%;
    margin-right: 10px;
    align-self: center;
  }
  .dot--hidden{
    visibility: hidden;
  }
  ::v-deep{
    .ant-dropdown-menu-item{
      a:hover{
        color: #000000;
      }
    }
  }
</style>
