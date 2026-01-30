import { UserResponseEntity } from './user.reponse.entity';

export class AuthResponseEntity {
  accessToken: string;
  user: UserResponseEntity;
}
