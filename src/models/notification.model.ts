import { DataTypes, Model } from 'sequelize';
import sequelize from '@configs/db';
import { NotificationAttributes } from '@interfaces/notificationType';

class NotificationModel extends Model<NotificationAttributes> implements NotificationAttributes {
  public id!: number;
  public receiverId!: number;
  public type!: 'connection_request_accepted' | 'connection_request_received' | "new_message";
  public status!: 'delivered' | 'seen';
  public message?: string;
  public linkedTo?: string;
  public linkedToId?: number;
  public authorId?: number;

  static associate(models: any) {
    NotificationModel.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
    NotificationModel.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
  }
}

NotificationModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('connection_request_accepted', 'connection_request_received', 'new_message'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('delivered', 'seen'),
      allowNull: false,
      defaultValue: 'delivered',
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedToId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
  }
);

export { NotificationModel };
