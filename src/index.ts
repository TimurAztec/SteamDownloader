import { QMainWindow, QWidget, QLabel, FlexLayout, QPushButton, QIcon, QProgressBar, QLineEdit, QFileDialog, FileMode, QShortcut, QKeySequence } from '@nodegui/nodegui';
import axios from 'axios';
const node_utils = require('node:util');
const execFile = node_utils.promisify(require('node:child_process').execFile);
const fs = require('fs-extra')
import logo from '../assets/steamdownloader_icon.png';

const win = new QMainWindow();
win.setWindowTitle("SteamDownloader");
win.setWindowIcon(new QIcon(logo));
win.setMinimumSize(360, 120);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);
centralWidget.setInlineStyle(`
  height: '100%';
`);

const linkLabel = new QLabel();
linkLabel.setObjectName("linkLabel");
linkLabel.setText(" Enter steam workshop link: ");

const linkInput: QLineEdit = new QLineEdit();
linkInput.setPlaceholderText(`http://steamcommunity.com/sharedfiles/filedetails/?id=xxxxxxxxx`);

const selectDownloadFolderWidget = new QWidget();
selectDownloadFolderWidget.setObjectName("selectDownloadFolderWidget");
const selectDownloadFolderLayout = new FlexLayout();
selectDownloadFolderWidget.setLayout(selectDownloadFolderLayout);
selectDownloadFolderWidget.setInlineStyle(`
  flex: 1;
  flex-direction: row;
`)

const downloadFolderInput: QLineEdit = new QLineEdit();
downloadFolderInput.setPlaceholderText(`Download to...`);
downloadFolderInput.setInlineStyle(`
  flex: 5;
`);

const selectDownloadFolderButton = new QPushButton();
selectDownloadFolderButton.setText("📁");
selectDownloadFolderButton.setInlineStyle(`
  flex: 1;
`);

const downloadFolderDialog = new QFileDialog();
downloadFolderDialog.setFileMode(FileMode.Directory);

selectDownloadFolderLayout.addWidget(downloadFolderInput);
selectDownloadFolderLayout.addWidget(selectDownloadFolderButton);

selectDownloadFolderButton.addEventListener("clicked", async () => {
  downloadFolderDialog.exec()
  const selectedFolders = downloadFolderDialog.selectedFiles();
  if (selectedFolders[0]) {
    downloadFolderInput.setText(selectedFolders[0]);
  }
});

const downloadButton = new QPushButton();
downloadButton.setText("Download 📥");
downloadButton.setAutoDefault(true);
downloadButton.setDefault(true);

