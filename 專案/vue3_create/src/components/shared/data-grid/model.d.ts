export declare enum FblColumnType {
  PLAIN = 'PLAIN',
  TEMPLATE = 'TEMPLATE',
  BADGE = 'BADGE',
  TAG = 'TAG',
  ACTION = 'ACTION',
  ELLIPSIS = 'ELLIPSIS',
}

export interface FblColumn<T> {
  type: FblColumnType
  title: string
  property?: string
  width?: number | string
  minWidth?: number
  actions?: FblAction<T>[]
  moreActionTitle?: string
  actionButtonType?: string
  hidden?: boolean
  fixed?: 'left' | 'right'
  template?: string
  ellipsisNum?: number
  inspect?: boolean
  sorter?: boolean
  sortProperty?: string
  formatter?: (data: T) => string
  badgeColor?: (data: T) => string | string
  tagColor?: (data: T) => string | string
  rowSpanKey?: (data: T) => string
  customRender?: ((data: T, record: T, index: number, column: any) => any) | ScopedSlot
}
