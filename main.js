const { app, BrowserWindow ,globalShortcut,dialog,Tray,Menu,shell,ipcMain} = require('electron');
const path = require('path');
const windowstateKeeper = require('electron-window-state');







function createWindow(){
    const mainWindowState=windowstateKeeper({
        defaultWidth:120,
        defaultHeight:150
    })
    const win = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: 850,
        height: 700,
        // alwaysOnTop: true,
        devtools: true,
        autoHideMenuBar: true,
        // frame: false,
        // resizable: false,
        title:"Tic Tac Toe",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation:false,
            // preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
    mainWindowState.manage(win);
}





app.on('ready',()=>{
    createWindow();
});