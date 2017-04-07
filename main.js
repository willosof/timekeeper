const electron = require('electron');
const app = electron.app;
const debug = require("debug-electron")("app");
const BrowserWindow = electron.BrowserWindow
const path = require('path');
const url = require('url');

// jQuery for convenience
let $ = require('jquery');

// Define main window
let mainWindow;
let displayWindow;

// RPC for browser windows
var Server = require('electron-rpc/server');
var rpc = new Server();

var masterclock_running = false;
var masterclock_timer;

var masterclock_tick = function() {
  var now = new Date();
  rpc.send('masterclock_tick', now);
};

var masterclock_init = function() {
  if (masterclock_running == false) {
    masterclock_timer = setInterval(masterclock_tick, 1000/25);
    debug("masterclock","started");
    masterclock_running = true;
  }
};

electron.app.on('browser-window-created',function(e,window) {
  window.$ = $;
  window.jQuery = $;
  rpc.configure(window.webContents) // pass a BrowserWindow.webContents[1] object
});

app.on('ready', function() {

  var screen = electron.screen;
  var size = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
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
    debug("window_main","minimize");
    mainWindow.minimize();
  });

  rpc.on('window_maximize', function(){
    debug("window_main","maximize");
    mainWindow.maximize();
  });

  rpc.on('window_close', function(){
    debug("window_main","close");
    app.quit();
  });

  rpc.on('window_main_ready', function() {
    var displays = screen.getAllDisplays();
    debug("window_main","ready");
    masterclock_init();
  });

  screen.on('display-added', function(e, newDisplay) {
    debug("display","added", newDisplay);
    rpc.send('display_added', e, newDisplay);
  });

  screen.on('display-removed', function(e, oldDisplay) {
    debug("display","removed", oldDisplay);
    rpc.send('display_removed', e, oldDisplay);
  });

  screen.on('display-metrics-changed', function(e, display, changedMetrics) {
    debug("display","metrics-changed", display, changedMetrics);
    rpc.send('display_added', e, display, changedMetrics);
  });


});
app.on('window-all-closed', function () {
  app.quit()
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
