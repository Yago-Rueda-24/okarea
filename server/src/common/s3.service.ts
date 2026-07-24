import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT', 'localhost');
    const port = this.configService.get<number>('S3_PORT', 9000);
    const useSSL = this.configService.get<string>('S3_USE_SSL', 'false') === 'true';
    const protocol = useSSL ? 'https' : 'http';

    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME', 'okarea-catalog');

    this.s3Client = new S3Client({
      endpoint: `${protocol}://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY', 'okarea_minio_user'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY', 'okarea_minio_pass'),
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test' || this.configService.get<string>('SKIP_S3_INIT') === 'true') {
      return;
    }
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`Bucket MinIO '${this.bucketName}' verificado.`);
    } catch {
      try {
        this.logger.log(`Creando bucket MinIO '${this.bucketName}'...`);
        await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
        
        // Hacer el bucket público para lectura de imágenes
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.s3Client.send(
          new PutBucketPolicyCommand({
            Bucket: this.bucketName,
            Policy: JSON.stringify(policy),
          }),
        );
        this.logger.log(`Bucket '${this.bucketName}' creado con acceso público.`);
      } catch (err) {
        this.logger.error(`Error al asegurar el bucket '${this.bucketName}':`, err);
      }
    }
  }

  async uploadFile(file: Express.Multer.File, keyPrefix = 'photos'): Promise<{ s3Key: string; url: string }> {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueName = `${keyPrefix}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueName,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const endpoint = this.configService.get<string>('S3_ENDPOINT', 'localhost');
    const port = this.configService.get<number>('S3_PORT', 9000);
    const useSSL = this.configService.get<string>('S3_USE_SSL', 'false') === 'true';
    const protocol = useSSL ? 'https' : 'http';
    const url = `${protocol}://${endpoint}:${port}/${this.bucketName}/${uniqueName}`;

    return { s3Key: uniqueName, url };
  }

  async deleteFile(s3Key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: s3Key,
        }),
      );
    } catch (err) {
      this.logger.error(`Error al eliminar archivo '${s3Key}' en S3:`, err);
    }
  }
}
