const url = require('url')
const path = require('path')
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')

let mainWindow = null
let childWindow = null


app.on('ready', function () {

  mainWindow = new BrowserWindow({
    center: true,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
  })

  //mainWindow.webContents.openDevTools()
  mainWindow.loadURL(url.format({
    protocol: 'file',
    slashes: true,
    pathname: path.join(__dirname, 'templates/login.html')
  }))

  mainWindow.webContents.on('dom-ready', function () {
    console.log('user-agent:', mainWindow.webContents.getUserAgent());
    //mainWindow.webContents.openDevTools()
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.on('closed', function () {
    mainWindow = null
    app.quit()
  })

createChildWindow()  
}) 

function createChildWindow() {
  childWindow = new BrowserWindow({
    parent: mainWindow,
    center: true,
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
})

childWindow.on('close', function (event) {
    event.preventDefault()
    childWindow.hide();
    //childWindow=null
})

childWindow.loadURL(url.format({
  protocol: 'file',
  slashes: true,
  pathname: path.join(__dirname, 'templates/result.html')
}), { userAgent: childWindow.webContents.getUserAgent() })
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') { app.exit() }
})

ipcMain.on('scrapeurl', (event, news) => {
  console.log(news)
  
  if(childWindow==null) {
    createChildWindow()
    childWindow.loadURL(url.format({
      protocol: 'file',
      slashes: true,
      pathname: path.join(__dirname, 'templates/result.html')
    }), { userAgent: childWindow.webContents.getUserAgent() })
  }
  childWindow.webContents.send('result', news);
  childWindow.show()
});

ipcMain.on('username', (event, username) => {
  console.log(username)
  mainWindow.webContents.send('user', username)
})


ipcMain.on('hereishtml', (event, html) => {
  mainWindow.send('extracthtml', html)
})
