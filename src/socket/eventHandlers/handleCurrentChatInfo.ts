import { HttpException } from "@exceptions/HttpException";
import { UserModel } from "@models/user.model";
import { Socket } from "socket.io";

const handleCurrentChatInfo = async (userId: number, chatId: number, chatType: 'private' | 'group', socket: Socket): Promise<any> => {
    try {
        const user = await UserModel.findByPk(userId);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        await UserModel.update({ current_chat_info: { current_chat_id: chatId, type: "private" } }, { where: { id: user.dataValues.id } })

        socket.emit("chat-info-updated", {
            ...user.toJSON(), current_chat_info: {
                current_chat_id: chatId,
                type: chatType,
            }
        })
    } catch (error) {
        socket.emit("error", error)
        throw new HttpException(500, "Error updating current chat info: " + error.message);
    }
}

export default handleCurrentChatInfo