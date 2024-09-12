import express from "express";
import {authUser, getUsers, registerUser} from "@helpers/users";
import {ApiRoutesEnum} from "@enums/api.routes.enum";

export const API_ROUTES = express.Router();

API_ROUTES.post(ApiRoutesEnum.login, async (req, res) => {
    try {
        const user = await authUser(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({error});
    }
});

API_ROUTES.post(ApiRoutesEnum.register, async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({error});
    }
});

API_ROUTES.post(ApiRoutesEnum.users, (req, res, next) => {
    res.status(200).json(getUsers());
});
