import { getCurrentUser, readConfig, setUser } from "./config.js";
import { createUser, deleteAllUser, getUser, getUsers } from "./lib/db/queries/users";
import { fetchFeed } from "./rss.js";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

type CommandsRegistry = Record<string, CommandHandler>;

async function handlerLogin(cmdName: string, ...args: string[]) {
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

async function handlerRegister(cmdName: string, ...args: string[]) {
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

async function handlerReset(cmdName: string, ...args: string[]) {

  await deleteAllUser();
 
}

async function handlerAgg(cmdName: string, ...args: string[]) {

  const url = "https://www.wagslane.dev/index.xml";

   const feed = await fetchFeed(url);
   console.log(feed);
}

async function handlerUsers(cmdName: string, ...args: string[]) {
  const currentUser =  getCurrentUser();
  const users = await getUsers();
  users.forEach(user => console.log('* ' + user.name + (currentUser === user.name ? " (current)" : "")));
}

function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

 export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];

  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(cmdName, ...args);
}

 async function main() {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("No command provided");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
  process.exit(0)
}

main();


