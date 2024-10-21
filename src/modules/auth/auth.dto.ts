import { IsString, IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty()
  password!: string;

  @IsIn(['admin', 'user'], { message: 'Role must be either admin or user' })
  @IsNotEmpty()
  role!: 'admin' | 'user';
}

export class LoginDto { 
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty()
    email!: string;
  
    @IsString()
    @IsNotEmpty()
    password!: string;
  }
