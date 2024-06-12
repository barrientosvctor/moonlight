import { join } from "node:path";

type FileExtensions = ".ts" | ".js";
type SourceFolder = "src" | "dist";

export class PathCreator {
  private __dev = false;
  private __extension: FileExtensions = ".js";
  private __source: SourceFolder = "dist";

  constructor(protected readonly devMode: boolean = false) {
    this.__dev = devMode;

    if (this.__dev) {
      this.__extension = ".ts";
      this.__source = "src";
    } else {
      this.__extension = ".js";
      this.__source = "dist";
    }
  }

  get extension(): FileExtensions {
    return this.__extension;
  }

  joinPaths(...paths: string[]) {
    return join(process.cwd(), this.__source, ...paths);
  }
}
