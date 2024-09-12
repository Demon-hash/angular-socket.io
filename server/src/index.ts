import cors from 'cors';
import express from "express";
import {createServer} from 'http';
import {Server} from "socket.io";
import {API_ROUTES} from "@routes/api.routes";
import {environment} from "@environment";
import {authMiddleware} from "@middlewares/auth.middleware";
import {CORS_OPTIONS} from "./cors.options";
import {convertToSessionId, getSession} from "@helpers/sessions";
import {getUsers} from "@helpers/users";
import {socketAuthMiddleware} from "@middlewares/socket-auth.middleware";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: CORS_OPTIONS,
});

app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use('/api', authMiddleware, API_ROUTES);

const getActiveUsers = () => {
    const users = [];
    for (const [_, client] of io.of('/').sockets) {
        const token = client.handshake.auth?.['token'];
        if(typeof token !== 'string') continue;

        const session = getSession(token);
        if(typeof session !== 'string') continue;

        users.push(session);
    }

    return users;
}

io.use(socketAuthMiddleware);
io.on('connection', socket => {
    const token = socket.handshake.auth?.['token'];
    const session = getSession(token);

    socket.join(session);

    io.emit('online_rooms', getActiveUsers());
    socket.emit('room_registered', getUsers());
    socket.emit('session', session);

    socket.on('disconnect', () => {
        socket.broadcast.emit('online_rooms', getActiveUsers());
        socket.leave(session);
    });

    socket.on('private_message', ({message, to}) => {
        console.log(convertToSessionId(to), session);

        socket.to(convertToSessionId(to)).emit('private_message', {message, from: session});
        socket.emit('private_message', {message, from: session});
    });

    socket.on('room_registered', () => {
        socket.broadcast.emit('room_registered', getUsers());
        socket.broadcast.emit('online_rooms', getActiveUsers());
    });
});

server.listen(environment.port, () => `Server started on port ${environment.port}`);
