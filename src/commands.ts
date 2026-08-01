import { readConfig, setUser, getCurrentUser } from "./config";
import { createFeeds, deleteAllFeeds, getFeedByUrl, getFeeds } from "./lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/follow";
import { getUser, createUser, deleteAllUser, getUsers } from "./lib/db/queries/users";
import { fetchFeed } from "./rss";
import { users } from "./schema";


export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("username is required");
    }

    const username = args[0];

    const existingUser = await getUser(username);
    if (!existingUser) {
        throw new Error(`user ${username} doesn't exist`);
    }


    const config = readConfig();

    setUser(config, username);

    console.log(`User set to ${username}`);
}
export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("username is required");
    }

    const username = args[0];

    const existingUser = await getUser(username);
    if (existingUser) {
        throw new Error(`user ${username} already exists`);
    }

    const user = await createUser(username);
    if (!user) {
        throw new Error("could not create user");
    }

    const config = readConfig();
    setUser(config, username);

    console.log(`User ${username} was created`);
    console.log(user);
}
export async function handlerReset(cmdName: string, ...args: string[]) {

    await deleteAllUser();
    await deleteAllFeeds();

}
export async function handlerAgg(cmdName: string, ...args: string[]) {

    const url = "https://www.wagslane.dev/index.xml";

    const feed = await fetchFeed(url);
    console.log(feed);
}
export async function handlerUsers(cmdName: string, ...args: string[]) {
    const currentUser = getCurrentUser();
    const users = await getUsers();
    users.forEach(user => console.log('* ' + user.name + (currentUser === user.name ? " (current)" : "")));
}


export async function handlerAdd(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error("feedName & url are required");
    }

    const userName = getCurrentUser()
    if (!userName) {
        console.log("not logged in");
        return;
    }
    const user = await getUser(userName);

    const feedName = args[0];
    const url = args[1];

    const feed = await createFeeds(feedName, url, user.id);
    if (!feed) {
        throw new Error("could not create feed");
    }
    await createFeedFollow(user.id, feed.id);
    console.log(`Feed ${feedName} was created`);
    console.log(feed);
}

export async function handlerFeed(cmdName: string, ...args: string[]) {

    const allFeeds = await getFeeds();

    allFeeds.forEach(feed => {
        console.log(`Feed:${feed.feedName} by ${feed.userName}: ${feed.feedUrl} `);

    });
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("url is required");
    }

    const userName = getCurrentUser()
    if (!userName) {
        console.log("not logged in");
        return;
    }
    const user = await getUser(userName);
    const feedUrl = args[0];
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) {
        console.log("create the feed first");
        return;
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(feedFollow);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
    const userName = getCurrentUser()
    if (!userName) {
        console.log("not logged in");
        return;
    }
    const user = await getUser(userName);

    const feeds = await getFeedFollowsForUser(user.id);
    if (feeds.length > 0) {
        console.log("You are following:");
        feeds.forEach(feed => console.log(feed.feeds.name));
    }
}