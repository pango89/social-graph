import { Injectable, Inject } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';

@Injectable()
export class SocialGraphService {
  private readonly driver: Driver;

  constructor(@Inject('NEO4J_DRIVER') private readonly neo4jDriver: Driver) {
    this.driver = this.neo4jDriver;
  }

  private getSession(): Session {
    return this.driver.session(); // Create a session per request
  }

  async followUser(followerId: number, followeeId: number) {
    const session = this.getSession();
    try {
      await session.run(
        'MERGE (a:User {id: $followerId}) MERGE (b:User {id: $followeeId}) MERGE (a)-[:FOLLOWS]->(b)',
        { followerId, followeeId },
      );
    } finally {
      await session.close();
    }
  }

  async unfollowUser(followerId: number, followeeId: number) {
    const session = this.getSession();
    try {
      await session.run(
        'MATCH (a:User {id: $followerId})-[r:FOLLOWS]->(b:User {id: $followeeId}) DELETE r',
        { followerId, followeeId },
      );
    } finally {
      await session.close();
    }
  }

  async getFollowers(userId: number): Promise<number[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        'MATCH (a:User)-[:FOLLOWS]->(b:User {id: $userId}) RETURN a.id AS followerId',
        { userId },
      );
      return result.records.map((record) => +record.get('followerId'));
    } finally {
      await session.close();
    }
  }

  // function to get all users a given user follows
  async getFollowedUsers(userId: number): Promise<number[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        'MATCH (a:User {id: $userId})-[:FOLLOWS]->(b:User) RETURN b.id AS followeeId',
        { userId },
      );
      return result.records.map((record) => +record.get('followeeId'));
    } finally {
      await session.close();
    }
  }

  // New method to get probable friends
  async getProbableFriends(userId: number): Promise<number[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (a:User {id: $userId})-[:FOLLOWS]->(b:User)-[:FOLLOWS]->(c:User)
         WHERE NOT (a)-[:FOLLOWS]->(c) AND a <> c
         RETURN DISTINCT c.id AS probableFriendId`,
        { userId },
      );
      return result.records.map((record) => +record.get('probableFriendId'));
    } finally {
      await session.close();
    }
  }
}
