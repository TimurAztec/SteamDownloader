# SteamDownloader
Simple application for downloading steam workshop items. This application is usefull for people who wants to play non-steam versions of games
and have steam workshop addons installed. </br>Simply put link to steam workshop addon and download it to your mods folder or whatever your game/app of choice uses to install addons.
## Tech part 👨‍💻
This app runs on [NodeJS](https://nodejs.org/) using [NodeGui](https://docs.nodegui.org/)
<br/>
### To build app yourself:
<br/>

Download and install [NodeJS](https://nodejs.org/)
<br/>
Download and install [Cmake](https://cmake.org/)
<br/>
(Optionaly) Download and install [Qt](https://nodejs.org/)
<br/>
Clone repository
```
> cd ./SteamDownloader
> npm install
> npx nodegui-packer --init SteamDownloader
> npm run build
> npx nodegui-packer --pack ./dist
```
And it's gonna be inside deploy folder.
<br/>

### In case of build errors try to follow this [Guideline](https://nodejs.org/)
<br/>

### Also you may try to change version of NodeGUI inside package.json file.
<br/>

But anyway big thanks to [NodeGui](https://docs.nodegui.org/) team for providing such great and easy to use GUI library.