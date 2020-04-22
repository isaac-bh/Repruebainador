// Importación de modulos para poder ejecutar la ventana y renderizarla.
const {app, BrowserWindow} = require('electron');
const path = require('path');

// Función para crear la ventana principal.
function crear_ventana () {
    // Definimos la constante mainWindow con un objeto tipo BrowserWindow.
    const mainWindow = new BrowserWindow({
        width: 1440,                                                            // Ancho.
        height: 750,                                                            // Alto.
        autoHideMenuBar: true,                                                  // Ocultar el menú contextual.
        frame: false,                                                           // Oculta los bordes que genera el sistema operativo.
        titleBarStyle: 'hidden',                                                // Oculta la barra de titulo.
        movable: 'true',                                                        // Define que la ventana a crear se puede mover.
        icon: path.join(__dirname, './static/images/icono.png'),                // Ruta del icono de la aplicación.
        webPreferences: {                                       
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    // En el momento que se crea la ventana se carga este archivo para mostrar.
    mainWindow.loadFile('./templates/index.html');
}

// Cuando la aplicación este lista, se ejectura la función createWindow.
app.on('ready', crear_ventana);

// Cuando se cierran todas las ventanas en ejecución, entra a esta función:
app.on('window-all-closed', function () {
    // Si la plataforma en ejecución es MacOS, es necesario que el 
    // usuario mate el proceso, ya que se ejecutara en segundo plano.
    if (process.platform !== 'darwin') {
        app.quit();
    } 
});

// Si la app se activa, se ejecuta esta función.
app.on('activate', function () {
    // Si no hay ninguna ventana ejecutandose, o no se muestra, o su valor es igual a 0, se crea una nueva ventana.
    if (BrowserWindow.getAllWindows().length === 0) {
        crear_ventana();
    }
});
