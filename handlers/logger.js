const yargs = require('yargs');
const hide_bin = require('yargs/helpers').hideBin;

let arguments = yargs(hide_bin(process.argv)).argv;

function log(module_name, ...data) {
    console.log(`[${module_name}]: `, [...data].join(' '));
}

function debug(module_name, ...data) {
    if (arguments.debug) {
        console.debug(`[${module_name}] [DEBUG]: `, [...data].join(' '));
    }
}

module.exports = {
    log,
    debug
}
