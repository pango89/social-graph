import { Controller, Post, Param, Delete, Get } from '@nestjs/common';
import { SocialGraphService } from '../services/social-graph.service';

@Controller('social-graph')
export class SocialGraphController {
  constructor(private socialGraphService: SocialGraphService) {}

  @Post(':followerId/follow/:followeeId')
  async followUser(
    @Param('followerId') followerId: number,
    @Param('followeeId') followeeId: number,
  ) {
    return this.socialGraphService.followUser(followerId, followeeId);
  }

  @Delete(':followerId/unfollow/:followeeId')
  async unfollowUser(
    @Param('followerId') followerId: number,
    @Param('followeeId') followeeId: number,
  ) {
    return this.socialGraphService.unfollowUser(followerId, followeeId);
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: number) {
    return this.socialGraphService.getFollowers(userId);
  }

  // New controller to get all users followed by a specific user
  @Get('follows/:userId')
  async getFollowedUsers(@Param('userId') userId: number) {
    const followedUsers =
      await this.socialGraphService.getFollowedUsers(userId);
    return { followedUsers };
  }

  // New route to get probable friends of the user
  @Get('probable-friends/:userId')
  async getProbableFriends(@Param('userId') userId: number) {
    const probableFriends =
      await this.socialGraphService.getProbableFriends(userId);
    return { probableFriends };
  }
}
