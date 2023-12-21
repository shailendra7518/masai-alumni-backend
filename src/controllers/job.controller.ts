import { JobService } from '@services/job.service';
import { JobFilters, JobAttributes } from '@interfaces/jobTypes';
import { NoticeService } from '@services/notice.service';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/CustomRequest';
import { HttpException } from '@exceptions/HttpException';
import qs from 'qs'
class JobController {
	private jobService = new JobService();
	private noticeService = new NoticeService();

	public getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const jobId = req.params.id;
		try {
			const job = await this.jobService.getJobById(jobId);
			if (job) {
				res.status(200).json(job);
			} else {
				throw new HttpException(404, "Job not found");

			}
		} catch (error) {
			next(error);
		}
	}

	public getAllJobs = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			console.log(qs.parse(req.query))
			const filters: Partial<JobFilters> =(req.query);

           console.log(filters)

			const jobs = await this.jobService.getAllJobs(filters, req.user.id);
			res.status(200).json(jobs);
		} catch (error) {
			next(error)
		}
	}

	public createJob = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		const jobData = req.body;
		const id = Number(req.user.id);
		try {
			const newJob = await this.jobService.createJob({ ...jobData, publisher_id: id, isopen: true });
			this.noticeService.createNotice({
				attachmentId: newJob.toJSON().id,
				category: "job",
				authorId: id
			})
			res.status(201).json(newJob);
		} catch (error) {
			next(error);
		}
	}

	public updateJob = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		const jobId = Number(req.params.id);
		const updatedData: Partial<JobAttributes> = req.body;
		try {
			const [updatedRowsCount, updatedJobs] = await this.jobService.updateJob(jobId, updatedData, req.user.id);
			console.log(updatedRowsCount, updatedJobs)
			if (Number(updatedJobs) == 0) {
				throw new HttpException(404, 'Job not found')
			} else {
				res.status(200).json({ message: "Job is updated", updatedJobs });
			}
		} catch (error) {
			next(error)
		}
	}

	public deleteJob = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		const jobId = Number(req.params.id);
		try {
			const deletedRowsCount = await this.jobService.deleteJob(jobId, req.user.id);
			if (deletedRowsCount === 0) {
				throw new HttpException(404, 'Job not found');
			} else {
				await this.noticeService.deleteNoticebyAttachmentID(jobId,'job')
				res.status(200).json({ message: 'Job deleted successfully' });
			}
		} catch (error) {
			next(error);

		}
	}
}

export { JobController };
