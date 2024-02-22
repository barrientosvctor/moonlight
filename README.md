# Moonlight Discord Bot

Moonlight is a multi-purpose Discord bot in Spanish.

## Authors

- [@barrientosvctor](https://www.github.com/barrientosvctor)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DISCORD_TOKEN`: Get it on [Discord Developer Portal](https://discord.com/developers/applications)


## Run Locally

Make sure you have installed [pnpm](https://pnpm.io/) to run this project.

Clone the project

```bash
  git clone https://github.com/barrientosvctor/moonlight.git
```

Go to the Moonlight directory

```bash
  cd moonlight
```

Install dependencies

```bash
  pnpm install
```

### Run on production

Build the project

```bash
  pnpm build
```

Start the bot

```bash
  pnpm start
```

### Run on development

Make sure the `PATH_CREATOR_DEV_MODE` constant is set to `true`. That constant is located into [pathCreator.constant.ts](src/structures/constants/pathCreator.constant.ts).

Then run the following command:

```bash
  pnpm dev
```
