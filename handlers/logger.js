const yargs = require('yargs');
const hide_bin = require('yargs/helpers').hideBin;

let arguments = yargs(hide_bin(process.argv)).argv;

function log(module_name, ...data) {
    console.log(`[${module_name}]: `, data);
}

function debug(module_name, ...data) {
    if (arguments.debug) {
        console.debug(`[${module_name}] [DEBUG]: `, data);
    }
}

module.exports = {
    log,
    debug
}
