import { VentureAttributes } from "@interfaces/ventureTypes";
import { UserModel } from "@models/user.model";
import { VentureModel } from "@models/venture.model";

class VentureService {
    private ventureModel = VentureModel;

    public async getAllVentures(): Promise<VentureAttributes[]> {
        try {
            const ventures = await this.ventureModel.findAll({
                include: [{
                    model: UserModel,
                    as: 'owner', // Alias defined in the association
                }]
            });
            return ventures;
        } catch (error) {
            throw new Error('Error fetching ventures: ' + error.message);
        }
    }

    public async getVentureById(ventureId: number): Promise<VentureAttributes> {
        try {
            const venture = await this.ventureModel.findByPk(ventureId, {
                include: [{
                    model: UserModel,
                    as: 'owner', // Alias defined in the association
                }]
            });

            if (!venture) {
                throw new Error('Venture not found');
            }

            return venture;
        } catch (error) {
            throw new Error('Error fetching venture: ' + error.message);
        }
    }

    public async createVenture(ventureData: Partial<VentureAttributes>): Promise<VentureModel> {
        try {
            const venture = await this.ventureModel.create(ventureData);
            return venture;
        } catch (error) {
            throw new Error('Unable to create venture: ' + error.message);
        }
    }

    public async updateVenture(ventureId: number, updatedData: Partial<VentureAttributes>): Promise<[number, VentureModel[] | number]> {
        try {
            const [updatedRowsCount, updatedVenture] = await this.ventureModel.update(updatedData, { where: { id: ventureId }, returning: true });
            return [updatedRowsCount, updatedVenture];

        } catch (error) {
            throw new Error('Unable to update venture: ' + error.message);
        }
    }

    public async deleteVenture(ventureId: number): Promise<number> {
        try {
            const deletedRowsCount = await this.ventureModel.destroy({ where: { id: ventureId } });

            return deletedRowsCount;
        } catch (error) {
            throw new Error('Unable to delete venture: ' + error.message);
        }
    }
}

export { VentureService };
