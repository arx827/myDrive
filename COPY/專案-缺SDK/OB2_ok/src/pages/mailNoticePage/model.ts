import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
 * 郵寄通知函報表驗證物件
 */
export interface mailNoticeSearchValidateForm{
    policyNo01?: ValidateFormComponent,
    policyNo02?: ValidateFormComponent,
    policyNo03?: ValidateFormComponent,
    custId?: ValidateFormComponent,
    custName?: ValidateFormComponent,
    mailByPostId?: ValidateFormComponent,
    registerNo?: ValidateFormComponent,
    dueContStart?: ValidateFormComponent,
    dueContEnd?: ValidateFormComponent,
    letterStart?: ValidateFormComponent,
    letterEnd?: ValidateFormComponent,
    mailByPostStart?: ValidateFormComponent,
    mailByPostEnd?: ValidateFormComponent,
    returnStart?: ValidateFormComponent,
    returnEnd?: ValidateFormComponent,
}