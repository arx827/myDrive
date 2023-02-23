import {
 Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Subject } from 'rxjs';
import {
  MenuNode,
  RoleDto,
  RoleUpdates,
} from '@fubonlife/ipk-api-axios-sdk';
import { TreeNodeOptions } from '@/forms/RoleForm/model';

@Component
export default class RoleForm extends Vue {
  @Prop()
  public initData: RoleDto;

  @Prop()
  public loading: boolean;

  checkedKeys: string[] = [];

  menuNodes: TreeNodeOptions<MenuNode>[] = [];

  get isEditing(): boolean {
    return !!this.initData && !!this.initData.id;
  }

  created(): void {
    this.reset();
  }

  @Watch('initData')
  onInitDataChanged(): void {
    this.reset();
  }

  reset() {
    this.$menuApi.getMenuTreeUsingGET()
      .then((resp) => {
        const root = resp.data;
        this.menuNodes = root.children.map((n) => this.toTreeNodeOptions(n));
        this.checkedKeys = this.initData.menus.map((m) => m.id);
      })
      .catch(console.error)
      .finally(() => {
        //
      });
  }

  public submit() {
    const checkedKeys = [...this.checkedKeys];
    const value: RoleUpdates = {
      menuIds: this.flatten(this.menuNodes)
        .filter((n) => n.isLeaf)
        .filter((n) => checkedKeys.indexOf(n.key) !== -1)
        .map((n) => n.key),
    };
    this.$emit('formSubmit', {
      value,
      isEditing: this.isEditing,
      initData: this.initData,
    });
  }

  public cancel() {
    this.$emit('formCancel');
  }

  toTreeNodeOptions(menuNode: MenuNode): TreeNodeOptions<MenuNode> {
    return {
      key: menuNode.item.id,
      title: menuNode.item.title,
      isLeaf: menuNode.item.isLeaf,
      children: !!menuNode.children && menuNode.children.length > 0 ? menuNode.children.map((n) => this.toTreeNodeOptions(n)) : null,
      expanded: false,
      menuNode,
    };
  }

  flatten(treeNode: TreeNodeOptions<MenuNode>[]): TreeNodeOptions<MenuNode>[] {
    const result = [];
    treeNode.forEach((n) => {
      result.push(n);
      if (n.children) {
        const sub = this.flatten(n.children);
        sub.forEach((s) => {
          result.push(s);
        });
      }
    });
    return result;
  }
}
