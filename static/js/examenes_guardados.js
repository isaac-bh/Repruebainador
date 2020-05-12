const { dialog } = require('electron').remote;
const fileSystem = require("fs");

window.addEventListener('load', function() {
    // Asynchronous read
    fileSystem.readFile('./python/respuestasExamenes.txt', function (err, data) {
        var contenedor = document.getElementById("cont_examenes");

        if (err) {
            contenedor.innerHTML = "Error 3: Archivo respuestasExamenes.txt no encontrado.";
        }
        
        var todoTexto = data.toString();
        var lineas = todoTexto.split("\n");
                
        for(var i = 0; i < lineas.length; i++) {
            var nombre = lineas[i].split("$");      // Aqui se aprovecha el campo [1].
            var id = lineas[i].split(":");          // Aqui se aprovecha el campo [0].
            var auxcolum = lineas[i].split(".");    // Aqui se aprovecha el campo [1].
            var columnas = auxcolum[1].split("$");     // Aqui se aprovecha el campo [0].
            

            if (columnas[0] == "1") {
                var inyeccion = '<div class="examen col1" onclick="copy(\''+id[0]+'\');">' + 
                    '<p class="nombre_examen">'+ nombre[1] +'</p>' + 
                    '<p class="id_examen">'+ id[0] +'</p>' +
                    '</div>';

                contenedor.innerHTML += inyeccion;
            }

            if (columnas[0] == "2") {
                var inyeccion = '<div class="examen col2" onclick="copy(\''+id[0]+'\');">' + 
                    '<p class="nombre_examen">'+ nombre[1] +'</p>' + 
                    '<p class="id_examen">'+ id[0] +'</p>' +
                    '</div>';

                contenedor.innerHTML += inyeccion;
            }

            if (columnas[0] == "3") {
                var inyeccion = '<div class="examen col3" onclick="copy(\''+id[0]+'\');">' + 
                    '<p class="nombre_examen">'+ nombre[1] +'</p>' + 
                    '<p class="id_examen">'+ id[0] +'</p>' +
                    '</div>';

                contenedor.innerHTML += inyeccion;
            }
        }
    });
});


function copy(identificador) {
    var selectAux = document.createElement("textarea");
    document.body.appendChild(selectAux);
    selectAux.value = identificador;
    selectAux.select();
    document.execCommand("copy");
    document.body.removeChild(selectAux);
    dialog.showMessageBox({
        message: "Se ha copiado el ID: " + identificador, 
        title: "Copiado con exito."
    })
}