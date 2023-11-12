import { BackDoorSqlInputBackDoorDbEnumEnum } from "@fubonlife/obd-api-axios-sdk";

export interface DbOptions {
    label: string,
    value: BackDoorSqlInputBackDoorDbEnumEnum,
}

export class DbOptionList {
    public static dbOptions: DbOptions[] = [
        {
            label: BackDoorSqlInputBackDoorDbEnumEnum.AS400,
            value: BackDoorSqlInputBackDoorDbEnumEnum.AS400,
        },
        {
            label: BackDoorSqlInputBackDoorDbEnumEnum.DBDIALER,
            value: BackDoorSqlInputBackDoorDbEnumEnum.DBDIALER,
        },
        {
            label: BackDoorSqlInputBackDoorDbEnumEnum.DBINTRA,
            value: BackDoorSqlInputBackDoorDbEnumEnum.DBINTRA,
        },
        {
            label: BackDoorSqlInputBackDoorDbEnumEnum.MPLUS,
            value: BackDoorSqlInputBackDoorDbEnumEnum.MPLUS,
        },
        {
            label: BackDoorSqlInputBackDoorDbEnumEnum.CUSTDB,
            value: BackDoorSqlInputBackDoorDbEnumEnum.CUSTDB,
        },
        {
            label: BackDoorSqlInputBackDoorDbEnumEnum.SAV,
            value: BackDoorSqlInputBackDoorDbEnumEnum.SAV,
        },
        {
            label: BackDoorSqlInputBackDoorDbEnumEnum.DBCTI,
            value: BackDoorSqlInputBackDoorDbEnumEnum.DBCTI,
        },
    ];
}