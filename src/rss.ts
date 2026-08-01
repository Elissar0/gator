import { XMLParser } from "fast-xml-parser";
import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";

type RSSResponse = {
    rss: RSSFeed;
}

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

function isRSS(value: unknown): value is RSSResponse {
    if (typeof value !== 'object' || !value) return false;
    if (Object.hasOwn(value, 'rss')) {
        return true;
    }
    return false;
}

function validateRSSChannel(channel?: RSSFeed["channel"]) {
    if (!channel ||
        typeof channel.title !== "string" ||
        typeof channel.link !== "string" ||
        typeof channel.description !== "string")
        return false;
    return true;
}

function extractItems(channel: RSSFeed["channel"]) {
    let Items: RSSItem[];

    if (Object.hasOwn(channel, "item")) {
        Items = Array.isArray(channel.item) ? channel.item : [channel.item];
    } else {
        Items = [];
    }
    return Items.filter(validateExtractItems)
}

function validateExtractItems(item?: RSSItem) {
    if (!item ||
        typeof item.title !== "string" ||
        typeof item.link !== "string" ||
        typeof item.description !== "string" ||
        typeof item.pubDate !== "string")
        return false;
    return true;
}

export async function fetchFeed(feedURL: string): Promise<RSSFeed["channel"]> {

    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
        }
    });

    const res = await response.text();

    const parser = new XMLParser({ processEntities: false });

    const resParsed = parser.parse(res);

    if (!isRSS(resParsed) || !validateRSSChannel(resParsed.rss.channel))
        throw new Error('Bad RSS response');

    const channel = resParsed.rss.channel
    return {
        title: channel.title,
        description: channel.description,
        link: channel.link,
        item: extractItems(channel),
    };
}

export async function scrapeFeeds() {
    const feedToFetch = await getNextFeedToFetch();
    console.log(`Collecting feeds from ${feedToFetch.name} at ${feedToFetch.url}`);
    try {
        const feed = await fetchFeed(feedToFetch.url);
        feed.item.forEach(item => console.log(`- ${item.title}`));
    } catch (error) {
        throw error;
    } finally {
        await markFeedFetched(feedToFetch.id);
    }
}
