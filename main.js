const { app, BrowserWindow ,globalShortcut,dialog,Tray,Menu,shell,ipcMain} = require('electron');
const path = require('path');
const windowstateKeeper = require('electron-window-state');

let win = null;


function createWindow(){
    const mainWindowState=windowstateKeeper({
        defaultWidth:120,
        defaultHeight:150
    })
    win = new BrowserWindow({
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

    win.on('close', (e) => {
        if (!app.isQuiting) {
            e.preventDefault();
            win.hide(); // 👈 hide instead of close
        }
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open',
            click: () => {
                win.show();
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Clock App');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        win.show();
    });
}



app.on('ready',()=>{
    createWindow();
    createTray();
});