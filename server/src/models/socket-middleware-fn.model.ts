import type {Server} from "socket.io";

export type SocketMiddlewareFnModel = Parameters<InstanceType<typeof Server>['use']>[0];
