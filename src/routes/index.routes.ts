import EventRoute from "./event.route";
import EventParticipantRoute from "./eventParticipant.route";
import FeedbackRoute from "./feedback.route";
import JobRoute from "./job.route";
import MentorRoutes from "./mentor.route";
import NoticeRoute from "./notice.route";
import PollRoute from "./poll.route";
import PollResponseRoute from "./pollResponse.route";
import ProfileRoute from "./profile.route";
import QuestionRoute from "./question.route";
import UserRoute from "./user.route";
import VentureRoute from "./venture.route";
import SpotlightRoute from "./spotLight.route";
import AlumniRoute from "./alumni.route";
import PostRoute from "./post.route"
import awsRoute from "./aws.route";
import ConnectionRoute from "./connection.route";
import PrivateMessageRoute from "./privateMessage.route";
import GroupRoute from "./group.route"
import GroupMessageRoute from "./groupMessage.route";
import HOFRoute from "./HOF.routes";
export const Routes = [
	new JobRoute(),
	new EventRoute(),
	new NoticeRoute(),
	new UserRoute(),
	new EventParticipantRoute(),
	new PollRoute(),
	new QuestionRoute(),
	new PollResponseRoute(),
	new VentureRoute(),
	new SpotlightRoute(),
	new MentorRoutes(),
	new FeedbackRoute(),
	new ProfileRoute(),
	new AlumniRoute(),
	new PostRoute(),
	new awsRoute(),
	new ConnectionRoute(),
	new PrivateMessageRoute(),
	new GroupRoute(),
	new GroupMessageRoute(),
	new HOFRoute()
]

// event - new_group_msg -- frontend - group_id,msg ----  goes to backend :::: if joined then give me the msg else error