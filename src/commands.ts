import { readConfig, setUser, getCurrentUser } from "./config";
import { getUser, createUser, deleteAllUser, getUsers } from "./lib/db/queries/users";
import { fetchFeed } from "./rss";


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
