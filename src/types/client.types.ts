export type Emoji = {
  check: string | string[];
  error: string | string[];
  noargs: string | string[];
  sad: string | string[];
  tada: string | string[];
  wait: string | string[];
  warning: string | string[];
  love: string | string[];
};

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
};
