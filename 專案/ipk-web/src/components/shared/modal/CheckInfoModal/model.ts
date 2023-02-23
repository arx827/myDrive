/**
 * key: v-model 綁定的值。
 * isEdit: 該欄位是否被修改。
 * message: 欄位訊息。
 * label: 欄位名稱。
 * type: 類型設定(action、badge、date)。
 *       1. action: 不顯示操作欄位。
 *       2. badge: 顯示badge樣式。
 *       3. date: 日期為string型別，無時間格式，需做時間轉換
 *       4. dateTime: 日期為string型別，有時間格式，需做時間轉換
 *       5. inputText: 顯示input樣式。
 *       6. textarea: 顯示textarea樣式。
 * span: col大小
 */
export interface CheckInfoModel {
  label?: string;
  type?: string;
  key?: any;
  isEdit?: boolean;
  message?: string;
  span?: number;
}
