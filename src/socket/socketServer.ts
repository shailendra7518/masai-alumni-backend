import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import configureSocketAuth from '../middlewares/socketAuth.middleware';
import { newConnectionHandler } from './eventHandlers/newConnectionHandler';
import { getInitailData } from './eventHandlers/getInitailData';
import { disconnectHandler } from './eventHandlers/disconnectHandler';
import { setSocketServerInstance, setUserSocket } from './socketStore';
import handleCurrentChatInfo from './eventHandlers/handleCurrentChatInfo';

export const registerSocketServer = (app, server: HTTPServer) => {
	const io = new SocketIOServer(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	});

	setSocketServerInstance(io);

	configureSocketAuth(app, io);

	io.on("connection", (socket) => {
		setUserSocket(socket)
		newConnectionHandler(socket, io);
		// emitOnlineUser();

		// listen for direct message
		// socket.on("direct-message", (data) => {
		// 	directMessageHandler(socket, data);
		// });

		// direct-chat-history
		// socket.on("direct-chat-history", (data) => {
		// 	directChatHistoryHandler(socket, data);
		// });

		// room -create
		// socket.on("room-create", () => {
		// 	roomCreateHandler(socket);
		// });

		// joining room
		// socket.on("room-join", (data) => {
		// 	roomJoinHandler(socket, data);
		// });

		// leave room
		// socket.on("room-leave", (data) => {
		// 	roomLeaveHandler(socket, data);
		// });

		// webRTC conn initializer
		// socket.on("conn-init", (data) => {
		// 	roomInitalizeConnectionHandler(socket, data)
		// });

		// listen signal connection
		// socket.on("conn-signal", (data) => {
		// 	roomSignalingDataHandler(socket, data);
		// });

		socket.on("getInitialData", async () => {
			try {
				const userId = socket.handshake.auth.user.id;
				await getInitailData(userId, 'initialData', io);
			} catch (error) {
				console.error('Error emitting initial data:', error);
			}
		});

		// socket.on("send-connection-request", async (data) => {
		// 	const user1Id = socket.handshake.auth.user.id;
		// 	sendRequest(data, user1Id, io, socket)
		// });


		// socket.on("accept-connection-request", async (data) => {
		// 	const user1Id = socket.handshake.auth.user.id;
		// 	acceptRequest(data, user1Id, io, socket)
		// });

		// socket.on("reject-connection-request", async (data) => {
		// 	const user1Id = socket.handshake.auth.user.id;
		// 	rejectRequest(data, user1Id, io, socket)
		// });


		// // chat info update

		socket.on("update-chat-info", async (data) => {
			const userId = socket.handshake.auth.user.id;
			const { chatId, chatType } = data
			handleCurrentChatInfo(userId, chatId, chatType, socket)
		})

		// socket.on("get-all-chats", async (data) => {
		// 	const { chatId, chatType } = data
		// 	console.log("getting chats" + data)
		// 	getAllChats(chatId, chatType, socket)
		// })

		// socket.on("send-message", async (data) => {
		// 	const userId = socket.handshake.auth.user.id;
		// 	const {
		// 		receiverId,
		// 		messageType,
		// 	} = data
		// 	console.log({ data })
		// 	SendMessage(receiverId, messageType, socket, data, io, userId)
		// })


		socket.on("disconnect", () => {
			disconnectHandler(socket, io);
		});
	});
	// setInterval(() => {
	// 	// emitOnlineUser();
	// }, 10000);
};
