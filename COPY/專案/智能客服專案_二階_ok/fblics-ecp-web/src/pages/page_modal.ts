import type { Dayjs } from 'dayjs'
import type { ItemListDto } from '@fubonlife/fblics-api-axios-sdk'
import type { FileDownloadFileCategoryEnum, FileDownloadFileStatusEnum } from '@fubonlife/fblics-api-axios-sdk'

// --------------- 系統管理 --------------- //
export namespace SystemSetting {
  export interface formDataType {
    serviceSwitch: boolean
    maxServiceNum: number
  }
}

export namespace ServiceClosed {
  export interface IFormData {
    date: Dayjs
    description: string
  }
}

export namespace ServiceHours {
  export interface IFormData {
    serviceStartHour: string
    serviceStartMinute: string
    serviceEndHour: string
    serviceEndMinute: string
  }
}

export namespace NonServiceMessage {
  export interface formDataType {
    message: string
  }
}

export namespace MaintenMessage {
  export interface formDataType {
    message: string
  }
}

// --------------- 字卡管理 --------------- //
export namespace CardTypeManagementChangeLog {
  export interface formDataType {
    changePersonnel: string
    changeDate: [Date, Date]
  }
}

export namespace CardTypeManagementAddAndEdit {
  export interface formDataType {
    cardCategoryName: string
    cardCategoryId?: string
  }
}

export namespace CardManagementIndex {
  export interface formDataType {
    keyword: string
    cardCategory: number
  }
}

export namespace CardManagementChangeLog {
  export interface formDataType {
    changePersonnel: string
    changeDate: [Date, Date]
  }
}

export namespace CardManagementAddAndEdit {
  // export interface ItemListDtoAddFile extends ItemListDto {
  //   fileDownload?: {
  //     fileCategory: FileDownloadFileCategoryEnum
  //     fileId: number
  //     fileStatus: FileDownloadFileStatusEnum
  //     fileName: String
  //   }
  // }
  export interface formDataType<T> {
    cardId?: number
    cardCategory?: number
    cardImage: string
    cardTitle: string
    cardDescription?: string
    itemList?: T[]
  }
}

// --------------- 覆核功能 --------------- //
export namespace ReviewIndex {
  export interface formDataType {
    applyType: string
  }
}

export namespace ReviewConfirm {
  interface gridDataType1 {
    id?: string
    actionStatus?: string
    workingStatusName?: string
    status?: string
  }
  interface gridDataType2 {
    startTimeHour: string
    startTimeMinute: string
    endTimeHour: string
    endTimeMinute: string
  }

  interface gridDataType3 {
    type: string
    name: string
    date: string
  }
  interface gridDataTypeCard1 {
    cardCategoryId: number
    cardCategoryName: string
    modifyStatus: number
    applyStatus: number
    modifyName: string
    modifyDate: string
  }

  interface gridDataTypeCard2 {
    cardId: number
    cardCategory: number
    cardImage: string
    cardTitle: string
    cardDescription: string
    itemList: ItemListDto[]
  }

  export interface itemType {
    itemId: number
    itemTitle: string
    itemType: number
    itemShowTitle: string
    itemFAQ: string
    itemUrl: string
  }

  export interface dataGridDataType {
    applyData?: {
      applyId: number
      changeId: number
      applyType: number
      modifyType: number
      modifyUser: string
      modifyDate: string
    }
    gridDataType1?: gridDataType1[]
    gridDataType2?: gridDataType2
    gridDataType3?: gridDataType3[]
    gridDataType4?: string
    gridDataType5?: string
    gridDataTypeCard1?: gridDataTypeCard1
    gridDataTypeCard2?: gridDataTypeCard2
  }
}

export namespace ReviewChangeLog {
  export interface formDataType {
    results: number[]
    modifyUser: string
    modifyDate: [Date, Date]
  }
}

export namespace ReviewTypeCard2 {
  export interface itemType {
    itemId: number
    itemTitle: string
    itemType: number
    itemShowTitle: string
    itemFAQ: string
    itemUrl: string
  }
}

// --------------- 報表功能 --------------- //
export namespace ReportTrendingQuery {
  export interface formDataType {
    changePersonnel: string
    changeDate: [Date, Date]
  }
}

export namespace ReportChatroomOverview {
  export interface formDataType {
    changePersonnel: string
    changeDate: [Date, Date]
  }
}

export namespace ReportAttendantChattingOverview {
  export interface formDataType {
    attendantId: string
    changeDate: [Date, Date]
  }
}
