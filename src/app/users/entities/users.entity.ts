import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { hashSync } from 'bcrypt';
import { IsString } from 'class-validator';
import { Role } from './role.enum';

@Entity({ name: 'users' })
@Unique(['email'])
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'confirm_password' })
  confirmPassword: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }

  @BeforeInsert()
  hashConfirmPassword() {
    this.confirmPassword = hashSync(this.confirmPassword, 10);
  }

  @Column({ name: 'is_email_confirmed', default: false })
  isEmailConfirmed: boolean;

  @Column({ name: 'profile_image_url' })
  @IsString()
  ProfileImageUrl: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  roles: Role;
}
