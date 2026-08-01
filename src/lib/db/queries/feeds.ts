import { Feed, feeds, User } from "src/schema";
import { db } from "..";
import { UUID } from "node:crypto";

export async function createFeeds(feedName: string, url: string, user_id: string ) {
  const [result] = await db
    .insert(feeds)
    .values({ name: feedName , url, user_id })
    .returning();
  return result;
}

export async function  printFeed(feed: Feed,  user: User ) {
   console.log(feed.name);
   console.log(feed.url);
   console.log(user.name);
}


