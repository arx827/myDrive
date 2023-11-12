import {
	YapPointAuditItemDto,	SearchAuditPlanMonthEnum, SearchAuditPlanAuditTypeEnum, SearchAuditPlanAuditorTeamEnum,
} from '@fubonlife/iams-api-axios-sdk';

export interface yapFrontEndPointAuditItem{
	key: string;
	headerTitle: string;
	yapPointAuditItems: Array<YapPointAuditItemFrontEndDto>;
}

export interface YapFrontEndDto {
	auditItem?: string;
	auditType?: string;
	coAuditorTeam?: Array<string>;
	endMonth?: string;
	mainAuditorTeam?: string;
	modify?: boolean;
	month?: string;
	reviewLevel?: string;
	startMonth?: string;
	units?: Array<string>;
	yapId?: string;
	yapPointAuditItemMap?: Array<yapFrontEndPointAuditItem>;
	yapProjectScopeCheckStatus?: string;
	yapProjectScopeContent?: string;
	yapProjectScopeQaStatus?: string;
	yapStatus?: string;
	originalMainAuditorTeam?: string;
	originalYapProjectScopeContent?: string;
	redFlagOfYapProjectScopeCheckStatus?: boolean;
	isShow?: boolean;
	isReviewDone?: string;
	rejectFlag?: boolean;
}

export type YapPointAuditItemFrontEndDto = YapPointAuditItemDto&{originalItemContent: string}

export interface SearchAuditPlanFrontEnd {
	includeAuditTeam?: boolean;
	year: number;
	month?: SearchAuditPlanMonthEnum;
	auditType?: SearchAuditPlanAuditTypeEnum;
	auditItems?: string;
	auditorTeam?: SearchAuditPlanAuditorTeamEnum;
}

export interface YapPointAuditItemData{
	yapId: string;
	yapPointAuditItemMapId: string;
	yapPointAuditItemId: string;
	yapPointAuditItem: YapPointAuditItemFrontEndDto;
}
