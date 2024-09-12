import type { UserRegisterDto } from './user-register.dto';
export type UserLoginDto = Pick<UserRegisterDto, 'email' | 'password'>;
