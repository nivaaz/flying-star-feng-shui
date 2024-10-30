
export type AddressFieldsType = {
    example?: string;
    label: string;
    warning?: string;
    currentId: string;
}
export enum AddressFieldCategory {
    streetNumber,
    unitNumber,
    streetName,
    postalCode,
    homeYear,
    bornYear,
}

export type FormDataType = {
    streetNumber: string,
    streetName: string,
    buildingNumberAndName: string,
    unitNumber: string,
    postalCode: string,
    homeYear: string,
    bornYear: string,
    bday: string,
    isDirtyForm: boolean,
}        


export type LevelType = {
    level: string;
    value: string;
    name: string;
}