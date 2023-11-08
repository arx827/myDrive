import {
	AuditOpinionDto,
	SearchAuditPlanMonthEnum,
	SelectOptionDto,
	ItemDesc,
} from '@fubonlife/iams-api-axios-sdk';

export interface auditingIndexSearchForm {
	year: Date;
	startMonth: SearchAuditPlanMonthEnum;
	endMonth: SearchAuditPlanMonthEnum;
	auditItem: string;
	auditorTeam: string;
	unit: string;
	toDo: boolean;
	hasOpinion: boolean;
}

export interface SelectOptionDtoGroup {
	year: SelectOptionDto[];
	auditItem: SelectOptionDto[];
	checkedUnit: ItemDesc[];
	groups: SelectOptionDto[];
}

export interface auditingDetailSearchForm {
	toDo: boolean;
	hasOpinion: boolean;
	auditDraftSectionId: string;
	auditDraftId: string;
	quarterPlanMId: string;
}

export interface resultModel {
	visible: boolean;
  title: string;
	content?: string;
  type: 'success' | 'error';
	autoClose?: string;
}

export interface AuditOpinionFrontEndDto extends Omit<AuditOpinionDto, 'subAuditOpinions'> {
	subAuditOpinions: Array<AuditOpinionFrontEndDto>;
	imporveOption: string;
}

export interface AuditOpinionQAModel {
	visible: boolean;
	type: string;
	auditOpinion: AuditOpinionFrontEndDto;
	auditDraftContent;
}

export interface UpdateAuditOpinion{
	type: string;
	auditOpinionId: string;
	subRelMainId?: string;
}
