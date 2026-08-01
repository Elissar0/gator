import { feedFollows, feeds, Post, posts } from "src/schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export async function createPosts(postsToAdd: Pick<Post, "title" | "description" | "url" | "publishedAt">[], feedId: string) {
    const postsAdded = await db
        .insert(posts)
        .values(postsToAdd.map(post => ({ ...post, feedId })))
        .onConflictDoNothing({ target: posts.url })
        .returning();
    return postsAdded;
}

export async function getPostsForUser(userId: string, limit: number = 10) {
    const result = await db
        .select()
        .from(posts)
        .innerJoin(feedFollows, eq(feedFollows.feed_id, posts.feedId))
        .where(eq(feedFollows.user_id, userId))
        .limit(limit)

    return result.map(entry => entry.posts);
}