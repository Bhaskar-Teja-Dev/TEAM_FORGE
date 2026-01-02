import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
    if (socket) return socket;

    socket = io(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token'),
        },
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

/* =========================
   PERSONAL CHAT (EXISTING)
========================= */
export const joinConversation = (conversationId) => {
    socket.emit('join_conversation', { conversationId });
};

export const sendMessage = (conversationId, receiverId, content) => {
    socket.emit('send_message', { receiverId, content });
};

export const markAsRead = (conversationId) => {
    socket.emit('mark_read', { conversationId });
};

export const onNewMessage = (cb) => {
    socket.on('new_message', cb);
};

export const offEvent = (event, cb) => {
    socket.off(event, cb);
};

/* =========================
   TEAM CHAT (PHASE 2.1.3)
========================= */
export const joinTeam = (teamId) => {
    socket.emit('join_team', { teamId });
};

export const leaveTeam = (teamId) => {
    socket.emit('leave_team', { teamId });
};

export const sendTeamMessage = (teamId, content) => {
    socket.emit('send_team_message', { teamId, content });
};

export const onTeamMessage = (cb) => {
    socket.on('team_message', cb);
};
    