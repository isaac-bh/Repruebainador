// Librerias necesarias para ejecutar electron, python y que no falle la ejecución de la consola en segundo plano.
const { PythonShell } = require('python-shell')
const { spawn } = require('child_process')
const myChildProc = spawn('my-command', ['my', 'args'], { shell: true })
const { dialog } = require('electron').remote

// Función para obtener las respuestas de un examen que el profesor agregue, sin emabrgo, esta función
// No guarda las respuestas dentro del TXT.
function obtener_respuestas() {
    // Se obtienen valores que el usuario ingresa en la interfaz y se guardan en variables para manejarlas posteriormente.
    var ruta_imagen = document.getElementById("oculto").innerHTML;
    var scan = String(document.getElementById("esEscaneada").checked);
    var columnas = document.getElementById("cantidad_columnas").value;

    // Si el usuario no arrastro ninguna imagen, muestra un error.
    if (ruta_imagen == "") {
        dialog.showErrorBox('Error:', 'Ingrese una imagen para continuar.');
    }
    else {
        // Se definen opciones para la correcta ejecución de Python y que valores se le van a pasar.
        var options = {
            mode: 'text',
            pythonPath: 'python',
            scriptPath: 'python',
            args: [ruta_imagen, scan, columnas]
        };

        // Se ejecuta Python, se ejecuta una función donde puede devolver 
        // dos posibles cosas, un error o resultados correctos.
        PythonShell.run('obtener_respuestas.py', options, function (error, resultados) {
            // Si existe un error, se muestra un mensaje de error. Y se imprime el error explicitamente en la consola
            // esto para que el programador tenga una idea más clara de que es lo que esta fallando.
            if (error) {
                dialog.showErrorBox('Error 10:', 'Consulta el manual de usuario para ver que puede causar este error.');
                console.log(error);
            }
            // En caso contrario de que exista un error.
            else {
                // Se oculta en la interfaz la sección donde se arrastra la imagen.
                document.getElementById("cont").style.display = "none";

                // Se guarda en una variable el nuevo contenedor que mostrara las respuestas del examen,
                // se muestra con el estilo "flex" para que muestre de manera correcta todas las preguntas.
                var contenedor = document.getElementById("respuestasObtenidas");
                contenedor.style.display = "flex";

                // Se declara una variable y se guardan en forma de cadena de caracteres los resultados que devuelva Python.
                var respuestas_extraidas = String(resultados);

                // Ciclo: se repetira la misma cantidad que el tamaño de la cadena de caracteres que devuelve Python.
                for (var i = 0; i < respuestas_extraidas.length; i++) {
                    var aux = (i+1).toString();                                     // Se obtiene el numero de pregunta en curso.
                    if (respuestas_extraidas[i] == "0") {                           // Si la respuesta de la pregunta en curso es A
                        contenedor.innerHTML += '<div class="pregunta">' +          // Se inyecta en el contenedor con el inciso A
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +    // Como respondida.
                            ' <div class="inciso contestada">A</div>' + 
                            ' <div class="inciso">B</div>' + 
                            ' <div class="inciso">C</div>' + 
                            ' <div class="inciso">D</div>' + 
                            ' <div class="inciso">E</div>' +
                            '</div>';
                    }
                    else if (respuestas_extraidas[i] == "1") {                      // Si la respuesta de la pregunta en curso es B
                        contenedor.innerHTML += '<div class="pregunta">' +          // Se inyecta en el contenedor con el inciso B
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +    // Como respondida.
                            ' <div class="inciso">A</div>' +                        
                            ' <div class="inciso contestada">B</div>' + 
                            ' <div class="inciso">C</div>' + 
                            ' <div class="inciso">D</div>' + 
                            ' <div class="inciso">E</div>' +
                            '</div>';
                    }
                    else if (respuestas_extraidas[i] == "2") {                      // Si la respuesta de la pregunta en curso es C
                        contenedor.innerHTML += '<div class="pregunta">' +          // Se inyecta en el contenedor con el inciso C
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +    // Como respondida.
                            ' <div class="inciso">A</div>' + 
                            ' <div class="inciso">B</div>' + 
                            ' <div class="inciso contestada">C</div>' + 
                            ' <div class="inciso">D</div>' + 
                            ' <div class="inciso">E</div>' +
                            '</div>';
                    }
                    else if (respuestas_extraidas[i] == "3") {                      // Si la respuesta de la pregunta en curso es D
                        contenedor.innerHTML += '<div class="pregunta">' +          // Se inyecta en el contenedor con el inciso D
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +    // Como respondida.
                            ' <div class="inciso">A</div>' + 
                            ' <div class="inciso">B</div>' + 
                            ' <div class="inciso">C</div>' + 
                            ' <div class="inciso contestada">D</div>' + 
                            ' <div class="inciso">E</div>' +
                            '</div>';
                    }   
                    else if (respuestas_extraidas[i] == "4") {                      // Si la respuesta de la pregunta en curso es E
                        contenedor.innerHTML += '<div class="pregunta">' +          // Se inyecta en el contenedor con el inciso E
                            ' <span class="numeroPregunta">'+ aux +'. </span>' +    // Como respondida.
                            ' <div class="inciso">A</div>' + 
                            ' <div class="inciso">B</div>' + 
                            ' <div class="inciso">C</div>' + 
                            ' <div class="inciso">D</div>' + 
                            ' <div class="inciso contestada">E</div>' +
                            '</div>';
                    }
                }

                // Cuando termina de inyectar el examen a la interfaz, se agrega un botón para que confirme que si son las respuestas que esperaba.
                contenedor.innerHTML += '<span id="validarOperacion" onclick="agregar_respuestas();">¡Si! es correcto</span>';
                document.getElementById('auxRespuestas').innerHTML = respuestas_extraidas;
            }
        });
    }
}

// Función para agregar las respuestas obtenidas anteriormente al archivo txt.
function agregar_respuestas() {
    // Se obtienen las respuestas que Python genero anteriormente.
    var ruta_imagen = document.getElementById('auxRespuestas').innerHTML;
    
    // Se definen opciones para la correcta ejecución de Python y que valores se le van a pasar.
    var options = {
        mode: 'text',
        pythonPath: 'python',
        scriptPath: 'python',
        args: [ruta_imagen]
    };

    // Se ejecuta Python, se ejecuta una función donde puede devolver 
    // dos posibles cosas, un error o resultados correctos.
    PythonShell.run('agregar_respuestas.py', options, function (error, resultados) {
        // Si existe un error, se muestra un mensaje de error. Y se imprime el error explicitamente en la consola
        // esto para que el programador tenga una idea más clara de que es lo que esta fallando.
        if (error) {
            dialog.showErrorBox('Error:', 'Consulta el manual de usuario para ver que puede causar este error.');
            console.log(error);
        }
        // En caso contrario, si devuelve un resultado exitoso.
        else {
            // Se muestra un mensaje de confirmación de que las respuestas fueron guardadas junto con el identificador unico.
            dialog.showMessageBox({
                message: "Examen guardado exitosamente con el ID: " + resultados, 
                title: "Tarea completada exitosamente."
            });
        }
    });
}

document.getElementById("agregar_imagen").addEventListener("click", function() {
    const pathArray = dialog.showOpenDialogSync({properties: ['openFile']});
    var ruta_archivo = pathArray[0];
    var vista_previa = document.getElementById("previo");
    vista_previa.setAttribute("src", ruta_archivo);
    document.getElementById("oculto").innerHTML = ruta_archivo;
});