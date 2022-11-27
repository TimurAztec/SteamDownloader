import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QProgressBar, QLineEdit } from '@nodegui/nodegui';
import axios from 'axios';
import logo from '../assets/steamdownloader_icon.png';
const exec = require('child_process').exec;

const win = new QMainWindow();
win.setWindowTitle("SteamDownloader");
win.setWindowIcon(new QIcon(logo));

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const linkLabel = new QLabel();
linkLabel.setObjectName("linkLabel");
linkLabel.setText("Enter steam workshop link: ");
linkLabel.setInlineStyle(`
  text-align: center;
`)

const linkInput: QLineEdit = new QLineEdit();
linkInput.setPlaceholderText(`http://steamcommunity.com/sharedfiles/filedetails/?id=xxxxxxxxx`);

const downloadButton = new QPushButton();
downloadButton.setText("Download");

downloadButton.addEventListener("clicked", async () => {
  downloadProgressBar.setValue(0);
  downloadButton.setDisabled(true);
  linkInput.setDisabled(true);
  infoLabel.setText("");
  try {
    const url = linkInput.text();
    let appId: number = 0;
    let itemId: number = 0;
    const itemIdStringSearchRes = /[?]id=[0-9]{3,12}/g.exec(url);
    if (itemIdStringSearchRes) {
      const itemIdSearchRes = /[0-9]{3,12}/g.exec(itemIdStringSearchRes[0]);
      if (itemIdSearchRes) {
        itemId = Number(itemIdSearchRes[0]);
      }
    }
    if (!itemId) {
      throw new Error(`Invalid URL`);
    }
    const responce = await axios.get(linkInput.text());
    const appIdStringSearchRes = /[?]appid=[0-9]{3,12}/g.exec(responce.data);
    if (appIdStringSearchRes) {
      const appIdSearchRes = /[0-9]{3,12}/g.exec(appIdStringSearchRes[0]);
      if (appIdSearchRes) {
        appId = Number(appIdSearchRes[0]);
      }
    }
    if (!appId) {
      throw new Error(`Cant find app ID`);
    }
    downloadProgressBar.setValue(15);
    exec(`./steamcmd/steamcmd.${process.platform == 'win32' ? 'exe' : 'sh'}  +login anonymous +workshop_download_item ${appId} ${itemId} +quit`, function(error: string, stdout: string, stderr: string){
      const downloadInfoSearchRes = new RegExp(`Downloaded item ${itemId} to \"(.*)\"`).exec(stdout);      
      if (downloadInfoSearchRes) {
        infoLabel.setText(downloadInfoSearchRes[0]);
        downloadProgressBar.setValue(100);
        linkInput.setText("");
      }
    });
  } catch (error: any) {
    console.log(error.message);
    infoLabel.setInlineStyle(`
      color: 'red';
    `)
    infoLabel.setText(error.message);
  } finally {
    downloadButton.setDisabled(false);
    linkInput.setDisabled(false);
  }
});

const downloadProgressBar = new QProgressBar();

const infoLabel = new QLabel();

rootLayout.addWidget(linkLabel);
rootLayout.addWidget(linkInput);
rootLayout.addWidget(downloadButton);
rootLayout.addWidget(downloadProgressBar);
rootLayout.addWidget(infoLabel);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
);

win.show();
(global as any).win = win;
