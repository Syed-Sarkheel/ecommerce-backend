import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRoles } from '../enums/user.roles';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(UserRoles)
  role?: UserRoles;
}
