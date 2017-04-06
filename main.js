const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path');
const url = require('url');
let $ = require('jquery');
let mainWindow;
var Server = require('electron-rpc/server')
var rpc = new Server()

electron.app.on('browser-window-created',function(e,window) {
  window.$ = $;
  window.jQuery = $;
  rpc.configure(window.webContents) // pass a BrowserWindow.webContents[1] object
});

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minHeight: 600,
    minWidth: 870,
    frame: false
  });

  mainWindow.setMenu(null);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/ui/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  });


  rpc.on('window_minimize', function(){
    console.log("window_minimize")
    mainWindow.minimize();
  });

  rpc.on('window_maximize', function(){
    console.log("window_maximize")
    mainWindow.maximize();
  });

  rpc.on('window_close', function(){
    console.log("window_close");
    app.quit();
  });

}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
