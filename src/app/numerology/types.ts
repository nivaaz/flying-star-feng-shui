
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