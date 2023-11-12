import type { UploadFile } from 'ant-design-vue/es/upload'

// export interface ILink {
//   linkNo?: string
//   linkName?: string
//   linkType?: string
//   linkUrl?: string
//   faqA?: string
//   faqQ?: string
//   files?: UploadFile<any>[] | UploadFile<any> | any
// }

export interface ICards {
  title: string
  subTitle?: string
  idCode: string
  imgNo?: string
  linkArr?: ILink[]
}

export interface cardManagement<T> {
  cardType: string
  cardTypeKey: string
  items: T[]
}
