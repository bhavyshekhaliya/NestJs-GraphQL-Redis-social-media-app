import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { User } from './entities/user.entity';
import { UserSchema } from './entities/user.document';
import { S3Module } from 'src/common/s3/s3.module';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    S3Module
  ],
  providers: [
    UserRepository,
    UserService,
    UserResolver
  ],
  exports: [
    UserRepository,
    UserService
  ]
})
export class UserModule {
  private readonly logger = new Logger(UserModule.name);
}
