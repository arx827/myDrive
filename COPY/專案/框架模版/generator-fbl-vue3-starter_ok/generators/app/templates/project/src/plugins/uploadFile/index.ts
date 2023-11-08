interface VaildResult {
  vaild: boolean
  message: string
}
export default class UploadFile {
  /**
   * @summary 檢核檔案（單個檔案, 多選檔案陣列, 現在已上傳的檔案陣列, 檔案限制類型, 檔案限制大小(M), 檔案限制個數）
   * 不設定選項帶null
   */
  static beforeUpload(
    file,
    fileList,
    curruntUploadFile: any,
    acceptType?: string,
    fileSize?: number,
    count?: number,
  ): VaildResult {
    // 檢核:檔案大小
    let result: VaildResult = {
      vaild: true,
      message: null,
    }
    if (fileSize) {
      const isAcceptSize = fileSize / 1024 / 1024 < file.size
      if (!isAcceptSize) {
        result = {
          vaild: false,
          message: `${file.name}上傳的檔案已超過${fileSize}MB，請調整大小後重新匯入。`,
        }
      }
    }
    if (acceptType) {
      // 參數提供 能接受的檔案類型轉陣列
      const AcType = acceptType.split(',').map(item => item.trim())
      // 在所有檔案類型中 找對應的 能接受檔案類型
      const extension = file.name.substring(file.name.lastIndexOf('.')) // 使用副檔名比對
      const fileType = file.type // 檔案type
      console.log(file)
      console.log(AcType)
      if (!AcType.includes(fileType) && !AcType.includes(extension)) {
        result = {
          vaild: false,
          message: `${file.name}上傳格式不正確，請重新上傳。`,
        }
      }
    }
    if (count) {
      let currentCount = curruntUploadFile.length
      // console.log(currentCount)
      if (curruntUploadFile.length > 0) {
        curruntUploadFile.some(e => e.name === '未選取任何文件') ? (currentCount -= 1) : currentCount
      }

      if (fileList.length + currentCount > count) {
        result = {
          vaild: false,
          message: '已超過可上傳個數',
        }
      }
    }
    return result
  }
}
