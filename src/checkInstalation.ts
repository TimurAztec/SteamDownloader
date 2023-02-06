import { execSteamCMD } from "./steamUtils";

const fs = require('fs-extra');

export default async function* checkInstalation(): AsyncGenerator<any, any, unknown>
{
    const instalationFull: boolean =
     fs.existsSync(`${__dirname}\\steamcmd\\public`) && 
     fs.existsSync(`${__dirname}\\steamcmd\\package`); 
    yield instalationFull;
    if (!instalationFull) 
    {
        await execSteamCMD(`+login anonymous`, `+quit`);
        return false;
    }
    return true;
}