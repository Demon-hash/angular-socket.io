import type {NextFunction, Request, Response} from "express";
import {ApiRoutesEnum} from "@enums/api.routes.enum";
import {verifyJWTFromHeader} from "@helpers/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if ([ApiRoutesEnum.login, ApiRoutesEnum.register].includes(req.path as ApiRoutesEnum)) {
        return next();
    }

    verifyJWTFromHeader( () => next(), () => res.sendStatus(401).json({
        error: 'Unauthorized'
    }), req.headers?.['authorization']);
}
