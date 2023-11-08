import LoadingUtil from "@/assets/config/LoadingUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { BackDoorEditOutput, BackDoorSqlInput, BackDoorSqlInputBackDoorDbEnumEnum } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import BackDoorUtil from "./BackDoorUtil";
import { DbOptionList, DbOptions } from "./model";

@Component({ components: {} })
export default class BackDoorEdit extends Vue {

    tokenCountDown: string = "";

    statement: string = "說明：1. 每筆增刪改SQL語句請以'#OBD2#'結尾。";

    // 影響筆數
    affectDataNum: number = 0;

    // 限制執行筆數
    limitedDataLength: string = "10";

    searchResultDataLength: number = 0;

    isInsertLoading: boolean = false;
    isModifyLoading: boolean = false;
    isDeleteLoading: boolean = false;

    dbSelect: BackDoorSqlInputBackDoorDbEnumEnum = null;

    dbOptions: DbOptions[] = DbOptionList.dbOptions;

    insertSqlScript: string = "";
    modifySqlScript: string = "";
    deleteSqlScript: string = "";

    /**
     * 開啟頁面
     */
    created() {
        // 檢查是否有有效的token
        if (!BackDoorUtil.checkToken()) {
            this.$router.push({
                name: 'BackDoorValidation',
                query: { from: 'BackDoorEdit' },
            }).catch(() => { });
            return;
        }
        setInterval(() => {
            this.tokenCountDown = BackDoorUtil.showTokenExp();
        }, 1000)
    }

