import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IAuthUser } from 'src/interfaces/IAuthRequest';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/auth.schema';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    const jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const user = await this.jwtService.decode(jwt);
    const userData = await this.userModel.findOne({ email: user.email });
    console.log(userData.id, userData.name, userData.role);

    // return {
    //   _id: userData.id,
    //   name: userData.name,
    //   role: userData.role,
    // };
    return userData;
  }
}
