import { DataTypes, Model } from "sequelize";
import sequelize from "@configs/db";
import { NoticeAttributes, NoticeCategory } from "@interfaces/noticeTypes";

class NoticeModel extends Model<NoticeAttributes> implements NoticeAttributes {
    public id!: number
    public authorId!: number
    public category!: NoticeCategory;
    public attachmentId!: number

    static associate(models: any) {
        NoticeModel.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
        NoticeModel.belongsTo(models.Attachment, { foreignKey: 'attachmentId', as: 'attachment' });
    }
}

NoticeModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    attachmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Notice",
    tableName: "notices"
})

export { sequelize, NoticeModel }
