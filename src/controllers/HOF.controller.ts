import { Request, Response, NextFunction } from 'express';
import { HOFService } from '@services/HOF.service';
import { HttpException } from '@exceptions/HttpException';
import { CustomRequest } from '@interfaces/CustomRequest';

class HOFController {
    private hofService = new HOFService();

    public createHOF = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const hofData = req.body;
            const id = Number(req.user.id);

            const newHOF = await this.hofService.createHOF({...hofData, created_by:id});

            res.status(201).json({ success: true, data: newHOF });
        } catch (error) {
            next(error);
        }
    };

    public getAllHOFEntries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const hofEntries = await this.hofService.getAllHOFEntries();

            res.status(200).json({ success: true, data: hofEntries });
        } catch (error) {
            next(error);
        }
    };

    public getHOFEntryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const hofId = Number(req.params.id);
            const hofEntry = await this.hofService.getHOFEntryById(hofId);

            if (!hofEntry) {
                throw new HttpException(404, 'HOF entry not found');
            }

            res.status(200).json({ success: true, data: hofEntry });
        } catch (error) {
            next(error);
        }
    };

    public updateHOFEntry = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const hofId = Number(req.params.id);
            const id = Number(req.user.id);

            const { image, title, subtitle, userId } = req.body;

            const updatedData = {
                image,
                title,
                subtitle,
                userId,
            };

            const [updatedRowsCount, updatedHOFEntries] = await this.hofService.updateHOFEntry(hofId, id, updatedData);

            if (Number(updatedRowsCount) == 0) {
                throw new HttpException(404, 'HOF entry not found or Unauthorized');
            } else {
                res.status(200).json({ message: 'HOF entry updated successfully', updatedHOFEntries });
            }
        } catch (error) {
            next(error);
        }
    };

    public deleteHOFEntry = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const hofId = Number(req.params.id);

            const deletedRowsCount = await this.hofService.deleteHOFEntry(req.user.id,hofId);

            if (deletedRowsCount === 0) {
                throw new HttpException(404, 'HOF entry not found');
            } else {
                res.status(200).json({ message: 'HOF entry deleted successfully' });
            }
        } catch (error) {
            next(error);
        }
    };
}

export { HOFController };
