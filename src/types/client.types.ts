import { CommandManager } from "../structures/CommandManager.js";
import jsonUtils from "../util/data.json" with { type: "json" };

export type Emoji = {
  check: string | string[];
  error: string | string[];
  noargs: string | string[];
  sad: string | string[];
  tada: string | string[];
  wait: string | string[];
  warning: string | string[];
  love: string | string[];
}

export const emojiList: Emoji = {
  check: ["✅"],
  error: ["❌"],
  noargs: ["❗", "❓"],
  sad: ["😔", "😕", "😞", "😟", "🙁", "☹️", "😢", "😭"],
  tada: ["🎉"],
  wait: ["<a:waiting:1019010655434571969>"],
  warning: ["⚠️"],
  love: ["❤️"]
} as const;

export type EmojiType = keyof Emoji;

export type BeautyMessageOptions = {
  mention: string;
  emoji: EmojiType;
}

export type ClientPieces = {
  commandsManager: CommandManager;
  cooldown: Map<string, Map<string, number>>;
  utils: typeof jsonUtils;
  getEmoji(type: EmojiType): string[] | string;
  beautifyMessage(message: string, data: Partial<BeautyMessageOptions>): string;
  convertPermissionString<ItemType extends string>(item: ItemType): string;
}
