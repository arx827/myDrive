/**
 * @description 代理人設定維護表單
 * @version 2021/07/16
 * @author B1531
 */
export interface AgentValidateForm {
    agentDept?: ValidateFormComponent;
    agentDivi?: ValidateFormComponent;
    agentId?: ValidateFormComponent;
}

/**
* @description 代理人設定表單驗證物件
* @version 2021/07/16
* @author B1531
*/
export interface ValidateFormComponent {
    hover?: string;
    feedback?: boolean;
    state?: string;
    msg?: string;
}

/**
* @description 代理人編輯表單物件
* @version 2021/12/22
* @author B1531
*/
export interface AgnetEditForm {
    agentDeptId: string,
    agentDiviId: string,
    agentId: string,
}