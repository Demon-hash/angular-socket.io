import {verifyJWTFromHeader} from "@helpers/jwt";
import type {SocketMiddlewareFnModel} from "@models/socket-middleware-fn.model";

export const socketAuthMiddleware: SocketMiddlewareFnModel = (socket, next) => {
    const authorization = socket.request.headers?.['authorization'];
    verifyJWTFromHeader((token: string) => {
        socket.handshake.auth['token'] = token;
        next();
    }, () => {
        next(new Error('Unauthorized'));
    }, authorization);
}
