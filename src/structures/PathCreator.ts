import { join } from "node:path";
import { isProductionEnvironment } from "../util/functions.js";

type FileExtensions = ".ts" | ".js";
type SourceFolder = "src" | "dist";

export class PathCreator {
  private readonly __extension: FileExtensions;
  private readonly __source: SourceFolder;

  constructor() {
    if (isProductionEnvironment()) {
      this.__extension = ".js";
      this.__source = "dist";
    } else {
      this.__extension = ".ts";
      this.__source = "src";
    }
  }

  get extension(): FileExtensions {
    return this.__extension;
  }

  joinPaths(...paths: string[]) {
    return join(process.cwd(), this.__source, ...paths);
  }
}
