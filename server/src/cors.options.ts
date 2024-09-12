import {environment} from "@environment";

export const CORS_OPTIONS = {
    origin: environment.clientOrigin,
    methods: '*'
} as const;
