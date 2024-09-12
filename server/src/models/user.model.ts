import type {UserFieldsEnum} from "@enums/user-fields.enum";

export type UserModel = {
    [UserFieldsEnum.id]?: number;
    [UserFieldsEnum.email]?: string;
    [UserFieldsEnum.firstName]?: string;
    [UserFieldsEnum.lastName]?: string;
    [UserFieldsEnum.password]?: string;
    [UserFieldsEnum.salt]?: string;
    [UserFieldsEnum.avatar]?: string;
}
