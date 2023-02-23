export interface TreeNodeOptions<T> {
    key: string;
        title: string;
        isLeaf: boolean;
        children: TreeNodeOptions<T>[];
        expanded: boolean;
        menuNode: T;
  }
