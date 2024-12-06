export default interface UserFieldDTO {
  userId: string;
  fields: {
    fieldId: string;
    fieldName: string;
    fieldValue: string;
  }[];
}
