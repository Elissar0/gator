import { feedFollows, feeds } from "src/schema";
import { db } from "..";
import { getUser } from "./users";
import { getFeed } from "./feeds";
import { eq } from "drizzle-orm";

export async function createFeedFollow(user_id: string, feed_id: string) {
    console.log({ user_id, feed_id })
    const [newFeedFollow] = await db.insert(feedFollows).values({ user_id, feed_id }).returning();
    const user = getUser(newFeedFollow.user_id!);
    const feed = getFeed(newFeedFollow.feed_id!);

    return {
        ...newFeedFollow,
        user,
        feed
    }
}

export async function getFeedFollowsForUser(user_id: string) {
    const result = await db
        .select()
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feed_id, feeds.id))
        .where(eq(feedFollows.user_id, user_id));
    return result;
}