import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './auth.roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/auth.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'hardcoded_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [RolesGuard, JwtModule, MongooseModule],
})
export class AuthModule {}

// {"email" : "sa2@g.com",
// "password" :"tarded",
// "name" : "sar",
// "role" : "admin"

// }

// {
//   "name": "Sample Product",
//   "description": "This is a description of the sample product.",
//   "price": 100.0,
//   "stock": 50,
//   "category": "Electronics"
// }
