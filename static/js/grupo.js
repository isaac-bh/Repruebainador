// Librerias necesarias para ejecutar electron, python y que no falle la ejecución de la consola en segundo plano.
const { PythonShell } = require('python-shell');
const { spawn } = require('child_process');
const myChildProc = spawn('my-command', ['my', 'args'], { shell: true });
const { dialog } = require('electron').remote;

//Variables que ayudaran en todas las funciones.
var contenedor = document.getElementById("calificados");
var ruta_carpeta

// Función que se ejecuta si el usuario da click al boton para abrir una carpeta.
document.getElementById("agregar_carpeta").addEventListener("click", function() {
    // Se abre un dialogo del sistema para seleccionar una carpeta.
    const pathArray = dialog.showOpenDialogSync({properties: ['openDirectory']});
    ruta_carpeta = pathArray[0];

    // Se obtienen valores que el usuario ingreso en la interfaz. Identificador del examen, el nombre del grupo.
    var id_examenes = document.getElementById("id_examenes").value;
    var nombre_examen = document.getElementById("nombre_examen").value;
    var overlay = document.getElementById("overlay");

    // Si el usuario no ingreso un ID de examen, se muestra un error.
    if (id_examenes == "") {
        dialog.showErrorBox('Error 4:', 'Ingrese un ID de examen para calificar el examen.');
    }
    else {
        // Si el usuario no nombro al grupo, muestra un error.
        if (nombre_examen == "") {
            dialog.showErrorBox('Error 5:', 'Ingrese un nombre de identificación de grupo para guardar los datos correctamente.');
        }
        else{

            // Opciones para la ejecución de Python.
            var options = {
                mode: 'text',
                pythonPath: 'python',
                scriptPath: 'python',
                args: [nombre_examen]
            };

            loader.style.display = "block";
		    loader.style.opacity = "1";

            // Se ejecuta Python, la ejecución puede arrojar 2 diferentes cosas, un error o un resultado.
            PythonShell.run('verificar.py', options, function (error, resultados) {
                // Si existe un error, muestra un mensaje e imprime explicitamente el error en la consola para mayor información.
                if (error) {
                    dialog.showErrorBox('Error INDGRP:', 'Consulte el manual de Usuario para ver como corregir este problema o contacte a el desarrollador.');
                    console.log(error);
                    loader.style.opacity = "0";
				    loader.style.display = "none";
                }
                // Si devuelve un resultado valido.
                else {
                    // Se limpia el contenedor que muestra los resultados.
                    contenedor.innerHTML = "";
                    // Si el resultado devuelto por Python es igual a un 0, significa que el nombre que le puso al grupo, ya existia
                    // entonces necesita cambiar el nombre.
                    if (resultados[0] == 0) {
                      loader.style.opacity = "0";
  				    loader.style.display = "none";
                      overlay.style.visibility = "visible";
                    }
                    // Si el resultado es cualquier otro:
                    else {
                        ejecutar();
                    }
                }
          });
      }
    }
});


function ejecutar(){
      var id_examenes = document.getElementById("id_examenes").value;
      var nombre_examen = document.getElementById("nombre_examen").value;
      var loader = document.getElementById('loader');

      var options = {
          mode: 'text',
          pythonPath: 'python',
          scriptPath: 'python',
          args: [ruta_carpeta, id_examenes, nombre_examen]
      };
      loader.style.display = "block";
    loader.style.opacity = "1";
      PythonShell.run('calificar_grupo.py', options, function (error, resultados) {
          // Si existe un error, muestra un mensaje e imprime explicitamente el error en la consola para mayor información.
          if (error) {
              dialog.showErrorBox('Error INDGRP:', 'Consulte el manual de Usuario para ver como corregir este problema o contacte a el desarrollador.');
              console.log(error);
              loader.style.opacity = "0";
      loader.style.display = "none";
          }
          // Si devuelve un resultado valido.
          else {
                // Bucle, pasa a traves de todos los resultados devueltos por Python: Calificaciones, nombres y codigos.
                for (i = 0; i < resultados.length; i++) {
                    // Si el resultado en curso, es 100, se guarda 100 en X para no mostrar puntos decimales.
                    if (resultados[i] == 100) {
                        x = 100;
                    }
                    // Si no es 100, se guarda la calificación unicamente con 2 puntos decimales en X.
                    else {
                        x = parseFloat(Math.round(resultados[i] * 100) / 100).toFixed(2);
                    }

                    // Si X es menor a 60, el alumno se muestra como reprobado.
                    if (x < 60) {
                        contenedor.innerHTML += '<div class="alumno reprobado">' +
                            ' <p class="calificacion_alumno">'+ x +'</p>' +
                            ' <div class="datos_alumno">' +
                            ' <p class="codigo">'+ resultados[i+1] +'</p>' +
                            ' <p class="nombre_alumno">' + resultados[i+2] + '</p>' +
                            ' </div>' +
                            ' </div>';
                    }
                    // Si X es menor o igual a 70 y mayor o igual a 60, el alumno se muestra como aprobado en zona roja.
                    else if (x >= 60 && x <= 70) {
                        contenedor.innerHTML += '<div class="alumno casi-reprobado">' +
                            ' <p class="calificacion_alumno">'+ x +'</p>' +
                            ' <div class="datos_alumno">' +
                            ' <p class="codigo">'+ resultados[i+1] +'</p>' +
                            ' <p class="nombre_alumno">' + resultados[i+2] + '</p>' +
                            ' </div>' +
                            ' </div>';
                    }
                    // Si X es mayor a 70, se muestra como aprobado.
                    else {
                        contenedor.innerHTML += '<div class="alumno aprobado">' +
                            ' <p class="calificacion_alumno">'+ x +'</p>' +
                            ' <div class="datos_alumno">' +
                            ' <p class="codigo">'+ resultados[i+1] +'</p>' +
                            ' <p class="nombre_alumno">' + resultados[i+2] + '</p>' +
                            ' </div>' +
                            ' </div>';
                    }

                    // Función vital del bucle, el curso pasara de 3 en 3, asi solo se toma en cuenta las calificaciones en el bucle.
                    i = i + 2;
              }
            }
        });
      loader.style.opacity = "0";
      loader.style.display = "none";
}

document.getElementById("reemplazar").addEventListener("click", function() {
    var overlay = document.getElementById("overlay");
    ejecutar();
    overlay.style.visibility = "hidden";
});

document.getElementById("cancelar").addEventListener("click", function() {
    var overlay = document.getElementById("overlay");
    overlay.style.visibility = "hidden";
});

// Función para poder validar el ID que ingrese el usuario.
document.getElementById("verificar_id").addEventListener("click", function() {
    var id_examenes = document.getElementById("id_examenes").value;
    var options = {
        mode: 'text',           // Modo de texto.
        pythonPath: 'python',   //Reconocimiento de sistema para el comando python.
        scriptPath: 'python',   // Carpeta donde guardamos los scripts python.
        args: [id_examenes]     // Valor a pasar.
    };

    PythonShell.run('validar_examen.py', options, function (error, resultados) {
        // Si existe un error, lo imprime en un alert.
        if (error) {
            dialog.showErrorBox('Error INDPY:', 'Consulte el manual de Usuario para ver como corregir este problema o contacte a el desarrollador.');
        }

        // Si el resultado devuelto por Python es True, se le dice al usuario que si existe y en caso contrario le dice que no existe
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
        }
    }); // Fin traceback de python shell.
});
