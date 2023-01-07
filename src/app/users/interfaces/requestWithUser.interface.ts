import { Request } from 'express';
import { UsersEntity } from '../entities/users.entity';

export interface RequestWithUser extends Request {
  user: UsersEntity;
}
