import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health.module';
import { RedisModule } from './modules/redis.module';
import { MySQLModule } from './modules/mysql.module';
import { Neo4jModule } from './modules/neo4j.module';
import { SocialGraphModule } from './modules/social-graph.module';

@Module({
  imports: [
    HealthModule,
    RedisModule,
    MySQLModule,
    Neo4jModule,
    SocialGraphModule,
  ],
  controllers: [],
})
export class AppModule {}
