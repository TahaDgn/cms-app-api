import { NestFactory } from '@nestjs/core';
import { CmsModule } from './cms.module';

async function bootstrap() {
  const app = await NestFactory.create(CmsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
