import { Module, Global, OnModuleDestroy, Inject } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      useFactory: async (): Promise<Driver> => {
        const driver = neo4j.driver(
          'bolt://localhost:7687',
          neo4j.auth.basic('neo4j', 'neo4jpass'),
        );
        await driver.verifyConnectivity(); // Check connection
        return driver;
      },
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule implements OnModuleDestroy {
  constructor(@Inject('NEO4J_DRIVER') private readonly driver: Driver) {}

  async onModuleDestroy() {
    await this.driver.close(); // Ensure the driver is closed when the application shuts down
  }
}
