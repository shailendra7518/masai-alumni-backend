
import crypto from 'crypto';


class AuthUtils {



    public static async comparePasswords(inputPassword: string, storedPassword: string): Promise<boolean> {
        return inputPassword === storedPassword;
    }

    public static async generateResetToken(): Promise<string> {
        return crypto.randomBytes(20).toString('hex');
    }
    
}

export default AuthUtils;
