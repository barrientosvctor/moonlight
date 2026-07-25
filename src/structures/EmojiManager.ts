import type { Collection, GuildEmoji } from "discord.js";

export class EmojiManager {
  private static emojiNameRegex = /([A-Za-z0-9_]{2,32})/g;
  private static emojiReferenceRegex = /<(?:a|):([A-Za-z0-9_]{2,32}):\d{17,}>/g;

  public static GetTargetEmojiId(
    emojis: Collection<string, GuildEmoji>,
    name: string
  ): string | null {
    for (const emoji of emojis) if (emoji[1].name === name) return emoji[1].id;

    return null;
  }

  public static isAcceptableName(emojiName: string): boolean {
    const match = this.emojiNameRegex.exec(emojiName);

    if (!match) return false;

    return match[1] === emojiName;
  }

  public static ExtractEmojiName(input: string): string {
    const match = this.emojiReferenceRegex.exec(input);

    if (!match) return input;

    return match[1];
  }
}
