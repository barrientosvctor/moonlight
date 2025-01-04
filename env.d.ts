declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      OWNER_ID: string;
    }
  }
}

export {};
