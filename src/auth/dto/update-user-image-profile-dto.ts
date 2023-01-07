import { IsString } from 'class-validator';
export class UpdateUserImageProfileDto {
  @IsString()
  ProfileImageUrl: string;
}
