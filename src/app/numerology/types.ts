
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
export type Levels = "L1" | "L2" | "L1L2" | "L3" | "L4" | "Bonus 1" | "Bonus 2" | "Bonus 1 & Bonus 2";


export type LevelType = {
    level: string | Levels;
    value: string;
    name: string;
}

export type Meaning = {
    number?: number;
    name: string;
    themes: string;
    challenges: string;
    gifts: string;
    nlp_prompt: string;
}