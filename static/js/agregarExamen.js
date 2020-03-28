// Librerias necesarias para ejecutar electron, python y que no falle la ejecución de la consola en segundo plano.
const { PythonShell } = require('python-shell')
const { spawn } = require('child_process')
const myChildProc = spawn('my-command', ['my', 'args'], { shell: true })
const { dialog } = require('electron').remote

function obtener_respuestas() {
    var ruta_imagen = document.getElementById("oculto").innerHTML;
    var scan = String(document.getElementById("esEscaneada").checked);


    if (ruta_imagen == "") {
        dialog.showErrorBox('Error 1:', 'Ingrese un ID de examen para calificar el examen.');
    }
    else {
        var options = {
            mode: 'text',
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: 'C:/Users/isaac/Documents/Electron/static/python',
            args: [ruta_imagen, scan]
        };

        PythonShell.run('obtener_respuestas.py', options, function (error, resultados) {
            if (error) {
                dialog.showErrorBox('Error 10:', 'Consulta el manual de usuario para ver que puede causar este error.'); 
            }

            else {
                document.getElementById("cont").style.display = "none";
                var contenedor = document.getElementById("respuestasObtenidas");
                contenedor.style.display = "flex";
                var respuestas_extraidas = String(resultados);

                for (var i = 0; i < respuestas_extraidas.length; i++) {
                    var aux = (i+1).toString();
                    if (respuestas_extraidas[i] == "0") {
                        contenedor.innerHTML += '<div class="pregunta">' +
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +
                            ' <div class="inciso contestada">A</div>' + 
                            ' <div class="inciso">B</div>' + 
                            ' <div class="inciso">C</div>' + 
                            ' <div class="inciso">D</div>' + 
                            ' <div class="inciso">E</div>' +
                            '</div>';
                    }

                    else if (respuestas_extraidas[i] == "1") {
                        contenedor.innerHTML += '<div class="pregunta">' +
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +
                            ' <div class="inciso">A</div>' + 
                            ' <div class="inciso contestada">B</div>' + 
                            ' <div class="inciso">C</div>' + 
                            ' <div class="inciso">D</div>' + 
                            ' <div class="inciso">E</div>' +
                            '</div>';
                    }

                    else if (respuestas_extraidas[i] == "2") {
                        contenedor.innerHTML += '<div class="pregunta">' +
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +
                            ' <div class="inciso">A</div>' + 
                            ' <div class="inciso">B</div>' + 
                            ' <div class="inciso contestada">C</div>' + 
                            ' <div class="inciso">D</div>' + 
                            ' <div class="inciso">E</div>' +
                            '</div>';
                    }
                    
                    else if (respuestas_extraidas[i] == "3") {
                        contenedor.innerHTML += '<div class="pregunta">' +
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +
                            ' <div class="inciso">A</div>' + 
                            ' <div class="inciso">B</div>' + 
                            ' <div class="inciso">C</div>' + 
                            ' <div class="inciso contestada">D</div>' + 
                            ' <div class="inciso">E</div>' +
                            '</div>';
                    }
                    
                    else if (respuestas_extraidas[i] == "4") {
                        contenedor.innerHTML += '<div class="pregunta">' +
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +
                            ' <div class="inciso">A</div>' + 
                            ' <div class="inciso">B</div>' + 
                            ' <div class="inciso">C</div>' + 
                            ' <div class="inciso">D</div>' + 
                            ' <div class="inciso contestada">E</div>' +
                            '</div>';
                    }
                }

                contenedor.innerHTML += '<span id="validarOperacion" onclick="agregar_respuestas();">¡Si! es correcto</span>';
                document.getElementById('auxRespuestas').innerHTML = respuestas_extraidas;
            }
        });
    }
}

function agregar_respuestas() {
    var ruta_imagen = document.getElementById('auxRespuestas').innerHTML;
    
    var options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'],
        scriptPath: 'C:/Users/isaac/Documents/Electron/static/python',
        args: [ruta_imagen]
    };

    PythonShell.run('agregar_respuestas.py', options, function (error, resultados) {
        if (error) {
            dialog.showErrorBox('Error 11:', 'Consulta el manual de usuario para ver que puede causar este error.'); 
        }

        else {
            dialog.showMessageBox({
                message: "Examen guardado exitosamente con el ID: " + resultados, 
                title: "Tarea completada exitosamente."
            })
        }
    });
}