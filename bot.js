const discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const hide_bin = require('yargs/helpers').hideBin;
const loggers = require('./handlers/logger');

let log = (...data) => {loggers.log("Bot", data)}
let debug = (...data) => {loggers.log("Bot", data)}

let credentials = require('./config/credentials.json');
let arguments = yargs(hide_bin(process.argv)).argv;

let bot = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.GuildModeration,
        discord.GatewayIntentBits.MessageContent,
        discord.GatewayIntentBits.GuildVoiceStates,
        discord.GatewayIntentBits.GuildPresences,
        discord.GatewayIntentBits.GuildMessageReactions,
        discord.GatewayIntentBits.GuildEmojisAndStickers,
        discord.GatewayIntentBits.DirectMessages,
        discord.GatewayIntentBits.DirectMessageReactions,
        discord.GatewayIntentBits.DirectMessageTyping,
        discord.GatewayIntentBits.GuildInvites,
        discord.GatewayIntentBits.GuildScheduledEvents
    ],
    partials: [
        discord.Partials.Channel,
        discord.Partials.Message,
        discord.Partials.Reaction,
        discord.Partials.User
    ]
});

bot.on(discord.Events.ClientReady, () => {

    log("Logged in as "+bot.user.displayName);

    bot.user.setPresence({
        status: "online",
        activities: [{name: "DMs for Help!", type: discord.ActivityType.Listening}]
    });

    let loaded_module_count = 0;
    let modules_path = path.join(__dirname, 'modules');
    let module_files = fs.readdirSync(modules_path, {recursive: false}).filter (file => file.endsWith('.js'));

    log("Loading Modules...");

    for (let filename of module_files) {
        
        let module_path = path.join(modules_path, filename);
        let module = require(module_path);

        if (!module.length)
            continue;

        if (module.in_dev == arguments.dev) {
            module.start(bot);
            loaded_module_count++;
        }
    }

    log("Loaded "+loaded_module_count+" modules");
});

bot.login(credentials.discord.token);

module.exports = {
    bot
}