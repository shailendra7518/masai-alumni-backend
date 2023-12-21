import { DataTypes, Model } from "sequelize";
import sequelize from "@configs/db";
import { ConnectionAttributes } from "@interfaces/connectionTypes";
import { UserModel } from "./user.model";
import { privateMessageModel} from "./privateMessage.model"; // Import your MessageModel

class ConnectionModel extends Model<ConnectionAttributes> implements ConnectionAttributes {
    public id!: number;
    public user1Id!: number;
    public user2Id!: number;
    public status!: 'pending' | 'accepted' | 'rejected';
    public lastMessage!: number;
	public User2: any;
	public User1: any;
}

ConnectionModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    lastMessage: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "Connection",
    tableName: "connections",
    timestamps: true
});

ConnectionModel.belongsTo(UserModel, { foreignKey: 'user1Id', as: 'User1', targetKey: "id" });
ConnectionModel.belongsTo(UserModel, { foreignKey: 'user2Id', as: 'User2', targetKey: "id" });

ConnectionModel.belongsTo(privateMessageModel, { foreignKey: 'lastMessage', as: 'LastMessageInfo', targetKey: 'id' });

export { ConnectionModel };
