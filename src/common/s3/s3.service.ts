import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3FileUploadOptions } from './s3.options.interface';

@Injectable()
export class S3Service {
    private readonly client: S3Client;

    constructor(private readonly configService: ConfigService) {

        const accessKeyId = configService.getOrThrow('AWS_ACCESS_KEY');
        const secretAccessKey = configService.getOrThrow('AWS_SECRET_ACCESS_KEY');
        const region = configService.getOrThrow('AWS_REGION');

        const clientConfig: S3ClientConfig = {};

        if(accessKeyId && secretAccessKey && region) {
            clientConfig.region = region;
            clientConfig.credentials = {
                accessKeyId,
                secretAccessKey
            }
        }

        this.client = new S3Client(clientConfig);
    }

    // Upload file to s3
    async uploadFile({ bucket, key, file }: S3FileUploadOptions) {
        await this.client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file
             }),
        );
    }

    // Get image url
    getObjectUrl(bucket: string, key: string) {
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }
}
