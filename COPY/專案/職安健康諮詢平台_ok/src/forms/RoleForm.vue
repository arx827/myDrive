<!--<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"

      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item label="功能選單">
        <a-tree
          ref="menuTree"
          checkable
          :treeData="menuNodes"
          v-model="checkedKeys"
        >
        </a-tree>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-space>
          <a-button type="primary" @click="submit"> 送出 </a-button>
          <a-button type="default" @click="cancel"> 取消 </a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Subject } from "rxjs";
import {
  MenuNode,
  ProductDto,
  ProductDtoStatusEnum,
  RoleDto,
  RoleUpdates,
} from "@fubonlife/occupationalSafety-api-axios-sdk";
import { takeUntil } from "rxjs/operators";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { TreeNode } from "ant-design-vue/types/tree-node";
import { Tree } from "ant-design-vue";

interface FormModel {
  productId?: string;
  name?: string;
  quantity?: number;
}

interface TreeNodeOptions<T> {
  key:string,
      title: string,
      isLeaf: boolean,
      children: TreeNodeOptions<T>[],
      expanded: boolean,
      menuNode: T
}

@Component
export default class RoleForm extends Vue {
  @Prop()
  public initData: RoleDto;

  @Prop()
  public loading: boolean;

  checkedKeys: string[] = [];
  menuNodes : TreeNodeOptions<MenuNode>[] = [];

  get isEditing(): boolean {
    return !!this.initData && !!this.initData.id;
  }

  created(): void {
    this.reset();
  }

  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }
  reset() {
    this.$menuApi
      .getMenuTreeUsingGET()
      .then((resp) => {
        const root = resp.data;
        this.menuNodes = root.children.map((n) => this.toTreeNodeOptions(n));
        this.checkedKeys = this.initData.menus.map((m) => m.id);
      })
      .catch(console.error)
      .finally(() => {

      });
  }

  public submit() {
    const checkedKeys = [...this.checkedKeys];
    const value: RoleUpdates = {
      menuIds: this.flatten(this.menuNodes)
        .filter(n => n.isLeaf)
        .filter(n => checkedKeys.indexOf(n.key) !== -1)
        .map((n) => n.key),
    };
    this.$emit("formSubmit", {
      value: value,
      isEditing: this.isEditing,
      initData: this.initData,
    });
  }
  public cancel() {
    this.$emit("formCancel");
  }
  toTreeNodeOptions(menuNode: MenuNode): TreeNodeOptions<MenuNode> {
    return {
      key: menuNode.item.id,
      title: menuNode.item.title,
      isLeaf: menuNode.item.isLeaf,
      children: !!menuNode.children && menuNode.children.length > 0 ? menuNode.children.map(n => this.toTreeNodeOptions(n)) : null,
      expanded: false,
      menuNode: menuNode
    };
  }
  flatten(treeNode: TreeNodeOptions<MenuNode>[]): TreeNodeOptions<MenuNode>[] {
    const result = [];
    treeNode.forEach(n => {
      result.push(n);
      if (n.children) {
        const sub = this.flatten(n.children);
        sub.forEach(s => {
          result.push(s);
        });
      }
    });
    return result;
  }
}
</script>

<style>
</style>
-->