downloadButton.addEventListener("clicked", async () => {
  downloadProgressBar.setValue(0);
  let downloadInterval: any;
  downloadButton.setDisabled(true);
  linkInput.setDisabled(true);
  downloadFolderInput.setDisabled(true);
  selectDownloadFolderButton.setDisabled(true);
  infoLabel.setText("");
  infoLabel.setInlineStyle(`
    color: 'black';
  `);
  try {
    const url = linkInput.text();
    let appId: number = 0;
    let itemId: number = 0;
    let itemName: string = '';
    const itemIdStringSearchRes = new RegExp('[?]id=[0-9]{3,12}', 'gm').exec(url);
    if (itemIdStringSearchRes) {
      const itemIdSearchRes = new RegExp('[0-9]{3,12}', 'gm').exec(itemIdStringSearchRes[0]);
      if (itemIdSearchRes) {
        itemId = Number(itemIdSearchRes[0]);
      }
    }
    if (!itemId) {
      throw new Error(`Invalid URL`);
    }
    downloadProgressBar.setValue(10);
    console.log(`Steam Workshop item ID: ${itemId}`);
    infoLabel.setText(`Steam Workshop item ID: ${itemId}`);
    const responce = await axios.get(linkInput.text());
    const appIdStringSearchRes = new RegExp('[?]appid=[0-9]{3,12}', 'gm').exec(responce.data);
    if (appIdStringSearchRes) {
      const appIdSearchRes = new RegExp('[0-9]{3,12}', 'gm').exec(appIdStringSearchRes[0]);
      if (appIdSearchRes) {
        appId = Number(appIdSearchRes[0]);
      }
    }
    if (!appId) {
      throw new Error(`Cant find app ID`);
    }
    console.log(`Steam app ID: ${appId}`);
    infoLabel.setText(`Steam app ID: ${appId}`);
    downloadProgressBar.setValue(20);

    const itemNameStringSearchRes = new RegExp('<div class="workshopItemTitle">(.*)<\/div>', 'gm').exec(responce.data);
    if (itemNameStringSearchRes) {
      const itemNameSearchRes = new RegExp('>(.*)<\/', 'gm').exec(itemNameStringSearchRes[0]);
      if (itemNameSearchRes) {
        itemName = itemNameSearchRes[0].slice(1, -2);
      }
    }
    if (!appId) {
      throw new Error(`Cant find item name`);
    }
    console.log(`Steam Workshop item name: ${itemName}`);
    infoLabel.setText(`Steam Workshop item name: ${itemName}`);
    downloadProgressBar.setValue(30);

    downloadInterval = setInterval(() => { 
      if (downloadProgressBar.value() < 99) {
        downloadProgressBar.setValue(downloadProgressBar.value() + 1);
      }
    }, 250);

    const { stdout } = await execFile(
      `${__dirname}\\steamcmd\\steamcmd.${process.platform == 'win32' ? 'exe' : 'sh'}`,
      [`+login anonymous`, `+workshop_download_item ${appId} ${itemId}`, `+quit`]
      );
    console.log(stdout);

    const downloadInfoSearchRes = new RegExp(`Downloaded item ${itemId} to \"(.*)\"`).exec(stdout);   
    if (downloadInfoSearchRes) {
      const indexOfSplit: number = downloadInfoSearchRes[0].indexOf(`\"`) - 1;
      let downloadFinishedText = [downloadInfoSearchRes[0].slice(0, indexOfSplit), '\n', downloadInfoSearchRes[0].slice(indexOfSplit)].join('');
      const downloadFolderPathRes = new RegExp('([a-zA-Z][:]|)([\\/|\\\\]{1}[\\s\\S][^"|\']+)+', 'gm').exec(downloadFinishedText);
      let downloadFolderPath: string = '';
      if (downloadFolderPathRes) {
        downloadFolderPath = downloadFolderPathRes[0];
      }
      const targetDownloadFolderPath: string = `${downloadFolderInput.text()}/${itemName}`;
      if (downloadFolderPath !== '' && targetDownloadFolderPath && new RegExp('([a-zA-Z][:]|)([\\/|\\\\]{1}[\\s\\S][^"|\']+)+', 'gm').test(targetDownloadFolderPath)) {
        fs.moveSync(downloadFolderPath, targetDownloadFolderPath, {overwrite: true});
        const newDownloadFinishedText = downloadFinishedText.replace(new RegExp('([a-zA-Z][:]|)([\\/|\\\\]{1}[\\s\\S][^"|\']+)+', 'gm'), targetDownloadFolderPath);
        downloadFinishedText = newDownloadFinishedText;
      }

      infoLabel.setText(downloadFinishedText);
      downloadProgressBar.setValue(100);
      linkInput.setText("");
    }
    clearInterval(downloadInterval);
  } catch (error: any) {
    console.log(error.message);
    infoLabel.setInlineStyle(`
      color: 'red';
    `)
    infoLabel.setText(error.message);
    if (downloadInterval) {
      clearInterval(downloadInterval);
    }
  } finally {
    downloadButton.setDisabled(false);
    linkInput.setDisabled(false);
    downloadFolderInput.setDisabled(false);
    selectDownloadFolderButton.setDisabled(false);
  }
});

const downloadProgressBar = new QProgressBar();

const infoLabel = new QLabel();

rootLayout.addWidget(linkLabel);
rootLayout.addWidget(linkInput);
rootLayout.addWidget(selectDownloadFolderWidget);
rootLayout.addWidget(downloadButton);
rootLayout.addWidget(downloadProgressBar);
rootLayout.addWidget(infoLabel);
win.setCentralWidget(centralWidget);

win.show();
(global as any).win = win;
