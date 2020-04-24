// Librerias necesarias para ejecutar electron, python y que no falle la ejecución de la consola en segundo plano.
const { PythonShell } = require('python-shell');
const { spawn } = require('child_process');
const myChildProc = spawn('my-command', ['my', 'args'], { shell: true });
const { dialog } = require('electron').remote;

// Función que se ejecuta si el usuario da click al boton para abrir una carpeta.
document.getElementById("agregar_carpeta").addEventListener("click", function() {
    // Se abre un dialogo del sistema para seleccionar una carpeta.
    const pathArray = dialog.showOpenDialogSync({properties: ['openDirectory']});
    var ruta_carpeta = pathArray[0];
    var plantilla = document.getElementById("oculto").innerHTML;
    // Si el usuario no ingreso un ID de examen, se muestra un error.
    if (ruta_carpeta == "") {
        dialog.showErrorBox('Error:', 'Ingrese la carpeta con la lista de alumnos.');
    }
    else {
        // Si el usuario no nombro al grupo, muestra un error.
        if (plantilla == "") {
            dialog.showErrorBox('Error:', 'Ingrese la plantilla.');
        }
        else{

            // Opciones para la ejecución de Python.
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: 'python', 
                args: [ruta_carpeta,plantilla]
            };

            // Se ejecuta Python, la ejecución puede arrojar 2 diferentes cosas, un error o un resultado.
            PythonShell.run('lista.py', options, function (error, resultados) {
                // Si existe un error, muestra un mensaje e imprime explicitamente el error en la consola para mayor información.
                if (error) {
                    dialog.showErrorBox('Error:', 'Consulte el manual de Usuario para ver como corregir este problema o contacte a el desarrollador.');
                    console.log(error);
                }
                // Si devuelve un resultado valido.
                else {
                    dialog.showMessageBox("Los archivos se han generado correctamente");
                }
            });
        }
    }
});

