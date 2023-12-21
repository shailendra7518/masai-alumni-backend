import { SpotlightAttributes, CategorieType } from '@interfaces/spotLight';
import { spotLightModel } from '@models/spotlight.model';
import { HttpException } from "@exceptions/HttpException";
import { UserModel } from "@models/user.model";

class SpotlightService {

	private spotlightModel = spotLightModel;

	public getSpotlightById = async (spotlightId: number): Promise<spotLightModel | null> => {
		try {
			const spotlight = await this.spotlightModel.findByPk(spotlightId, {
				include: [
					{
						as: "posted_by",
						model: UserModel
					}
				],
			});
			return spotlight;
		} catch (error) {
			throw new HttpException(500, 'Error fetching spotlight');
		}
	};

	public getAllSpotlights = async (categories: CategorieType): Promise<spotLightModel[]> => {
		try {
			let spotlights;

			if (categories) {
				spotlights = await this.spotlightModel.findAll({
					where: {
						Categories: categories,
					},
					include: [
						{
							as: "posted_by",
							model: UserModel
						}
					],
				});
			} else {
				spotlights = await this.spotlightModel.findAll({
					include: [
						{
							as: "posted_by",
							model: UserModel
						}
					],
				});
			}

			return spotlights;
		} catch (error) {
			throw new HttpException(500, 'Unable to fetch spotlight');
		}
	};

	public createSpotlight = async (spotlightData: Partial<SpotlightAttributes>): Promise<spotLightModel> => {
		try {
			let newSpotlight = await this.spotlightModel.create(spotlightData);

			newSpotlight = await this.spotlightModel.findByPk(newSpotlight.spotlight_id);
			return newSpotlight;
		} catch (error) {
			throw new HttpException(500, 'Unable to fetch spotlight');
		}
	};

	public updateSpotlight = async (
		userId: number,
		spotlightId: number,
		updatedData: Partial<SpotlightAttributes>
	): Promise<[number, spotLightModel[]]> => {

		try {

			const spotlight = await this.spotlightModel.findOne({ where: { spotlight_id: spotlightId } });

			if (!spotlight) {
				throw new HttpException(404, 'spotlight not found');
			}

			if (spotlight.dataValues.created_by !== userId) {
				throw new HttpException(403, 'You are not authorized to update this spotlight');
			}

			const [updatedRowsCount, updatedSpotlights] = await this.spotlightModel.update(updatedData, {
				where: { spotlight_id: spotlightId },
				returning: true,
			});

			return [updatedRowsCount, updatedSpotlights];
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			} else {
				throw new HttpException(500, 'Unable to update spotlight');
			}
		}
	};

	public deleteSpotlight = async (userId: number, spotlightId: number): Promise<number> => {

		try {

			const spotlight = await this.spotlightModel.findOne({ where: { spotlight_id: spotlightId } });
			if (!spotlight) {
				throw new HttpException(404, 'spotlight not found');
			}

			if (spotlight.dataValues.created_by !== userId) {

				throw new HttpException(403, 'You are not authorized to delete this spotlight');
			}


			const deletedRowsCount = await this.spotlightModel.destroy({ where: { spotlight_id: spotlightId } });

			return deletedRowsCount;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			} else {
				throw new HttpException(500, 'Unable to delete spotlight');
			}
		}
	}

}

export { SpotlightService };
