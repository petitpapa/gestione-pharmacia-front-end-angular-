

const {
    app, BrowserWindow, dialog
} = require('electron');

const decompress = require('decompress');
const child_process = require('child_process');
const requestPromise = require('minimal-request-promise');
let i18n;
const path = require('path');
const fs = require("fs");
let mainWindow = null;
let loading = null;
let serverProcess = null;
let allowClose = false;
const jreFolder = 'jdk11';
var url = require("url");

const waitPort = require('wait-port');

const params = {
    host: 'localhost',
    port: 5555,
};


function error_log(exception) {
    fs.appendFile('error.log', exception.stack + "\n", (err) => {
        if (err) throw err;
    });
}

try {
    const gotTheLock = app.requestSingleInstanceLock();

    const showApplication = function () {
        mainWindow = new BrowserWindow({
            title: i18n.__('application-name')
            , show: false
            , width: 1200
            , height: 800
            , frame: true
            , webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                allowRunningInsecureContent: true,//(serve) ? true : false,
                contextIsolation: false,
                enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
            },
        });
        mainWindow.setMenu(null);
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
        mainWindow.once('ready-to-show', () => {
            loading.hide();
            mainWindow.show();
        });
        mainWindow.on('closed', function () {
            mainWindow = null;
            app.quit();
        });
        mainWindow.on('close', function (e) {
            if (serverProcess && !allowClose) {
                dialog.showMessageBox(this, {
                    type: 'question'
                    , buttons: [i18n.__('yes'), i18n.__('no')]
                    , title: i18n.__('confirm')
                    , message: i18n.__("are-you-sure-you-want-to-quit")
                }).then(result => {
                    if (result.response === 0) {
                        allowClose = true;
                        app.quit();
                    }
                });
                e.preventDefault();
            }
        });
    };
    const awaitStartUp = function (appUrl, callback) {
        requestPromise.get(appUrl).then(function (response) {
            callback();
        }, function (response) {
            setTimeout(function () {
                awaitStartUp(appUrl, callback);
            }, 200);
        });
    };
    const focusSecondInstance = function () {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            if (mainWindow) {
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }
                mainWindow.focus();
            }
        })
    };


    const showStartUpErrorMessage = function () {
        setTimeout(function () {
            dialog.showMessageBox(null, {
                type: 'error'
                , buttons: [i18n.__('ok')]
                , title: i18n.__("java-runtime-not-available")
                , message: i18n.__("java-runtime-not-available-long")
            });
        }, 200);
    }
    const spawnServerProcess = function () {
        //  var filename = getJavaFile();
        var platform = process.platform;

        if (platform === 'win32') {
            child_process.exec(path.join(path.dirname(__dirname), '/java', '/Redis/redis-server.exe'));
            child_process.exec('chmod +X ' + path.join(path.dirname(__dirname), '/java', '/jdk11/bin/java'));

            return child_process.spawn(path.join(path.dirname(__dirname), '/java', '/jdk11/bin/java'), ['-jar', path.join(path.dirname(__dirname), '/java', '/pharma-app.war')]).on('error', function (code, signal) {
                '+ path.sep +'
                showStartUpErrorMessage();
                error_log(new Error('java exec:   ' + code))
            });
        } else {
            throw new Error("Platform not supported");
        }
    };
 
    const showLoadingScreen = function () {
        loading = new BrowserWindow({
            show: true
            , frame: false
            , width: 500
            , height: 280
        });
        loading.loadURL('file://' + app.getAppPath() + '/loading.html');
    };
    const beginStartUp = function () {
        (async () => {
            try {
                // const port = await getPort();
                serverProcess = spawnServerProcess();

                waitPort(params)
                    .then((open) => {
                        setTimeout(function () { }, 120000);
                        if (open) showApplication();
                    })
                    .catch((err) => {
                        error_log(err);
                    });
                // var appUrl = "http://localhost:" + port;

            } catch (e) {
                error_log(e);
            }
        })();
    }
    if (!gotTheLock) {
        app.quit()
    } else {
        focusSecondInstance();
        app.on('window-all-closed', function () {
            app.quit();
        });
        app.on('ready', function () {
            i18n = new (require('./translations/i18n'));
            try {
                showLoadingScreen();

                beginStartUp();
            } catch (e) {
                error_log(e);
            }
        });
        app.on('will-quit', function () {
            serverProcess.kill('SIGINT');
        });
    }
} catch (e) {
    error_log(e);
}