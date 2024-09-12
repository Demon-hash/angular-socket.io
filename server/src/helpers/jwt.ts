import {sign, verify} from "jsonwebtoken";
import {environment} from "@environment";
import type {UserModel} from "@models/user.model";

export const generateJWT = (user: UserModel) => {
    // TODO: encrypt
    return sign(user, environment.secret, {expiresIn: '30m'});
}

export const verifyJWT = (token: string, onSuccess: Function, onError: Function) => {
    // TODO: decrypt
    return verify(token, environment.secret, (error) => {
        if (error) return onError();
        return onSuccess(token);
    })
}

export const verifyJWTFromHeader = (onSuccess: Function, onError: Function, authorization?: string) => {
    const tokens = authorization?.split(/\s/);

    if (!Array.isArray(tokens) || tokens.length < 2) {
        return onError();
    }

    const [_, token] = tokens;
    verifyJWT(token, onSuccess, onError);
}
