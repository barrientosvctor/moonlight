import "dotenv/config";

import { Moonlight } from "./src/Moonlight";
new Moonlight().begin();

process.on("uncaughtException", err => console.error(err));
process.on("uncaughtExceptionMonitor", err => console.error(err));
process.on("unhandledRejection", err => console.error(err));
