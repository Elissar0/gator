# Gator

A command-line RSS feed aggregator built with TypeScript, Drizzle ORM, and PostgreSQL.

## Requirements

- **Node.js** (v18+ recommended)
- **PostgreSQL** (running locally or remotely)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the config file

Gator reads its configuration from `~/.gatorconfig.json`. Create it with your PostgreSQL connection string:

```json
{
  "db_url": "postgres://user:password@localhost:5432/gator",
  "current_user_name": ""
}
```

`current_user_name` is set automatically when you log in — you can leave it empty.

### 3. Run migrations

```bash
npm run migrate
```

### 4. Run the CLI

```bash
npm start <command> [arguments]
```

## Commands

| Command | Description | Example |
|---|---|---|
| `register <name>` | Create a new user | `npm start register alice` |
| `login <name>` | Log in as a user | `npm start login alice` |
| `users` | List all users | `npm start users` |
| `addfeed <name> <url>` | Add an RSS feed (auto-follows it) | `npm start addfeed "Tech News" https://example.com/rss` |
| `feeds` | List all feeds | `npm start feeds` |
| `follow <url>` | Follow an existing feed | `npm start follow https://example.com/rss` |
| `unfollow <url>` | Unfollow a feed | `npm start unfollow https://example.com/rss` |
| `following` | Show feeds you follow | `npm start following` |
| `browse [limit]` | Show recent posts from your feeds | `npm start browse 10` |
| `agg <duration>` | Scrape feeds on an interval (e.g. `30s`, `5m`, `1h`); press `Ctrl+C` to stop | `npm start agg 1m` |
| `reset` | Delete all users and feeds | `npm start reset` |

## Notes

- `addfeed`, `follow`, `unfollow`, `following`, and `browse` require you to be logged in.
- `agg` scrapes all known feeds periodically so new posts show up in `browse`.
