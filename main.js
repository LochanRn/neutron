const electron = require('electron')
const path = require('path')
const url = require('url')
const nunjucks = require('electron-nunjucks')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

nunjucks.install(electron.app, {
    path: 'templates/' 
})
nunjucks.setContext('templates/index.html', {
  /* custom data to template */
  message: "Hello"
})

function createWindow () {
  let { width, height } = electron.screen.getPrimaryDisplay().size
  mainWindow = new BrowserWindow({width: width, height: height})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/templates/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // debug
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
