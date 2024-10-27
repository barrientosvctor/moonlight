import { MoonlightClient } from "./structures/Client.js";
import "dotenv/config";

const client = MoonlightClient.Instance;

await client.login();
