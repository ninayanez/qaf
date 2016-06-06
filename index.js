var app = require('app')
var BrowserWindow = require('browser-window')
var mainWindow

function init () {
  mainWindow = new BrowserWindow({
    'autoHideMenuBar':true,
    width: 1440,
    height: 900
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', function() {
    mainWindow = null;
  })
}

app.on('ready', init)

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') app.quit() 
})
