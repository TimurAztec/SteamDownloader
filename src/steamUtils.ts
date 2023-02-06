import { execFileReverseExit } from "./utils";

const node_utils = require('node:util');
const execFile = node_utils.promisify(require('node:child_process').execFile);

async function execSteamCMD(...args: string[]): Promise<string>
{
    const stdout = await execFileReverseExit(
        `${__dirname}\\steamcmd\\steamcmd.${process.platform == 'win32' ? 'exe' : 'sh'}`, ...args);
    return stdout;
}

export {execSteamCMD};