    /**
     * 新增
     */
    onInsert() {
        // 執行增刪改SQL的共同驗證
        if (!this.onSqlActionValidation(this.insertSqlScript)) {
            return;
        }

        // 檢查是否包含Insert關鍵字
        if (!this.insertSqlScript.toUpperCase().includes("INSERT")) {
            alert("SQL中不包含INSERT關鍵字");
            return;
        }

        // 打新增/刪除/修改影響比數API，預計回傳是否成功及影響筆數
        let checkLimitedDataLengthPromise = this.prepareCheckLimitedDataLength(this.insertSqlScript);
        if (checkLimitedDataLengthPromise) {
            LoadingUtil.show();
            checkLimitedDataLengthPromise.then((resp: AxiosResponse<BackDoorEditOutput>) => {
                LoadingUtil.close()
                if (resp && resp.data && resp.data.success) {
                    this.affectDataNum = resp.data.affectNum;
                    let checkLimitedDataLength = this.checkLimitedDataLength();
                    if (checkLimitedDataLength) {
                        let isConfirm = confirm("確定要新增 " + this.affectDataNum + " 筆資料？");
                        if (isConfirm) {
                            this.isInsertLoading = true;
                            this.prepareSqlActionExecution(this.insertSqlScript)
                                .then((resp: AxiosResponse<BackDoorEditOutput>) => {
                                    if (resp && resp.data && resp.data.success) {
                                        this.affectDataNum = resp.data.affectNum;
                                        alert("已新增 " + this.affectDataNum + " 筆資料！");
                                    } else {
                                        alert("新增SQL執行時發生錯誤：" + resp.data.returnMessage)
                                        return false;
                                    }
                                }).catch(e => console.error(e)).finally(() => this.isInsertLoading = false);
                        }
                    }
                } else {
                    alert("檢查影響筆數是否超過限制執行筆數時發生錯誤：" + resp.data.returnMessage)
                    return false;
                }
            }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
        }
    }

    /**
     * 修改
     */
    onModify() {
        // 執行增刪改SQL的共同驗證
        if (!this.onSqlActionValidation(this.modifySqlScript)) {
            return;
        }

        // 檢查是否包含UPDATE關鍵字
        if (!this.modifySqlScript.toUpperCase().includes("UPDATE") || !this.modifySqlScript.toUpperCase().includes("WHERE")) {
            alert("SQL中不包含UPDATE、WHERE關鍵字");
            return;
        }

        // 打新增/刪除/修改影響比數API，預計回傳是否成功及影響筆數
        let checkLimitedDataLengthPromise = this.prepareCheckLimitedDataLength(this.modifySqlScript);
        if (checkLimitedDataLengthPromise) {
            LoadingUtil.show();
            checkLimitedDataLengthPromise.then((resp: AxiosResponse<BackDoorEditOutput>) => {
                LoadingUtil.close()
                if (resp && resp.data && resp.data.success) {
                    this.affectDataNum = resp.data.affectNum;
                    let checkLimitedDataLength = this.checkLimitedDataLength();
                    if (checkLimitedDataLength) {
                        let isConfirm = confirm("確定要修改 " + this.affectDataNum + " 筆資料？");
                        if (isConfirm) {
                            this.isModifyLoading = true;
                            this.prepareSqlActionExecution(this.modifySqlScript)
                                .then((resp: AxiosResponse<BackDoorEditOutput>) => {
                                    if (resp && resp.data && resp.data.success) {
                                        this.affectDataNum = resp.data.affectNum;
                                        alert("已修改 " + this.affectDataNum + " 筆資料！");
                                    } else {
                                        alert("新增SQL執行時發生錯誤：" + resp.data.returnMessage)
                                        return false;
                                    }
                                }).catch(e => console.error(e)).finally(() => this.isModifyLoading = false);
                        }
                    }
                } else {
                    alert("檢查影響筆數是否超過限制執行筆數時發生錯誤：" + resp.data.returnMessage)
                    return false;
                }
            }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
        }
    }

    /**
     * 刪除
     */
    onDelete() {
        // 執行增刪改SQL的共同驗證
        if (!this.onSqlActionValidation(this.deleteSqlScript)) {
            return;
        }

        // 檢查是否包含Insert關鍵字
        if (!this.deleteSqlScript.toUpperCase().includes("DELETE") || !this.deleteSqlScript.toUpperCase().includes("WHERE")) {
            alert("SQL中不包含DELETE、WHERE關鍵字");
            return;
        }

        // 打新增/刪除/修改影響比數API，預計回傳是否成功及影響筆數
        let checkLimitedDataLengthPromise = this.prepareCheckLimitedDataLength(this.deleteSqlScript);
        if (checkLimitedDataLengthPromise) {
            LoadingUtil.show();
            checkLimitedDataLengthPromise.then((resp: AxiosResponse<BackDoorEditOutput>) => {
                LoadingUtil.close()
                if (resp && resp.data && resp.data.success) {
                    this.affectDataNum = resp.data.affectNum;
                    let checkLimitedDataLength = this.checkLimitedDataLength();
                    if (checkLimitedDataLength) {
                        let isConfirm = confirm("確定要刪除 " + this.affectDataNum + " 筆資料？");
                        if (isConfirm) {
                            this.isDeleteLoading = true;
                            this.prepareSqlActionExecution(this.deleteSqlScript)
                                .then((resp: AxiosResponse<BackDoorEditOutput>) => {
                                    if (resp && resp.data && resp.data.success) {
                                        this.affectDataNum = resp.data.affectNum;
                                        alert("已刪除 " + this.affectDataNum + " 筆資料！");
                                    } else {
                                        alert("新增SQL執行時發生錯誤：" + resp.data.returnMessage)
                                        return false;
                                    }
                                }).catch(e => console.error(e)).finally(() => this.isDeleteLoading = false);
                        }
                    }
                } else {
                    alert("檢查影響筆數是否超過限制執行筆數時發生錯誤：" + resp.data.returnMessage)
                    return false;
                }
            }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
        }
    }

    /**
     * 執行增刪改SQL的共同驗證
     */
    onSqlActionValidation(sqlScript: string) {
        // 檢查是否有有效的token
        if (!BackDoorUtil.checkToken()) {
            this.$router.push({
                name: 'BackDoorValidation',
                query: { from: 'BackDoorEdit' },
            }).catch(() => { });
            return false;
        }

        // 檢查SQL查詢條件
        if (!this.checkSearchParameters(sqlScript)) {
            return false;
        }
        return true;
    }

    /**
     * 準備檢查影響筆數是否超過限制執行筆數
     */
    prepareCheckLimitedDataLength(sqlString: string) {
        if (!this.validateLimitedDataLength()) {
            return;
        }

        this.affectDataNum = 0;
        let backDoorSqlInput: BackDoorSqlInput = {
            backDoorDbEnum: this.dbSelect,
            limitedNum: Number(this.limitedDataLength),
            sqlString: sqlString,
            backDoorToken: BackDoorUtil.getBackDoorToken(),
        }
        return this.$backDoorSettingApi.returnInsertAndEditAndDeleteNumUsingPOST(backDoorSqlInput);
    }

    /**
     * 檢查影響筆數是否超過限制執行筆數
     */
    checkLimitedDataLength() {
        if (this.affectDataNum > Number(this.limitedDataLength)) {
            alert("影響筆數 " + this.affectDataNum + " 筆，超過限制執行筆數");
            return false;
        } else {
            return true;
        }
    }

    /**
     * 準備增刪改SQL
     */
    prepareSqlActionExecution(sqlScript: string) {
        this.affectDataNum = 0;
        let backDoorSqlInput: BackDoorSqlInput = {
            backDoorDbEnum: this.dbSelect,
            limitedNum: Number(this.limitedDataLength),
            sqlString: sqlScript,
            backDoorToken: BackDoorUtil.getBackDoorToken(),
        }
        return this.$backDoorSettingApi.executeInsertAndEditAndDeleteUsingPOST(backDoorSqlInput);
    }

    /**
     * 檢查SQL查詢條件
     */
    checkSearchParameters(sqlScript: string) {
        let valid = false;
        // 檢查DB選擇和SQL腳本部為空
        valid = !ValidationUtil.isEmpty(this.dbSelect) && !ValidationUtil.isEmpty(sqlScript);
        if (!valid) {
            alert("DB和SQL不得為空");
            return valid;
        }
        valid = sqlScript.includes("#OBD2#");
        if (!valid) {
            alert("每筆增刪改SQL語句請以'#OBD2#'結尾");
            return valid;
        }
        return valid;
    }

    /**
     * 強迫限制執行筆數設定為正確值
     */
    validateLimitedDataLength() {
        let valid = true;
        // 數字檢查
        if (!ValidationUtil.numberOnlyValidation(this.limitedDataLength)) {
            valid = false;
        }
        // 負數檢查
        if (Number(this.limitedDataLength) <= 0) {
            valid = false;
        }
        if (!valid) {
            alert("限制執行筆數：請輸入正整數。");
        }
        return valid;
    }
}