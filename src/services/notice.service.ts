import { EventService } from "@services/event.service";
import { JobService } from "@services/job.service";
import { NoticeAttributes } from "@interfaces/noticeTypes";
import { NoticeModel } from "@models/notice.model";
import { PollService } from "./poll.service";
import { PollResponseService } from "@services/pollResponse.service";
import { HttpException } from "@exceptions/HttpException";
import { PostService } from "./posts.service";
import UserService from "./auth.service";
import { UserModel } from "@models/user.model";
import { ProfileService } from "./profile.service";
class NoticeService {
	private noticeModel = NoticeModel;
	private jobService = new JobService();
	private eventService = new EventService();
	private pollService = new PollService();
	private pollResponseService = new PollResponseService();
	private postService = new PostService();
	private profileService = new ProfileService();

	public getAllNotices = async (userId: number): Promise<any[]> => {
		try {
			const notices = await this.noticeModel.findAll({
				order: [["createdAt", "DESC"]],
			});

			const temp = await Promise.all(
				notices.map(async (item) => {
					const val = item.toJSON();
					if (val.category === "job") {
						const data = await this.jobService.getJobById(
							String(val.attachmentId),
						);
						return { ...val, data };
					} else if (val.category === "event") {
						const data = await this.eventService.getEventById(
							Number(val.attachmentId),
						);
						return { ...val, data };
					} else if (val.category === "poll") {
						const authorProfile = (await this.profileService.getProfileByUserId(val.authorId)).toJSON()
						const author = {
							name: authorProfile.user_name,
							avatar: authorProfile["user_data"]
								.user_profile_photo_path,
							designation: authorProfile.current_designation,
						};
						const isResponded =
							await this.pollResponseService.checkIfResponded(
								val.attachmentId,
								userId,
							);
						if (isResponded) {
							const response =
								await this.pollResponseService.getResponsesByPollId(
									val.attachmentId,
									userId
								);
							   
							return { ...val,author:author, type: 'response', data: response };
						} else {
							const data = await this.pollService.getPollById(
								Number(val.attachmentId),
							);

							return { ...val,author:author, type: "poll", data };
						}
					} else if (val.category === "announcement") {
						const data = await this.postService.getPostById(
							Number(val.attachmentId)
						);
						return { ...val, data };
					}
					return null;
				}),
			);
			// Filter out any potential null values from unsupported categories
			const filteredTemp = temp.filter((item) => item !== null);

			return filteredTemp;
		} catch (error) {
			throw new HttpException(500, "Error fetching notices: " + error.message);
		}
	};

	public createNotice = async (
		noticeData: Partial<NoticeAttributes>,
	): Promise<NoticeModel> => {
		try {
			const notice = await this.noticeModel.create(noticeData);
			return notice;
		} catch (error) {
			throw new HttpException(401, "Unable to create notice" + error.message);
		}
	};
	public updateNotice = async (
		NoticeId: number,
		updatedData: Partial<NoticeAttributes>,
	): Promise<[number, NoticeModel[]]> => {
		try {
			const [updatedRowsCount, updatedNotice] =
				await this.noticeModel.update(updatedData, {
					where: { id: NoticeId },
					returning: true,
				});
			return [updatedRowsCount, updatedNotice];
		} catch (error) {
			throw new HttpException(404, "Unable to update notice");
		}
	};
	public deleteNotice = async (noticeId: number): Promise<number> => {
		try {
			const deletedRowsCount = await this.noticeModel.destroy({
				where: { id: noticeId },
			});
			console.log({ deletedRowsCount });
			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(404, "Unable to delete notice");
		}
	};
	public deleteNoticebyAttachmentID = async (
		attachmentId: number,
		category: string
	): Promise<number> => {
		try {
			const deletedRowsCount = await this.noticeModel.destroy({
				where: { attachmentId: attachmentId, category: category },
			});
			console.log({ deletedRowsCount });
			return deletedRowsCount;
		} catch (error) {
			throw new Error("Unable to delete notice");
		}
	};
}

export { NoticeService };
