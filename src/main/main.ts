/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import electron, { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { spawn } from 'child_process';
import { exit } from 'process';
import { contextBridge } from 'electron/renderer';

// var AutoLaunch = require('auto-launch');

// var palletizerAutoLauncher = new AutoLaunch({
//   name: 'Palletizer',
//   path: '/home/ptz01/repo/palletizer-electron-ui/build/release/ElectronReact-3.0.2.AppImage',
// });

// palletizerAutoLauncher.enable();

//palletizerAutoLauncher.disable();

// palletizerAutoLauncher
//   .isEnabled()
//   .then(function (isEnabled) {
//     if (isEnabled) {
//       return;
//     }
//     palletizerAutoLauncher.enable();
//   })
//   .catch(function (err) {
//     // handle error
//   });

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('testexit', async (event, arg) => {
  mainWindow.setFullScreen(false);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const createWindow = async () => {
  // let kill_all_python_process = spawn(
  //   "ps -ef | grep _server | awk '{ print $2 }' | xargs kill -9",
  //   [],
  //   {
  //     encoding: 'utf8',
  //     shell: true,
  //   }
  // );

  // await sleep(1500);

  // let websocket_server = spawn(
  //   '/home/ptz01/Palletizer/build/exe.linux-x86_64-3.8/websocket_server',
  //   [],
  //   {
  //     encoding: 'utf8',
  //     shell: true,
  //   }
  // );

  // await sleep(1500);

  // let robot_server = spawn(
  //   '/home/ptz01/Palletizer/build/exe.linux-x86_64-3.8/robot_server',
  //   [],
  //   {
  //     encoding: 'utf8',
  //     shell: true,
  //   }
  // );
  // let flask_server = spawn(
  //   '/home/ptz01/Palletizer/build/exe.linux-x86_64-3.8/flask_server',
  //   [],
  //   {
  //     encoding: 'utf8',
  //     shell: true,
  //   }
  // );

  // robot_server.stdout.setEncoding('utf8');
  // robot_server.stdout.on('data', (data) => {
  //   //Here is the output
  //   data = data.toString();
  //   console.log('=== robot_server ===\n' + data + '\n');
  // });
  // flask_server.stdout.setEncoding('utf8');
  // flask_server.stdout.on('data', (data) => {
  //   //Here is the output
  //   data = data.toString();
  //   console.log('=== flask_server ===\n' + data + '\n');
  // });
  // websocket_server.stdout.setEncoding('utf8');
  // websocket_server.stdout.on('data', (data) => {
  //   //Here is the output
  //   data = data.toString();
  //   console.log('=== websocket_server ===\n' + data + '\n');
  // });

  // robot_server.on('close', (code: number) => {
  //   //Here you can get the exit code of the script
  //   switch (code) {
  //     case 0:
  //       break;
  //     case 254:
  //     case 255:
  //       if (code == 254) {
  //         dialog.showMessageBoxSync({
  //           title: 'Robot is not ready!!',
  //           type: 'error',
  //           message: 'Please wait for the robot to finish starting up.\r\n',
  //         });
  //       }
  //       if (code == 255) {
  //         dialog.showMessageBoxSync({
  //           title: 'Emergency Stop!!',
  //           type: 'error',
  //           message: 'Please release emergency stop button.\r\n',
  //         });
  //       }
  //       flask_server.kill();
  //       websocket_server.kill();
  //       app.quit();
  //       spawn(
  //         '/home/ptz01/repo/palletizer-electron-ui/build/release/ElectronReact-3.0.2.AppImage',
  //         [],
  //         {
  //           encoding: 'utf8',
  //           shell: true,
  //         }
  //       );
  //   }
  // });

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };


  const isDev = require('electron-is-dev');
  const { URL } = require('url');

  // Define React App dev and prod base paths
  const devBasePath = 'http://localhost:1212/';
  

  const constructAppPath = (hashRoute = '') => {
    const basePath = isDev ? devBasePath : resolveHtmlPath('index.html');

    const appPath = new URL(basePath);

    // Add hash route to base url if provided
    if (hashRoute) appPath.hash = hashRoute;

    // Return the constructed url
    return appPath.href;
  };

console.log('initial path', constructAppPath());
console.log('hash path', constructAppPath('/dashboard'));
  mainWindow = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    kiosk: false,
    fullscreen: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  mainWindow.loadURL(constructAppPath('/'));
  let displays = electron.screen.getAllDisplays();
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
  console.log('displays:', displays);

  // if (externalDisplay) {
  if (externalDisplay) {
    var externaldisplay = new BrowserWindow({
      width: 1920,
      height: 1080,
      show:true,
      fullscreen:true,
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50,
    });
    externaldisplay.loadURL(constructAppPath('/dashboard'));
  }

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/main/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  //new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
