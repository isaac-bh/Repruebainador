const { dialog } = require('electron').remote;
const fs = require("fs");

window.addEventListener('load', function() {
    // Asynchronous read
    fs.readFile('./python/respuestasExamenes.txt', function (err, data) {
        if (err) {
            return console.error(err);
        }
        
        var contenedor = document.getElementById("cont_examenes");
        var allText = data.toString();
        var lineas = allText.split("\n");
                
        for(var i = 0; i < lineas.length; i++) {
            var nombre = lineas[i].split("$");      // Aqui se aprovecha el campo [1].
            var id = lineas[i].split(":");          // Aqui se aprovecha el campo [0].
            var auxcolum = lineas[i].split(".");    // Aqui se aprovecha el campo [1].
            var colum = auxcolum[1].split("$");     // Aqui se aprovecha el campo [0].
            

            if (colum[0] == "1") {
                var inyeccion = '<div class="examen col1" onclick="copy(\''+id[0]+'\');">' + 
                    '<p class="nombre_examen">'+ nombre[1] +'</p>' + 
                    '<p class="id_examen">'+ id[0] +'</p>' +
                    '</div>';

                contenedor.innerHTML += inyeccion;
            }

            if (colum[0] == "2") {
                var inyeccion = '<div class="examen col2" onclick="copy(\''+id[0]+'\');">' + 
                    '<p class="nombre_examen">'+ nombre[1] +'</p>' + 
                    '<p class="id_examen">'+ id[0] +'</p>' +
                    '</div>';

                contenedor.innerHTML += inyeccion;
            }

            if (colum[0] == "3") {
                var inyeccion = '<div class="examen col3" onclick="copy(\''+id[0]+'\');">' + 
                    '<p class="nombre_examen">'+ nombre[1] +'</p>' + 
                    '<p class="id_examen">'+ id[0] +'</p>' +
                    '</div>';

                contenedor.innerHTML += inyeccion;
            }
        }
    });
});


function copy(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    dialog.showMessageBox({
        message: "Se ha copiado el ID: " + text, 
        title: "Copiado con exito."
    })
}