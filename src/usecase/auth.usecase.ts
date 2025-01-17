import IAuth from "../entities/auth.entity";
import IUser from "../entities/user.entity";
import { ErrorCode } from "../enums/errorCodes.enum";
import { sendEmail } from "../frameworks/utils/emailService";
import verifyIdToken from "../frameworks/utils/googleAuthVerifyToken";
import { signJWT } from "../frameworks/utils/jwt.utils";
import { generateOTP } from "../frameworks/utils/otpGenerator.utils";
import { IAuthRepository } from "../interfaces/repositories/IAuth.repository";
import { IAuthUsecase } from "../interfaces/usecase/IAuth.usecase";
import bcrypt from "bcrypt";

export class AuthUsecase implements IAuthUsecase {
  private authRepository: IAuthRepository;
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async getAuth(email: string): Promise<IAuth> {
    try {
      const auth = await this.authRepository.emailAuth(email);
      return auth
    } catch (error) {
      throw error
    }
  }
  async userSigninGoogle(data: string):Promise<{accessToken: string,refreshToken:string}> {

    const payload = await verifyIdToken(data);



    let user = await this.authRepository.checkUser(payload.email as string);
    if (!user) {
      const data: IUser = { email: payload.email, userid: payload.email,password:payload.sub,username: payload.email,profileimg:payload.picture} as unknown as IUser
      await this.authRepository.create(data,true) as IUser;
      user = await this.authRepository.checkUser(payload.email as string);

    }
 
    
    if(user){
      const authData: IAuth = { email: payload.email } as IAuth;      

      const payloadJWT = { id: user._id, email: user.email, user_id: user.userid };
      const token = signJWT(payloadJWT, 8);
  
       await this.authRepository.login(authData, token.refreshToken);
       return token
    }else{
      throw new Error(ErrorCode.RESOURCE_NOT_FOUND)
    }


  }

  logoutUser(): string {
    throw new Error("Method not implemented.");
  }
  async verifyResetPassword(email: string, otp: string, newpassword: string):Promise<string> {
    try {
      const data = await this.verifyOtp(email, otp);
      if (!data) {
        throw new Error("OTP_VERIFICATION_ERROR");
      }
      await this.authRepository.changePassword(email, newpassword);
      return "Reset Password Successfull";
    } catch (error) {
      throw error;
    }
  }
  async resetPassword(email: string): Promise<string> {
    try {
      // Sending OTP
      const user = await this.getAuth(email);
      if(!user)throw new Error(ErrorCode.USER_NOT_FOUND)
      await this.sendOtpByEmail(email, "Travello:Reset Password");
      return "OTP Sent Successfully";
    } catch (error) {
      throw error;
    }
  }
  async sendOtpByEmail(email: string, subject: string):Promise<void> {
    try {
      // Generate OTP
      const otp = generateOTP(6);
      // Save OTP to the repository
      await this.authRepository.saveOtp(email, otp);
      await sendEmail(email, subject, `Your OTP is: ${otp}`);
      return;
    } catch (error) {
      throw new Error(ErrorCode.FAILED_SENDING_OTP);
    }
  }
  async userSignin(data: IAuth):Promise<{accessToken: string,refreshToken:string}> {
    try {
      const user = await this.authRepository.emailAuth(data.email);
      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new Error(ErrorCode.INVALID_CREDENTIALS);
      }
      // Checking Whether Account is created using Google Auth
      if(user.isGoogleAuth && !user.password){
        throw new Error(ErrorCode.SIGN_IN_WITH_GOOGLE);
      }
      const isUserVerified = await this.authRepository.checkUserVerified(
        data.email
      );
      if (!isUserVerified) {
        await this.sendOtpByEmail(data.email, "Travello:Verify Account");
        throw new Error(ErrorCode.USER_NOT_VERIFIED);
      }
      const payload = { id: user._id, email: user.email, user_id: user.userid };
      const token = signJWT(payload, 8);
  
      await this.authRepository.login(data, token.refreshToken);
      return token
    } catch (error) {
      throw error
    }
  }

  async userSignup(data: IUser):Promise<IUser> {
    try {
      const emailExists = await this.authRepository.checkEmailExists(
        data.email
      );

      const usernameExists = await this.authRepository.checkUsernameExists(
        data.username
      );

      if (emailExists) {
        throw new Error(ErrorCode.EMAIL_ALREADY_EXISTS); // Throw for controller handling
      }
      if (usernameExists) {
        throw new Error(ErrorCode.USERNAME_ALREADY_EXISTS); // Throw for controller handling
      }

      // Hash password
      data.password = await bcrypt.hash(data.password as string, 10);

      // Create user
      data.username = data.username.toLowerCase();
      const newUser = await this.authRepository.create(data,false);

      // Generate OTP and Send  via email
      await this.sendOtpByEmail(data.email, "Travello:Verify Account");

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      await this.sendOtpByEmail(email,"Travello:Reset Password");
      return "OTP Sent"
    } catch (error) {
      throw error
    }
  }
  async verifyOtp(email: string, otp: string):Promise<string> {
    try {
      // Verifying OTP from OtpCollection
      const OtpVerfication = await this.authRepository.verifyOtp(email, otp);

      // Verifying User Account after OTP Verification
      await this.authRepository.verifyUserAccount(email);
      return OtpVerfication;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }
}
