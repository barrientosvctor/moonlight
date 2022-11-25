import { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";
import { Moonlight } from "../Moonlight";

export class ContextMenuBuilder extends ContextMenuCommandBuilder {
    public callback!: ContextMenuFunction;

    public setCallback(fn: ContextMenuFunction) {
        this.callback = fn;
        return this;
    }
}

type ContextMenuFunction = (idk: { bot: Moonlight, interaction: ContextMenuCommandInteraction<"cached"> }) => unknown;
