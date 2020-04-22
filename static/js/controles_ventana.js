// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //
//  Este documento JavaScript es unicamente hace los controles de la ventana:   //
//  - Minimizar, Maximizar, Cerrar, Easter Egg.                                 //
//  - Propiedad para poder mover la ventana.                                    //
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  //

// Importaciones de Electron y el manejo de ventanas
var remote = require('electron').remote; 
var BrowserWindow = remote.BrowserWindow;

// Variables auxiliares para maximizar y minimizar tamaño, y el contador para el Easter Egg.
var max = false;
var cnt = 0;

// Función que se llama en el momento que la apliación se cargo.
function init() { 
    // Si se da click en el botón de minimizar se ejecuta esta función.
    document.getElementById("minimizar").addEventListener("click", function (e) {
        var window = BrowserWindow.getFocusedWindow();      // Se obtiene la ventana que se utiliza.
        window.minimize();                                  // Se minimiza esa misma ventana.
    });

    // Si se da click en el botón de maximizar se ejecuta esta función.
    document.getElementById("maximizar").addEventListener("click", function (e) {
        var window = BrowserWindow.getFocusedWindow();      // Se obtiene la ventana que se utiliza.
        // Si la variable max es falsa, se maximiza la ventana, si max es verdadera, se reduce el tamaño de ventana.
        if (max == false) {
            window.maximize(); 
            max = true;
        }
        else {
            window.unmaximize(); 
            max = false;
        }
    });
    
    // Si se da click en el botón de cerrar se ejecuta esta función.
    document.getElementById("cerrar").addEventListener("click", function (e) {
        var window = BrowserWindow.getFocusedWindow();      // Se obtiene la ventana que se utiliza.
        window.close();                                     // Se cierra la ventana.
    }); 
}; 

// Cuando la aplicación este lista, se ejecuta la función init.
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        init(); 
    }
};

// Si se da click en el logo principal, se entra a esta función.
document.getElementById('logo_principal').addEventListener('click', function () {
    cnt++;                                              
    // Si el valor de contador es igual a 5, se redirige al Easter Egg.
    if (cnt == 5) {
        location.href ="easter.html";
    }
});