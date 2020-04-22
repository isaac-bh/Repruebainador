// Librerias necesarias para ejecutar electron, python y que no falle la ejecución de la consola en segundo plano.
const { PythonShell } = require('python-shell')
const { spawn } = require('child_process')
const myChildProc = spawn('my-command', ['my', 'args'], { shell: true })
const { dialog } = require('electron').remote

// Función que llama a main.py para calcular la calificación del alumno.
function calcular() {
  // Obtenemos valores que necesitamos para enviarlos a Python.
  var scan = String(document.getElementById("esEscaneada").checked);
  var img = document.getElementById("oculto").innerHTML;
  mostrarResultado = document.getElementById("calficRes");
  var id = document.getElementById('idExamen').value;
  // Si no ingreso el ID se devuelve un error, si ingreso un ID entra a el proceso.
  if (id == "") {
    dialog.showErrorBox('Error 1:', 'Ingrese un ID de examen para calificar el examen.');
  } else {
    // Declaramos opciones para que funcione optimamente la comunicación entre Python y JavaScript.
    var options = {
      mode: 'text',
      pythonPath: 'python',
      pythonOptions: ['-u'],
      scriptPath: 'python', // Carpeta donde guardamos los scripts python.
      args: [img, id, scan]
    };

    // Ejecutamos Python.
    PythonShell.run('calificar_persona.py', options, function (error, resultados) {
      // Si existe un error, lo imprime en un alert.
      if (error) {
        dialog.showErrorBox('Error 2-5:', 'Consulte el manual de Usuario para ver como corregir este problema o contacte a el desarrollador.');
        console.log(error);
      }

      // Convertimos el resultado obtenido devuelto por Python a Float para manejarlo más facil.
      document.getElementById("alumnoRes").innerHTML = resultados[0];
      document.getElementById("codigoRes").innerHTML = resultados[1];
      x = parseFloat(resultados[2]);

      // Si x es mayor o igual a 60, esta aprobado, de lo contrario esta reprobado.
      if (x >= 60) {
        mostrarResultado.classList.remove("reprobado");
        mostrarResultado.classList.add("aprobado");
        mostrarResultado.innerHTML = x;
      } else {
        mostrarResultado.classList.remove("aprobado");
        mostrarResultado.classList.add("reprobado");
        mostrarResultado.innerHTML = x;
      }
    });
  }
}

// Función para validar si el Examen a comparar realmente existe y se tienen las respuestas.
function validarExamen() {
  // Guardamos el ID de examen que el usuario ingreso.
  var id = document.getElementById('idExamen').value;
  // Declaramos opciones para que funcione optimamente la comunicación entre Python y JavaScript.
  var options = {
    mode: 'text', // Modo de texto.
    pythonPath: 'python', //Reconocimiento de sistema para el comando python.
    pythonOptions: ['-u'],
    scriptPath: 'python', // Carpeta donde guardamos los scripts python.
    args: [id] // Valor a pasar.
  };

  // Ejecutamos Python.
  PythonShell.run('validar_examen.py', options, function (error, resultados) {
    // Si existe un error, lo imprime en un alert.
    if (error) {
      dialog.showErrorBox('Error 6:', 'Fallo Python, amén.');
      console.log(error);
    }

    // Si el resultado devuelto por Python es True, se añade la clase validado. Si no, se añade la clase noValidado
    if (resultados == "True") {
      document.getElementById("validarExamen").classList.remove("noValidado");
      document.getElementById("validarExamen").classList.add("validado");
    } else {
      document.getElementById("validarExamen").classList.remove("validado");
      document.getElementById("validarExamen").classList.add("noValidado");
    }
  });
}
