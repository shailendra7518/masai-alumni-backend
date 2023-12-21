import { GroupMembershipAttributes, GroupAttributes } from '@interfaces/groupTypes';
import { GroupModel } from '@models/group.model';
import { GroupMembershipModel } from '@models/groupMembership.model';
import { HttpException } from "@exceptions/HttpException";
import { UserModel } from '@models/user.model';
class GroupService {

  private groupModel = GroupModel;
  private groupMembershipModel = GroupMembershipModel;

  public createGroup = async (groupData: Partial<GroupAttributes>, userId: number): Promise<GroupModel> => {

    try {
      let newGroup = await this.groupModel.create({
        ...groupData,
        admins: [userId], // The creator is the initial 
        membersCount: 1, // Initial members count is the creator

      });

      newGroup = await this.groupModel.findByPk(newGroup.id,{
        include: [
          {
            model: UserModel,
            as: 'admins',
            attributes: ['id', 'name', 'email', 'phone_number'], // Adjust attributes based on your needs
            through: { attributes: [] },
          },
        ],
      })

      await this.addUserToGroup(newGroup.dataValues.id, userId);

      return newGroup;
    }
    catch (error) {
      throw new HttpException(500, 'Unable to create Group');

    }
  }

  public editGroup = async (groupId: number, updatedData: Partial<GroupAttributes>, userId: number): Promise<[number, GroupModel[]]> => {
    try {
      const group = await this.groupModel.findByPk(groupId);

      if (!group) {
        throw new HttpException(404, 'Group not found');
      }
      if (!group.dataValues.admins.includes(userId)) {
        throw new HttpException(403, 'You are not authorized to edit this group only group admin can do this');

      }

      const [updatedRowsCount, updatedJobs] = await this.groupModel.update(updatedData, {
        where: { id: groupId },
        returning: true
      });

      return [updatedRowsCount, updatedJobs];
    }
    catch (error) {

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, 'Unable to update group');
      }

    }
  }

  public deleteGroup = async (groupId: number, userId: number): Promise<number> => {
    try {
      const group = await this.groupModel.findByPk(groupId);

      if (!group) {
        throw new HttpException(404, 'Group not found');
      }
      if (!group.dataValues.admins.includes(userId)) {
        throw new HttpException(403, 'You are not authorized to delete this group only group admin can do this');

      }

      const deletedRowsCount = await this.groupModel.destroy({
        where: { id: groupId },
      });

      return deletedRowsCount;
    }
    catch (error) {

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, 'Unable to delete group');
      }

    }



  }

  public addUserToGroup = async (groupId: number, userId: number): Promise<GroupMembershipModel> => {
    try {

      let membership = await this.groupMembershipModel.create({
        groupId,
        userId,
        status: 'accepted', // Assuming added users are automatically accepted
      });
      membership = await this.groupMembershipModel.findByPk(membership.id)
      await this.updateMembersCount(groupId);

      return membership;
    }
    catch (error) {
      console.log(error)
      throw new HttpException(500, 'Unable to add user to group');

    }
  }

  public removeUserFromGroupByAdmin = async (groupId: number, userId: number, currentUserId: number): Promise<void> => {
    try {
      const group = await this.groupModel.findByPk(groupId);
      const groupMembership = await this.groupMembershipModel.findOne({ where: { userId: userId } });

      if (!group) {
        throw new HttpException(404, 'group not found');
      }
      if (!groupMembership) {
        throw new HttpException(404, 'group member not found');
      }


      if (!group.dataValues.admins.includes(currentUserId)) {
        throw new HttpException(400, 'You do not have permission to make someone an admin.');
      }
      await GroupMembershipModel.destroy({
        where: { groupId, userId },
      });

      // Update membersCount in the group
      await this.updateMembersCount(groupId)
    }
    catch (error) {
      throw new HttpException(500, 'Unable to remove user from group');

    }
  }

  public leaveGroup = async (groupId: number, userId: number): Promise<void> => {

    try {
      const group = await this.groupModel.findByPk(groupId);

      if (!group) {
        throw new HttpException(404, 'group not found');
      }


      if (group.dataValues.admins.length === 1 && group.dataValues.admins.includes(userId)) {
        // Last admin, don't allow leaving
        throw new HttpException(400, 'Cannot leave group. You are the only admin.');
      }

      await GroupMembershipModel.destroy({
        where: { groupId, userId },
      });

      // Update membersCount in the group
      await this.updateMembersCount(groupId)
    }
    catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, 'Unable to leave group');
      }
    }
  }

  public makeAdmin = async (groupId: number, userIdToAdd: number, currentUserId: number): Promise<void> => {
    try {
      const group = await this.groupModel.findByPk(groupId);
      const groupMembership = await this.groupMembershipModel.findOne({ where: { userId: userIdToAdd } });

      if (!group) {
        throw new HttpException(404, 'group not found');
      }
      if (!groupMembership) {
        throw new HttpException(404, 'group member not found');
      }


      if (!group.dataValues.admins.includes(currentUserId)) {
        throw new HttpException(400, 'You do not have permission to make someone an admin.');
      }

      await group.update({
        admins: [...group.dataValues.admins, userIdToAdd],
      });
      console.log(group.dataValues)
    }
    catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, 'Unable to make admin ');
      }
    }

  }

  public removeAdmin = async (groupId: number, userIdToRemove: number, currentUserId: number): Promise<void> => {
    try {
      const group = await this.groupModel.findByPk(groupId);
      const groupMembership = await this.groupMembershipModel.findOne({ where: { userId: userIdToRemove } });

      if (!group) {
        throw new HttpException(404, 'group not found');
      }

      if (!groupMembership) {
        throw new HttpException(404, 'group member not found');
      }

      if (!group.dataValues.admins.includes(currentUserId)) {
        throw new HttpException(400, 'You do not have permission to remove an admin.');
      }

      const updatedAdmins = group.dataValues.admins.filter(adminId => adminId !== userIdToRemove);

      await group.update({
        admins: updatedAdmins,
      })
      console.log(group.dataValues)
    }
    catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(500, 'Unable to remove admin');
      }
    }

  }

  private async updateMembersCount(groupId: number): Promise<void> {
    const membersCount = await this.groupMembershipModel.count({
      where: { groupId, status: 'accepted' },
    });

    await this.groupModel.update({ membersCount }, {
      where: { id: groupId },
    });
  }

  public updateLastMessage = async (groupId: number, messageId: number): Promise<number> => {
    try {
      const [updateCount] = await this.groupModel.update({ lastMessage: messageId }, { where: { id: groupId }, returning: true })
      return updateCount
    } catch (error) {
      console.log(error)
      throw new Error(`Error updating last message for connection: ${error.message}`);
    }
  }
}

export { GroupService };
