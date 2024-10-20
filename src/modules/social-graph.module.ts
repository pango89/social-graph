import { Module } from '@nestjs/common';
import { SocialGraphService } from '../services/social-graph.service';
import { SocialGraphController } from '../controllers/social-graph.controller';

@Module({
  providers: [SocialGraphService],
  controllers: [SocialGraphController],
})
export class SocialGraphModule {}
