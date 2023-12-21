import { GroupService } from '@services/group.service';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/CustomRequest';
import { HttpException } from '@exceptions/HttpException';

class GroupController {
    private groupService = new GroupService();

    public createGroup = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const groupData = req.body;
        const userId = Number(req.user.id);
        try {
            const newGroup = await this.groupService.createGroup(groupData, userId);
            res.status(201).json(newGroup);
        } catch (error) {
            next(error);
        }
    }

    public addUserToGroup = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const groupData = req.body;
        const userId = Number(req.user.id);
        try {
            const newGroup = await this.groupService.addUserToGroup(
                groupData.groupId,
                userId
            );
            res.status(201).json(newGroup);
        } catch (error) {
            next(error);
        }
    }

    public editGroup = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const groupId = Number(req.params.id);
        const groupData = req.body;
        const userId = Number(req.user.id);

        try {
            const [updatedRowsCount, updatedgroups] = await this.groupService.editGroup(
                groupId,
                groupData,
                userId

            );
            if (Number(updatedgroups) == 0) {
                throw new HttpException(404, 'Group not found')
            } else {
                res.status(200).json({ message: "Group is updated", updatedgroups });
            }
        } catch (error) {
            next(error);
        }
    }

    public deleteGroup = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const groupId = Number(req.params.id);
        const userId = Number(req.user.id);

        try {
            const deletedRowsCount = await this.groupService.deleteGroup(groupId, userId);
            if (deletedRowsCount === 0) {
                throw new HttpException(404, 'Group not found');
            } else {
                res.status(200).json({ message: 'Group deleted successfully' });
            }
        } catch (error) {
            next(error);
        }
    }

    public removeUserFromGroupByAdmin = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const groupId = Number(req.params.id);
        const { userId } = req.body;
        const currentUserId = Number(req.user.id);

        try {
            await this.groupService.removeUserFromGroupByAdmin(groupId, userId, currentUserId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public leaveGroup = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const groupId = Number(req.params.id);
        const userId = Number(req.user.id);
        try {
            await this.groupService.leaveGroup(groupId, userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public makeAdmin = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const groupId = Number(req.params.id);
        const { userIdToAdd } = req.body;
        const currentUserId = Number(req.user.id);
        try {
            await this.groupService.makeAdmin(groupId, userIdToAdd, currentUserId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public removeAdmin = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const groupId = Number(req.params.id);
        const { userIdToRemove } = req.body;
        const currentUserId = Number(req.user.id);
        try {
            await this.groupService.removeAdmin(groupId, userIdToRemove, currentUserId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export { GroupController };
