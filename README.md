# SteamDownloader
Simple application for downloading steam workshop items. This application is usefull for people who wants to play non-steam games with steam workshop addons installed. Simply put link to steam workshop addon and download it to your mods folder or whatever your game/app of choice uses to install addons.
## Tech part 👨‍💻
This app runs on [NodeJS](https://nodejs.org/) using [NodeGui](https://docs.nodegui.org/)
<br/>
### To build app yourself:
<br/>

Download and install [NodeJS](https://nodejs.org/)
<br/>
Clone repository
```
> cd ./SteamDownloader
> npm install
> npx nodegui-packer --init SteamDownloader
> npm run build
> npx nodegui-packer --pack ./dist
```
And it's gonna be inside deploy folder. <br/>
If you get errors building it try to use use latest version of NodeGUI, I`m using version 0.44.0 because of a bug related to dll files in version 0.45.0
<br/>

But anyway big thanks to [NodeGui](https://docs.nodegui.org/) team for providing such great and easy to use GUI library.