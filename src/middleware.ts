import { CommandHandler } from "./commands";
import { getCurrentUser } from "./config";
import { getUser } from "./lib/db/queries/users";
import { User } from "./schema";

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const userName = getCurrentUser()
        if (!userName) {
            throw new Error("Not logged in")
        }
        const user = await getUser(userName);

        return handler(cmdName, user as User, ...args);
    }
}
