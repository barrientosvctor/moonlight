import type { Collection, GuildEmoji } from "discord.js";

export class EmojiManager {
  public static GetTargetEmojiId(
    emojis: Collection<string, GuildEmoji>,
    name: string
  ): string | null {
    for (const emoji of emojis) if (emoji[1].name === name) return emoji[1].id;

    return null;
  }

  public static ExtractEmojiName(input: string): string {
    const emojiReferenceSyntax = /<(?:a|):([A-Za-z0-9_]+):\d{17,}>/g;
    const match = emojiReferenceSyntax.exec(input);

    if (!match) return input;

    return match[1];
  }
}
