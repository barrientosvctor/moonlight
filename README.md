# Moonlight Discord Bot

Moonlight is a multi-purpose Discord bot in Spanish.

## Authors

- [@barrientosvctor](https://www.github.com/barrientosvctor)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DISCORD_TOKEN`: Get it on [Discord Developer Portal](https://discord.com/developers/applications)
`TESTING_GUILD_ID`: The guild ID of a testing server.
`OWNER_ID`: The owner id.

## Run Locally

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
  npm i
```

### Run on production

Build the project

```bash
  npm run build
```

Start the bot

```bash
  npm start
```

### Run on development

Make sure the `PATH_CREATOR_DEV_MODE` constant is set to `true`. That constant is located into [pathCreator.constant.ts](src/structures/constants/pathCreator.constant.ts).

Then run the following command:

```bash
  npm run dev
```
