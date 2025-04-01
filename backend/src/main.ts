import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  
  // Tentar porta 3001 se a 3000 estiver ocupada
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Aplicação rodando na porta ${port}`);
}
bootstrap();
