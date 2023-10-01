declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      HOOK_ID: string;
      HOOK_TOKEN: string;
      KAWAII_TOKEN: string;
      CLASH_ROYALE_API_KEY: string;
    }
  }
}

export {};
