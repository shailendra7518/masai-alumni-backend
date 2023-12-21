import { Request, Response } from 'express';
import { VentureService } from '@services/venture.service';
import { VentureAttributes } from '@interfaces/ventureTypes';

class VentureController {
    private ventureService = new VentureService();

    public getAllVentures = async (req: Request, res: Response): Promise<void> => {
        try {
            const ventures: VentureAttributes[] = await this.ventureService.getAllVentures();
            res.status(200).json({
                success: true,
                error: false,
                ventures,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: true,
                success: false,
                message: 'Something went wrong',
            });
        }
    };
    public getVentureById = async (req: Request, res: Response): Promise<void> => {
        const ventureId: number = Number(req.params.id);
        try {
            const venture: VentureAttributes | null = await this.ventureService.getVentureById(ventureId);
            if (!venture) {
                res.status(404).json({ message: 'Venture not found' });
            } else {
                res.status(200).json({
                    success: true,
                    error: false,
                    venture,
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: true,
                message: error.message,
            });
        }
    };

    public createVenture = async (req: Request, res: Response): Promise<void> => {
        const ventureData: Partial<VentureAttributes> = req.body;
        try {
            const venture = await this.ventureService.createVenture(ventureData);
            res.status(201).json({
                success: true,
                error: false,
                message: 'Added venture',
                venture,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: true,
                success: false,
                message: 'Something went wrong',
            });
        }
    };

    public updateVenture = async (req: Request, res: Response): Promise<void> => {
        const ventureId: number = Number(req.params.id);
        const updatedData: Partial<VentureAttributes> = req.body;
        try {
            const [updatedRowsCount, updatedVenture] = await this.ventureService.updateVenture(ventureId, updatedData);
            if (updatedVenture === 0) {
                res.status(404).json(
                    {
                        success: false,
                        error: true,
                        message: 'Venture not found'
                    }
                );
            } else {
                console.log({
                    updatedRowsCount, updatedVenture
                })
                res.status(200).json({
                    success: true,
                    error: false,
                    message: 'Updated venture',
                    venture: updatedVenture,
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: true,
                message: error.message,
            });
        }
    };

    public deleteVenture = async (req: Request, res: Response): Promise<void> => {
        const ventureId: number = Number(req.params.id);
        try {
            const deletedRowsCount = await this.ventureService.deleteVenture(ventureId);
            if (deletedRowsCount === 0) {
                res.status(404).json({
                    success: false,
                    error: true,
                    message: 'Venture not found'
                });
            } else {
                res.json({
                    success: true,
                    error: false,
                    message: 'Venture deleted successfully'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: true,
                message: error.message
            });
        }
    };
}

export default VentureController;
