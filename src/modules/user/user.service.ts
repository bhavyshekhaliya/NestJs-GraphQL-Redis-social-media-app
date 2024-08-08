import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDocument } from './entities/user.document';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { hashData } from 'src/common/common';
import { RedisService } from 'src/common/redis/redis.service';
import { S3Service } from 'src/common/s3/s3.service';
import { USER_IMAGE_FILE_EXTENSION, USERS_BUCKET } from 'src/common/contants/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
    private readonly s3Service: S3Service
  ) { }

  // FindAll user
  async findAll(): Promise<User[]> {
    return (await this.userRepository.find({})).map((userDocument) =>
      this.toEntity(userDocument),
    );
  }

  // Find one user
  async findOne(_id: string): Promise<User> {
    const cachedUser = await this.redisService.get('user',_id);
    if(cachedUser) {
      return JSON.parse(cachedUser);
    }
    
    const user = this.toEntity(await this.userRepository.findOne({ _id }));
    await this.redisService.set('user',_id,JSON.stringify(user));
    return user;
  }

  // Update user
  async update(_id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashData(
        updateUserDto.password,
      );
    }

    const updatedUser = this.toEntity(
      await this.userRepository.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...updateUserDto,
          },
        },
      ),
    );

    // Delete the cached user
    await this.redisService.delete('user', _id);

    // Optionally, update the cache with the new data
    await this.redisService.setWithExpiry('user', _id, JSON.stringify(updatedUser), 3600);

    return updatedUser;
  }

  // Remove user
  async remove(_id: string): Promise<User> {
    const removeUser = this.toEntity(await this.userRepository.findOneAndDelete({ _id }));

    // Delete the cached user
    await this.redisService.delete('user',_id);

    return removeUser;
  }

  // Convert the UserDocument into the User type
  toEntity(userDocument: UserDocument): User {
    const user = {
      ...userDocument,
      profileImageUrl: this.s3Service.getObjectUrl(
        USERS_BUCKET,
        this.getImageUrl(userDocument._id.toHexString())
      )
    };
    delete user.password;
    return user;
  }

  // Upload profile image using S3Service
  async uploadProfileImage(file: Buffer, userId: string) {
    await this.s3Service.uploadFile({
      bucket: USERS_BUCKET,
      key: this.getImageUrl(userId),
      file
    });
  }

  private getImageUrl(userId: string) {
    return `${userId}.${USER_IMAGE_FILE_EXTENSION}`;
  }
}
