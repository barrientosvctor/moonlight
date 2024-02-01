import { join } from "node:path";

type FileExtensions = ".ts" | ".js";

export class PathCreator {
  private __dev = false;
  private __extension: FileExtensions = ".js";

  constructor() { }

  get extension(): FileExtensions {
    return this.__extension;
  }

  setDev(value: boolean) {
    this.__dev = value;
  }

  setFileExtension(extension: FileExtensions) {
    this.__extension = extension;
  }

  joinPaths(...paths: string[]) {
    if (this.__dev)
      return join(process.cwd(), "src", ...paths);
    else
      return join(process.cwd(), "dist", ...paths);
  }
}
