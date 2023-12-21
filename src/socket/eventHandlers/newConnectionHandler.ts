import { UserModel } from "@models/user.model";
import { Server, Socket } from "socket.io";

export const newConnectionHandler = async (socket: Socket, io: Server) => {
    try {
        const userId = socket.handshake.auth.user.id;

        await UserModel.update(
            { socket_id: socket.id, isOnline: true },
            { where: { id: userId } }
        );
        // connection & online
        io.emit('userStatusUpdated', { userId, isOnline: true });
    } catch (error) {
        console.error('Error updating user model:', error);
    }
};
