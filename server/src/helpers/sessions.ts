const sessions = new Map();
const SESSION_PREFIX = 'user-';

export const getSession = (token: string): string => {
    return sessions.get(token);
}

export const deleteSession = (token: string) => {
    sessions.delete(token);
}

export const convertToSessionId = (userId: number | string) => {
    return `${SESSION_PREFIX}${userId}`;
}

export const saveSession = (token: string, userId: number) => {
    sessions.set(token, `${SESSION_PREFIX}${userId}`);
}
