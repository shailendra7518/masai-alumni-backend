import { AddressModel } from "@models/address.model";
import { AddressAttributes } from "@interfaces/addressTypes";
import { HttpException } from "@exceptions/HttpException";
import { ProfileModel } from "@models/profile.model";
class AddressService {
	private addressModel = AddressModel;
	private profileModel = ProfileModel;

	public createAddress = async (
		userId: number,
		addressData: AddressAttributes,
	): Promise<AddressModel> => {
		try {
			const newAddress: AddressModel = await AddressModel.create({
				...addressData,
				user_id: userId,
			});

			const addresses = await this.addressModel.findAll({
				where: { user_id: userId },
			});

			if (addresses && addresses.length > 0) {
				const address = addresses.filter((e) => {
					e = e.toJSON();
					return e.type.toLowerCase() === "permanent";
				});

				if (address.length > 0) {
					await this.profileModel.update(
						{
							city: address[0].dataValues.city,
						},
						{ where: { user_id: userId } },
					);
				} else {
					await this.profileModel.update(
						{
							city: null,
						},
						{ where: { user_id: userId } },
					);
				}
			} else {
				await this.profileModel.update(
					{
						city: null,
					},
					{ where: { user_id: userId } },
				);

				throw new HttpException(
					404,
					"address record not found after creating",
				);
			}

			return newAddress;
		} catch (error) {
			throw new HttpException(500, "Error creating address");
		}
	};

	public updateAddress = async (
		userId: number,
		addressId: number,
		updatedAddressData: AddressAttributes,
	): Promise<AddressModel> => {
		try {
			const address = await AddressModel.findOne({
				where: { id: addressId, user_id: userId },
			});

			if (address) {
				address.set(updatedAddressData);
				await address.save();

				const addresses = await this.addressModel.findAll({
					where: { user_id: userId },
				});

				if (addresses && addresses.length > 0) {
					const address = addresses.filter((e) => {
						e = e.toJSON();
						return e.type.toLowerCase() === "permanent";
					});

					if (address.length > 0) {
						await this.profileModel.update(
							{
								city: address[0].dataValues.city,
							},
							{ where: { user_id: userId } },
						);
					} else {
						await this.profileModel.update(
							{
								city: null,
							},
							{ where: { user_id: userId } },
						);
					}
				} else {
					await this.profileModel.update(
						{
							city: null,
						},
						{ where: { user_id: userId } },
					);

					throw new HttpException(
						404,
						"address record not found after creating",
					);
				}

				return address;
			} else {
				return null;
			}
		} catch (error) {
			throw new HttpException(500, "Error updating address");
		}
	};
	public deleteAddress = async (
		userId: number,
		addressId: number,
	): Promise<number> => {
		try {
			const deletedRowsCount: number = await AddressModel.destroy({
				where: { id: addressId, user_id: userId },
			});

			const addresses = await this.addressModel.findAll({
				where: { user_id: userId },
			});

			if (addresses && addresses.length > 0) {
				const address = addresses.filter((e) => {
					e = e.toJSON();
					return e.type.toLowerCase() === "permanent";
				});

				if (address && address.length > 0) {
					await this.profileModel.update(
						{
							city: address[0].dataValues.city,
						},
						{ where: { user_id: userId } },
					);
				} else {
					await this.profileModel.update(
						{
							city: null,
						},
						{ where: { user_id: userId } },
					);
				}
			} else {
				await this.profileModel.update(
					{
						city: null,
					},
					{ where: { user_id: userId } },
				);

				
			}

			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(500, "Error deleting address");
		}
	};
}

export default AddressService;
