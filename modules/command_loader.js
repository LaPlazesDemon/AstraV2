const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const hide_bin = require('yargs/helpers').hideBin;
const {Collection, REST, Routes, Events} = require('discord.js');
const loggers = require('../handlers/logger');

let log = (...data) => {loggers.log("Bot", data)}
let debug = (...data) => {loggers.log("Bot", data)}

let credentials = require('../config/credentials.json');
let arguments = yargs(hide_bin(process.argv)).argv;

function start(bot) {
    bot.commands = new Collection();

    let commands = [];
    let commands_path = path.join(__dirname, '../commands');
    let command_files = fs.readdirSync(commands_path).filter(file => file.endsWith('.js'));

    for (const file of command_files) {

        let command_path = path.join(commands_path, file);
        let command = require(command_path);
        
        if (command.hasOwnProperty('disable'))
            continue;

        if (command.in_dev != arguments.dev)
            continue;
        
        if ('data' in command && 'execute' in command) {
            bot.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            debug("Registering command "+command.data.name);
        } else {
            log(`The command at ${command_path} is missing a required "data" or "execute" property.`);
        }
    }

    const rest = new REST().setToken(credentials.discord.token);

    (async () => {
        try {    
            const data = await rest.put(
                Routes.applicationGuildCommands(credentials.discord.app_id, credentials.discord.guild_id),
                { body: commands },
            );
    
            log(`Successfully loaded ${data.length} commands`);
        } catch (error) {
            log(error)
        }
    })();


    bot.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const command = interaction.client.commands.get(interaction.commandName);
        
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    });

}

module.exports = {
    start,
    name: "Command Loader"
}