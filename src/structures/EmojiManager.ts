import type { Collection, GuildEmoji } from "discord.js";

export class EmojiManager {
  public static GetTargetEmojiId(
    emojis: Collection<string, GuildEmoji>,
    name: string
  ): string | null {
    for (const emoji of emojis) if (emoji[1].name === name) return emoji[1].id;

    return null;
  }
}
