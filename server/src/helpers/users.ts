import {genSalt, hash} from "bcrypt";
import {UserFieldsEnum} from "@enums/user-fields.enum";
import {generateJWT} from "./jwt";
import {saveSession} from "@helpers/sessions";
import type {UserModel} from "@models/user.model";

const users: UserModel[] = [
    {
        id: 1,
        firstName: 'Dmitry',
        lastName: 'Burlaka',
        email: 'test@test.com',
        password: '$2b$10$3GYaVb97k/O557tYLDzDPOkeOBYiIybfdws/Bwl4lR8guGojzNFd2',
        salt: '$2b$10$3GYaVb97k/O557tYLDzDPO',
        avatar: 'https://marketplace.canva.com/EAFewoMXU-4/1/0/1600w/canva-purple-pink-gradient-man-3d-avatar-0o0qE2T_kr8.jpg',
    },
    {
        id: 2,
        firstName: 'Dmitry',
        lastName: 'Test',
        email: 'test@test1.com',
        password: '$2b$10$nL7QK16cow8vT.jKWQTiUedqMXCIKV7WcreYgSX.fixyF7CAbOx8S',
        salt: '$2b$10$nL7QK16cow8vT.jKWQTiUe',
        avatar: 'https://marketplace.canva.com/EAFewoMXU-4/1/0/1600w/canva-purple-pink-gradient-man-3d-avatar-0o0qE2T_kr8.jpg',
    }
];

export const getUsers = () => {
   return users.map(({password, salt, email, ...rest}) => rest);
}

const isUser = (user: Object, fields: UserFieldsEnum[]): user is UserModel => {
    const keys = Object.getOwnPropertyNames(user);
    // @ts-ignore
    return fields.every((field) => keys.includes(field) && typeof user?.[field] === 'string');
}

export const registerUser = async ({password, ...rest}: UserModel) => {
    if (!isUser({password, ...rest}, [UserFieldsEnum.firstName, UserFieldsEnum.lastName, UserFieldsEnum.email, UserFieldsEnum.password])) {
        throw new Error('Invalid DTO');
    }

    const id = users.length + 1;
    const salt = await genSalt();
    const hashed = await hash(password!, salt);
    const user = {...rest, id, password: hashed, salt};
    const {password: _, salt: __, ..._user} = user;
    const token = generateJWT(_user);

    users.push(user);
    saveSession(token, id);

    return {..._user, token};
}

export const authUser = async (metadata: UserModel) => {
    if (!isUser(metadata, [UserFieldsEnum.email, UserFieldsEnum.password])) {
        throw new Error('Invalid DTO');
    }

    const user = users.find((u) => u[UserFieldsEnum.email] === metadata[UserFieldsEnum.email]);
    if (!user) {
        throw new Error('Invalid user');
    }

    const hashed = await hash(metadata[UserFieldsEnum.password]!, user[UserFieldsEnum.salt]!);
    if (hashed !== user[UserFieldsEnum.password]) {
        throw new Error('Invalid user');
    }

    const {password, salt, ..._user} = user;
    const token = generateJWT(_user);

    saveSession(token, user.id!);
    return {..._user, token};
}
