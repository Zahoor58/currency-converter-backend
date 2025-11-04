import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    app.enableCors({ origin: '*' }); // For production, restrict origin
    const port = config.get<number>('PORT') || 4000;
    await app.listen(port);
    console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
