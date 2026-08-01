import { Feed, feeds, User, users } from "src/schema";
import { db } from "..";
import { eq } from "drizzle-orm";

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

export async function deleteAllFeeds() {
  await db.delete(feeds);
}

export async function getFeed(feed_id: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.id, feed_id))
  return result;
}

export async function getFeedByUrl(feed_url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, feed_url))
  return result;
}

export async function getFeeds() {
  const result = await db.select().from(feeds).innerJoin(users, eq(feeds.user_id,users.id));
  return result.map(entry => ({
    feedName: entry.feeds.name,
    feedUrl: entry.feeds.url,
    userName: entry.users.name
  }));
}

