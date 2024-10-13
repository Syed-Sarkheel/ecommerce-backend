import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/auth.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findById(id).exec();
  }

  async register(createuserdto: CreateUserDto): Promise<string> {
    const { name, email, password, role } = createuserdto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists with this email.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });
    await user.save();

    return `User Registered Successfully with role: ${user.role}`;
  }

  async fetch() {
    return this.userModel.find().exec();
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword } = resetPasswordDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('No such user exists!');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password has been reset successfully' };
  }

  async login(loginuserdto: LoginUserDto) {
    const { email, password } = loginuserdto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('No such user exists!');
    }

    const isvalid = await bcrypt.compare(password, user.password);

    if (!isvalid) {
      throw new UnauthorizedException('Invalid email/password');
    }

    const payload = { email: user.email, name: user.name, role: user.role };
    const token = this.jwtService.sign(payload);
    console.log(token);

    return { access_token: token };
  }
}
