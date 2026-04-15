const { app, BrowserWindow, globalShortcut, dialog, Tray, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const windowstateKeeper = require('electron-window-state');
const connectDB = require("./database.js");

let win = null;


//window

function createWindow() {
    const mainWindowState = windowstateKeeper({
        defaultWidth: 120,
        defaultHeight: 150
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
        title: "Tic Tac Toe",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
    mainWindowState.manage(win);

    win.on('close', (e) => {
        if (!app.isQuiting) {
            e.preventDefault();
            win.hide();
        }
    });
}


//tray

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

//second instance

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (win) {
            if (win.isMinimized()) win.restore();
            if (!win.isVisible()) win.show();
            win.focus();
        }
    });
}




//ipc handle

ipcMain.handle("add-alarm", async (event, alarm) => {
    const db = await connectDB();
    const result = await db.collection("alarms").insertOne(alarm);
    console.log("inserted result : ", result);
    return result;
});

ipcMain.handle("clear-alarm", async (event, alarm) => {
    const db = await connectDB();
    const result = await db.collection("alarms").deleteMany({});
    return result;
});

ipcMain.handle("get-alarms", async (event) => {
    try {
        const db = await connectDB();
        const users = await db.collection("alarms").find().toArray();
        const users2 = Object.values(users[0]);
        users2.pop();
        console.log(users2);
        return users2;
    } catch (err) {
        console.error(err);
        throw err;
    }
});




app.on('ready', () => {
    createWindow();
    createTray();
});