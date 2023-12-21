import { Request, Response, NextFunction } from 'express';
import { SpotlightService } from '@services/spotlight.service';
import { HttpException } from '@exceptions/HttpException';
import { CustomRequest } from '@interfaces/CustomRequest';
import { CategorieType } from '@interfaces/spotLight';

class SpotlightController {
	private spotlightService = new SpotlightService();

	public getSpotlightById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const spotlightId = Number(req.params.id);
			const spotlight = await this.spotlightService.getSpotlightById(spotlightId);

			if (spotlight) {
				res.status(200).json(spotlight);
			} else {
				throw new HttpException(404, "Spotlight not found");
			}
		} catch (error) {
			next(error);
		}
	};


	public getAllSpotlights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { category } = req.query;
			const categories: CategorieType = category as CategorieType;
			const spotlights = await this.spotlightService.getAllSpotlights(categories);
			res.status(200).json(spotlights);
		} catch (error) {
			next(error);
		}
	};

	public createSpotlight = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const spotlightData = req.body;
			const id = Number(req.user.id);

			const newSpotlight = await this.spotlightService.createSpotlight({ ...spotlightData, created_by: id });
			res.status(201).json(newSpotlight);
		} catch (error) {
			next(error);
		}
	};

	public updateSpotlight = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = Number(req.user.id);
			const spotlightId = Number(req.params.id);
			const updatedData = req.body;

			const [updatedRowsCount, updatedSpotlights] = await this.spotlightService.updateSpotlight(
				userId,
				spotlightId,
				updatedData
			);

			if (Number(updatedSpotlights) == 0) {
				throw new HttpException(404, 'Spotlight not found or Unauthorized: You are not the creator of this spotlight');
			} else {
				res.status(200).json({ message: 'Spotlight is updated', updatedSpotlights });
			}
		} catch (error) {
			next(error);
		}
	};

	public deleteSpotlight = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {

			const spotlightId = Number(req.params.id);

			const deletedRowsCount = await this.spotlightService.deleteSpotlight(req.user.id, spotlightId);

			if (deletedRowsCount === 0) {
				throw new HttpException(404, 'Spotlight not found');
			} else {
				res.status(200).json({ message: 'Spotlight deleted successfully' });
			}
		} catch (error) {
			next(error);
		}
	};
}

export { SpotlightController };
