module.exports = (bot) => {
    process.on('uncaughtException', err => console.error(err));
    process.on('uncaughtExceptionMonitor', err => console.error(err));
    process.on('unhandledRejection', err => console.error(err));
}