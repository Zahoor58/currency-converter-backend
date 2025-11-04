import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

let server: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);
    app.enableCors({ origin: '*' }); // Restrict origins in production if needed

    // Optional: Keep route structure consistent between local and production
    // app.setGlobalPrefix('api');

    await app.init(); // <-- No .listen() here
    return app.getHttpAdapter().getInstance();
}

// For Vercel: Export the handler instead of listening on a port
if (!server) {
    server = bootstrap();
}

export default server;
