// Librerias necesarias para ejecutar electron, python y que no falle la ejecución de la consola en segundo plano.
const { PythonShell } = require('python-shell');
const { spawn } = require('child_process');
const myChildProc = spawn('my-command', ['my', 'args'], { shell: true });
const { dialog } = require('electron').remote;

// Función que se ejecuta si el usuario da click al boton para abrir una carpeta.
document.getElementById("abrir_plantilla").addEventListener("click", function() {
    // Se abre un dialogo del sistema para seleccionar una carpeta.
    const pathArray = dialog.showOpenDialogSync({properties: ['openFile']});
    var plantilla = pathArray[0];
    var lista = document.getElementById("ocultoLista").innerHTML;
    // Si el usuario no ingreso un ID de examen, se muestra un error.
    if (lista == "") {
        dialog.showErrorBox('Error 7:', 'Ingrese la carpeta con la lista de alumnos.');
    }
    else {
        // Si el usuario no nombro al grupo, muestra un error.
        if (plantilla == "") {
            dialog.showErrorBox('Error 8:', 'Ingrese una plantilla.');
        }
        else{

            // Opciones para la ejecución de Python.
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: 'python',
                args: [lista, plantilla]
            };

            loader.style.display = "block";
		    loader.style.opacity = "1";

            // Se ejecuta Python, la ejecución puede arrojar 2 diferentes cosas, un error o un resultado.
            PythonShell.run('lista.py', options, function (error, resultados) {
                // Si existe un error, muestra un mensaje e imprime explicitamente el error en la consola para mayor información.
                if (error) {
                    dialog.showErrorBox('Error INDWRD:', 'Consulte el manual de Usuario para ver como corregir este problema o contacte a el desarrollador.');
                    console.log(error);
                    loader.style.opacity = "0";
				    loader.style.display = "none";
                }
                // Si devuelve un resultado valido.
                else {
                    dialog.showMessageBox({
                        message: "Examenes generados exitosamente.",
                        title: "La tarea se completo con exito."
                    });
                    loader.style.opacity = "0";
				    loader.style.display = "none";
                }
            });
        }
    }
});

document.getElementById("abrir_lista").addEventListener("click", function() {
    const pathArray = dialog.showOpenDialogSync({properties: ['openDirectory']});
    var ruta_lista = pathArray[0];
    document.getElementById("ocultoLista").innerHTML = ruta_lista;

    document.getElementById("lista").style.display = "none";
    document.getElementById("plantilla").style.display = "block";
});
