import { HttpException } from "@exceptions/HttpException";
import { JobAttributes, JobFilters } from "@interfaces/jobTypes";
import { JobModel } from "@models/job.model";
import { UserModel } from "@models/user.model";
import { Op, FindOptions } from "sequelize";

class JobService {

	private jobModel = JobModel;

	public getJobById = async (jobId: string): Promise<JobModel | null> => {
		try {
			const job = await this.jobModel.findByPk(jobId, {
				include: [
					{
						as: "posted_by",
						model: UserModel
					}
				],
			});
			return job;
		} catch (error) {
			throw new HttpException(500, 'Error fetching job');
		}
	}

	public getAllJobs = async (filters: Partial<JobFilters>, userId): Promise<JobModel[]> => {
		try {

			const page = filters.page && filters.page > 0 ? filters.page : 1;
			const pageSize = filters.pageSize && filters.pageSize <= 36 ? filters.pageSize : 18;

			const filterOptions: FindOptions = {
				limit: pageSize,
				offset: (page - 1) * pageSize,
			};

			if (filters.query) {
				filterOptions.where = {
					[Op.or]: [
						{ title: { [Op.regexp]: `.*${filters.query}.*` } },
						{ company_name: { [Op.regexp]: `.*${filters.query}.*` } }
					]
				};
			}

			if (filters?.field?.working_mode) {
				filterOptions.where = {
					...filterOptions.where,
					working_mode: {
						[Op.in]: Array.isArray(filters.field.working_mode)
							? filters.field.working_mode
							: [filters.field.working_mode],
					},
				};
			}

			if (filters?.field?.work_type) {
				filterOptions.where = {
					...filterOptions.where,
					work_type: {
						[Op.in]: Array.isArray(filters.field.work_type)
							? filters.field.work_type
							: [filters.field.work_type],
					},
				};
			}


			if (filters.created_by_me) {
				filterOptions.where = {
					...filterOptions.where,
					publisher_id: userId,
				};
			}

			let orderOptions: [string, 'ASC' | 'DESC'] = ['createdAt', 'DESC'];


			if (filters.field && filters.direction) {
				orderOptions = [filters.field, filters.direction as "ASC" | "DESC"];
			}

			filterOptions.order = [orderOptions];

			const jobs = await JobModel.findAll({
				...filterOptions,
				include: [
					{
						as: "posted_by",
						model: UserModel

					}
				]
			});
			return jobs;

		} catch (error) {
			throw new HttpException(500, 'Unable to fetch jobs');
		}
	}

	public createJob = async (jobData: Partial<JobAttributes>): Promise<JobModel> => {
		try {
			let newJob = await this.jobModel.create(jobData);
			newJob = await this.jobModel.findByPk(newJob.id);
			return newJob;
		} catch (error) {
			throw new HttpException(500, 'Unable to create job');
		}
	}

	public updateJob = async (jobId: number, updatedData: Partial<JobAttributes>, userId: number): Promise<[number, JobModel[]]> => {
		try {
			// Check if the job exists and the publisher_id matches the userId
			const job = await this.jobModel.findOne({ where: { id: jobId } });

			if (!job) {
				throw new HttpException(404, 'Job not found');
			}


			if (job.dataValues.publisher_id != userId) {
				throw new HttpException(403, 'You are not authorized to update this job');
			}

			const [updatedRowsCount, updatedJobs] = await this.jobModel.update(updatedData, {
				where: { id: jobId },
				returning: true
			});

			return [updatedRowsCount, updatedJobs];
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			} else {
				throw new HttpException(500, 'Unable to update job');
			}
		}
	}

	public deleteJob = async (jobId: number, userId: number): Promise<number> => {
		try {

			const job = await this.jobModel.findOne({ where: { id: jobId } });

			if (!job) {
				throw new HttpException(404, 'Job not found');
			}

			if (job.dataValues.publisher_id !== userId) {
				throw new HttpException(403, 'You are not authorized to delete this job');
			}

			const deletedRowsCount = await JobModel.destroy({ where: { id: jobId } });

			return deletedRowsCount;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			} else {
				throw new HttpException(500, 'Unable to delete job');
			}
		}
	}

}

export { JobService };
