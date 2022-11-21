import EasyJsonDB from "easy-json-database";
import { join } from "node:path";

export class MoonlightDatabase extends EasyJsonDB {
    file: string;
    path: string;

    constructor(file: string) {
        super(join(__dirname, file));
        this.file = file;
        this.path = join(__dirname, file);
    }
}
