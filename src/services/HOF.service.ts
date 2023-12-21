import { HOFModel } from '@models/HOF.model';
import { HOFAttributes } from '@interfaces/HOF.interface';
import { HttpException } from '@exceptions/HttpException';
import { UserModel } from '@models/user.model';

class HOFService {

    private hofModel = HOFModel;

    public createHOF = async (hofData: Partial<HOFAttributes>): Promise<HOFModel> => {
        try {
            const newHOF = await this.hofModel.create(hofData);

            const createdHOF = await this.hofModel.findByPk(newHOF.Id,{
                include: [
                    {
                      model: UserModel,
                      as: 'HOF_userCreatedBy',
                      attributes: ['id', 'name', 'email', 'phone_number', 'role'],
                      
                    },
                    {
                        model: UserModel,
                        as: 'HOF_user',
                        attributes: ['id', 'name', 'email', 'phone_number', 'role'],
                        
                    }
                ],
            });

            return createdHOF;
        } catch (error) {
            throw new HttpException(500, 'Unable to create HOF entry');
        }
    };

    public getAllHOFEntries = async (): Promise<HOFModel[]> => {
        try {
            const hofEntries = await this.hofModel.findAll({
                include: [
                    {
                      model: UserModel,
                      as: 'HOF_userCreatedBy',
                      attributes: ['id', 'name', 'email', 'phone_number', 'role'],
                      
                    },
                    {
                        model: UserModel,
                        as: 'HOF_user',
                        attributes: ['id', 'name', 'email', 'phone_number', 'role'],
                        
                    }
                ],
            });

            return hofEntries;
        } catch (error) {
            throw new HttpException(500, 'Unable to fetch HOF entries');
        }
    };

    public getHOFEntryById = async (hofId: number): Promise<HOFModel | null> => {
        try {
            const hofEntry = await this.hofModel.findByPk(hofId,{
                include: [
                    {
                      model: UserModel,
                      as: 'HOF_userCreatedBy',
                      attributes: ['id', 'name', 'email', 'phone_number', 'role'],
                      
                    },
                    {
                        model: UserModel,
                        as: 'HOF_user',
                        attributes: ['id', 'name', 'email', 'phone_number', 'role'],
                        
                    }
                ],
            });

            return hofEntry || null;
        } catch (error) {
            throw new HttpException(500, 'Error fetching HOF entry');
        }
    };

    public updateHOFEntry = async (
        hofId: number,
        id: number,
        updatedData: Partial<HOFAttributes>
    ): Promise<[number, HOFModel[]]> => {
        try {

			const hof = await this.hofModel.findOne({ where: { Id: hofId } });

			if (!hof) {
				throw new HttpException(404, 'HOF not found');
			}


			if (hof.dataValues.created_by != id) {
				throw new HttpException(403, 'You are not authorized to update this HOF');
			}

            const [updatedRowsCount, updatedHOFEntries] = await HOFModel.update(updatedData, {
                where: { Id: hofId },
                returning: true,
            });

            return [updatedRowsCount, updatedHOFEntries];
        } catch (error) {
            if (error instanceof HttpException) {
				throw error;
			} else {
				throw new HttpException(500, 'Unable to update HOF');
			}        }
    };

    public deleteHOFEntry = async (id: number,hofId: number): Promise<number> => {
        try {

            const hof = await this.hofModel.findOne({ where: { Id: hofId } });

			if (!hof) {
				throw new HttpException(404, 'HOF not found');
			}


			if (hof.dataValues.created_by != id) {
				throw new HttpException(403, 'You are not authorized to update this HOF');
			}
            
            const deletedRowsCount = await this.hofModel.destroy({ where: { Id: hofId } });

            return deletedRowsCount;
        } catch (error) {
            if (error instanceof HttpException) {
				throw error;
			} else {
				throw new HttpException(500, 'Unable to update job');
			}        
        }
    };
}

export { HOFService };
