<template>
    <a-layout-header :style="{ background: '#BBDDE240', padding: 0 }">
        <a-page-header
            style="border: 1px solid rgb(235, 237, 240); border-bottom:4px rgb(235, 237, 240) solid; padding:0;"
            :title="titleText"
            :subTitle="subTitleText"
        >
            <template>
                <a-menu v-if="childrenData" v-model="current" mode="horizontal">
                <a-menu-item v-for="child of childrenData" :key="child.key">
                    <a @click="gotoChildPage(child.route)">{{ child.title }}</a>
                </a-menu-item>
                </a-menu>
            </template>
            <!-- <template slot="extra">
                <a-dropdown>
                    <a-avatar
                    size="large"
                    :style="{ 'background-color': '#00a2ae' }"
                    >{{ avatarText }}</a-avatar
                    >
                    <a-menu slot="overlay">
                    <a-menu-item v-for="action of avatarActions" :key="action.name">
                        <a @click="handleAvatarAction(action)">{{ action.title }}</a>
                    </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </template> -->
        </a-page-header>
    </a-layout-header>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblMenuItem } from "../side-menu/model";

@Component({
    components: {  }
})
export default class FblLayoutHeader extends Vue {
    @Prop()
    public childrenData: FblMenuItem[];
    @Prop()
    public title: string;
    @Prop()
    public subtitle: string;
    @Prop()
    public currentKey: string;

    public current: string[] = [];

    get titleText(): string {
        return (this.childrenData != null && this.childrenData.length > 0)? "":this.title;
    }

    get subTitleText(): string {
        return (this.childrenData != null && this.childrenData.length > 0)? "":this.subtitle;
    }

    @Watch("currentKey")
    create(){
        this.current = [this.currentKey];
    }

}
</script>