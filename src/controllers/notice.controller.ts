import { CustomRequest } from '@interfaces/CustomRequest';
import { NoticeService } from '@services/notice.service';
import { Request, Response } from 'express';


class NoticeController {
    private noticeService = new NoticeService()

    public getAllNotices = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const notices = await this.noticeService.getAllNotices(req.user.id)
            res.status(200).json({
                success: true,
                error: false,
                notices
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error: true,
                success: false,
                message: "something went wrong"
            })
        }

    }

    public createNotice = async (req: Request, res: Response): Promise<void> => {
        const noticeData = req.body
        try {
            const notice = await this.noticeService.createNotice(noticeData)
            res.status(201).json({
                success: true,
                error: false,
                message: "added notice",
                notice
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error: true,
                success: false,
                message: "something went wrong"
            })
        }
    }

    public updateNotice = async (req: Request, res: Response): Promise<void> => {
        const noticeId = Number(req.params.id);
        const updatedData = req.body
        try {
            const [updatedRowsCount, updatedNotice] = await this.noticeService.updateNotice(noticeId, updatedData)
            if (updatedRowsCount === 0) {
                res.status(404).json({ message: 'Notice not found' });
            } else {
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "updated notice",
                    notice: updatedNotice
                })
            }
        } catch (error) {
            res.status(500).json({
                success: true,
                error: false,
                message: error.message
            });
        }
    }

    public deleteNotice = async (req: Request, res: Response): Promise<void> => {
        const noticeId = Number(req.params.id);
        try {
            console.log({ noticeId })
            const deletedRowsCount = await this.noticeService.deleteNotice(noticeId);
            if (deletedRowsCount === 0) {
                res.status(404).json({ message: 'Notice not found' });
            } else {
                res.json({ message: 'Notice deleted successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default NoticeController