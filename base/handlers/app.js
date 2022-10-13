module.exports.app = async (bot) => {
    let Dev = await bot.users.fetch('754582643026427964');
    await bot.application.fetch().then(app => {
        /** @type {Object} */
        bot.application.owner = app.owner;
        /** @type {Number} */
        bot.application.owner.id = app.owner.id;
        /** @type {String} */
        bot.application.owner.tag = app.owner.tag;
        /** @type {String} */
        bot.application.owner.avatar = app.owner.displayAvatarURL({ size: 2048, format: 'png', dynamic: true });
        /** @type {Object} */
        bot.application.dev = Dev;
        /** @type {Number} */
        bot.application.dev.id = Dev.id;
        /** @type {String} */
        bot.application.dev.tag = Dev.tag;
        /** @type {String} */
        bot.application.dev.avatar = Dev.displayAvatarURL({ size: 2048, format: 'png', dynamic: true });
        /** @type {String} */
        bot.application.url = 'https://discord.com/api/oauth2/authorize?client_id=741756688398549034&permissions=1378030578775&scope=bot%20applications.commands';
        /** @type {String} */
        bot.application.banner = 'https://i.imgur.com/Q2LYV6F.png';
        /** @type {String} */
        bot.application.color = '#F9D87F';
    });
}
