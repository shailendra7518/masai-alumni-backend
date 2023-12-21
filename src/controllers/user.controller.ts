import { Response, Request} from 'express';
import { CustomRequest } from '@interfaces/CustomRequest';
import { UserModel } from '@models/user.model';
import UserService from '@services/auth.service'

class UserController {

    public userService=new UserService();

    public forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            await this.userService.requestForgotPassword(email);
            res.status(200).json({ message: 'Password reset email sent successfully' });
        } catch (error) {
            console.error('Error during forgot password request:', error);
            res.status(500).json({ error: 'An error occurred during password reset request' });
        }
    };

    public resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const {  resetToken, newPassword } = req.body;
            await this.userService.resetPassword( resetToken, newPassword);
            res.status(200).json({ message: 'Password reset successfully' });
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({ error: 'An error occurred during password reset' });
        }
    };


    public changePassword = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { oldPassword, newPassword } = req.body;
            const email = req.user.email;

            if (!oldPassword || !newPassword) {
                res.status(400).json({ error: 'Both oldPassword and newPassword are required.' });
                return;
            }

            await this.userService.changePassword(email, oldPassword, newPassword);

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
                res.status(401).json({ error: 'InvalidCredentials' });

        }
    };

    public getUserDetails = async (req: CustomRequest, res: Response): Promise<void> => {
        const id = Number(req.user.id);
		console.log("fdfffffffffffffffffffffff"+req.user)
        try {
			const user = await UserModel.findOne({ where: { id: id } });
            res.status(200).json({
                success: true,
                error: false,
              user:  user.dataValues
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


}

export default UserController;
