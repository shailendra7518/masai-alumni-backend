import { UserModel } from "@models/user.model";
import { Server, Socket } from "socket.io";

export const disconnectHandler = async (socket: Socket, io: Server) => {
    try {
        const userId = socket.handshake.auth.user.id;

        await UserModel.update(
            { socket_id: null, isOnline: false },
            { where: { id: userId } }
        );

        console.log({ log: "user disconnected" });
        io.emit('userStatusUpdated', { userId, isOnline: false });
    } catch (error) {
        // Handle error
        console.error('Error updating user model:', error);
    }
};