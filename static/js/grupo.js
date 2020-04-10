// Librerias necesarias para ejecutar electron, python y que no falle la ejecución de la consola en segundo plano.
const { PythonShell } = require('python-shell')
const { spawn } = require('child_process')
const myChildProc = spawn('my-command', ['my', 'args'], { shell: true })
const { dialog } = require('electron').remote

//Variables que ayudaran en todas las funciones.
var contenedor = document.getElementById("calificados");


document.getElementById("agregar_carpeta").addEventListener("click", function() {
    const { dialog } = require('electron').remote
    const pathArray = dialog.showOpenDialogSync({properties: ['openDirectory']})
    var ruta_carpeta = pathArray[0];
    var id_examenes = document.getElementById("id_examenes").value;
    var scan = String(document.getElementById("esEscaneada").checked);


    if (id_examenes == "") {
        dialog.showErrorBox('Error 1:', 'Ingrese un ID de examen para calificar el examen.');
    }
    else {
        var options = {
            mode: 'text',
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: 'python', // Carpeta donde guardamos los scripts python.
            args: [ruta_carpeta, id_examenes, scan]
        };

        PythonShell.run('calificar_grupo.py', options, function (error, resultados) { 
            if (error) {
                dialog.showErrorBox('Error 9:', 'Consulte el manual de Usuario para ver como corregir este problema o contacte a el desarrollador.');
                console.log(error);
            }
            else {
                contenedor.innerHTML = "";
                for (i = 0; i < resultados.length; i++) {
                    if (resultados[i] == 100) {
                        x = 100;
                    }
                    else {
                        x = parseFloat(Math.round(resultados[i]).toFixed(2));
                    }
                    
                    if (x < 60) {
                        contenedor.innerHTML += '<div class="alumno reprobado">' +
                            ' <p class="calificacion_alumno">'+ x +'</p>' +
                            ' <div class="datos_alumno">' + 
                            ' <p class="codigo">'+ resultados[i+1] +'</p>' + 
                            ' <p class="nombre_alumno">' + resultados[i+2] + '</p>' + 
                            ' </div>' + 
                            ' </div>';
                    }
                    else if (x >= 60 && x <= 70) {
                        contenedor.innerHTML += '<div class="alumno casi-reprobado">' +
                            ' <p class="calificacion_alumno">'+ x +'</p>' +
                            ' <div class="datos_alumno">' + 
                            ' <p class="codigo">'+ resultados[i+1] +'</p>' + 
                            ' <p class="nombre_alumno">' + resultados[i+2] + '</p>' + 
                            ' </div>' + 
                            ' </div>';
                    }
                    else {
                        contenedor.innerHTML += '<div class="alumno aprobado">' +
                            ' <p class="calificacion_alumno">'+ x +'</p>' +
                            ' <div class="datos_alumno">' + 
                            ' <p class="codigo">'+ resultados[i+1] +'</p>' + 
                            ' <p class="nombre_alumno">' + resultados[i+2] + '</p>' + 
                            ' </div>' + 
                            ' </div>';
                    }

                    i = i + 2;
                }
            }
        });
    }
});


// Función para poder validar el ID que ingrese el usuario.
document.getElementById("verificar_id").addEventListener("click", function() {
    var id_examenes = document.getElementById("id_examenes").value;
    var options = {
        mode: 'text', // Modo de texto.
        pythonPath: 'python', //Reconocimiento de sistema para el comando python.
        pythonOptions: ['-u'],
        scriptPath: 'python', // Carpeta donde guardamos los scripts python.
        args: [id_examenes] // Valor a pasar.
    };
    console.log(id_examenes)

    PythonShell.run('validar_examen.py', options, function (error, resultados) {
        // Si existe un error, lo imprime en un alert.
        if (error) {
          dialog.showErrorBox('Error 6:', 'Fallo Python, amén.');
          console.log(error);
        }
    
        // Si el resultado devuelto por Python es True, se añade la clase validado. Si no, se añade la clase noValidado
        if (resultados == "True") {
            dialog.showMessageBox({
                message: "El siguiente ID existe en la base de datos: " + id_examenes, 
                title: "Tarea completada exitosamente."
            })
        } 
        else {
            dialog.showMessageBox({
                message: "Verifique sus examenes guardados, porque este no existe.", 
                title: "La tarea fallo con exito."
            })
            console.log(resultados);
        }
    }); // Fin traceback de python shell.
});