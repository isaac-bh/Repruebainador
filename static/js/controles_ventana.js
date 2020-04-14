var remote = require('electron').remote; 
var BrowserWindow = remote.BrowserWindow;
var max = false;
var cnt = 0;

function init() { 
    document.getElementById("minimizar").addEventListener("click", function (e) {
        var window = BrowserWindow.getFocusedWindow();
        window.minimize(); 
    });

    document.getElementById("maximizar").addEventListener("click", function (e) {
        var window = BrowserWindow.getFocusedWindow(); 
        if (max == false) {
            window.maximize(); 
            max = true;
        }
        else {
            window.unmaximize(); 
            max = false;
        }
    });

    document.getElementById("cerrar").addEventListener("click", function (e) {
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    }); 
}; 

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        init(); 
    }
};


document.getElementById('logo_principal').addEventListener('click', function () {
    cnt++;
    if (cnt == 5) {
        location.href ="easter.html";
    }
});