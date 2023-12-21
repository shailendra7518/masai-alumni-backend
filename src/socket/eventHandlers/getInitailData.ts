import { UserModel } from "@models/user.model";
import { ConnectionService } from "@services/connection.service";
import { NotificationService } from "@services/notification.service";
import { Server } from "socket.io";


export const getInitailData = async (userId: string, eventName: string, io: Server) => {
    const connectionService = new ConnectionService();
    const notificationService = new NotificationService();
    try {
        const user = (await UserModel.findOne({ where: { id: userId } })).toJSON();
        if (user && user.socket_id) {
            const acceptedConnections = await connectionService.getAllConnections(user.id, { status: "accepted" });
            const pendingConnectionsSentbyMe = await connectionService.getAllConnections(user.id, { status: "pending", sentby: 'me' });
            const pendingConnectionRequests = await connectionService.getAllConnections(user.id, { status: "pending" });
            const notifications = await notificationService.getAllNotifications(user.id);
            io.to(user.socket_id).emit(eventName, { connections: { acceptedConnections, pendingConnectionsSentbyMe, pendingConnectionRequests }, notifications });
        } else {
            console.error(`User ${userId} is not currently connected or socket ID not found.`);
        }
    } catch (error) {
        console.error(`Error emitting to user ${userId}:`, error);
    }
};
