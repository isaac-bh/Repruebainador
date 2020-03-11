// Intercomunicación con Python.
// Importamos el modulo de PythonShell con Node.js.
const {PythonShell} = require('python-shell')
// Importamos child_process para el correcto funcionamiento de python-shell.
const { spawn } = require('child_process')
// Definimos la opción para poder pasar datos entre ambos lenguajes.
const myChildProc = spawn('my-command', ['my', 'args'], {shell: true})
const {dialog} = require('electron').remote

// Función que llama a main.py para calcular la calificación del alumno.
function calcular() {
  var scan = String(document.getElementById("esEscaneada").checked);
  // Obtenemos la ruta de la imagen a escanear.
  var img = document.getElementById("oculto").innerHTML;
  // Guardamos un campo de la página para mostrar resultados posteriormente.
  mostrarResultado = document.getElementById("calficRes");
  // Guardamos el ID de examen que el usuario ingreso.
  var id = document.getElementById('idExamen').value;

  // Si no ingreso el ID se devuelve un error, si ingreso un ID entra a el proceso.
  if(id==""){
    dialog.showErrorBox('Error 1:','Ingrese un ID de examen para calificar el examen.');
  }
  else {
    // Declaramos opciones para que funcione optimamente la comunicación entre Python y JavaScript.
    var options = {
        mode: 'text', // Modo de texto.
        pythonPath: 'python', // Busca en el sistema si reconoce el comando Python.
        pythonOptions: ['-u'],
        scriptPath: 'C:/Users/isaac/Documents/Electron/static/python', // Carpeta donde tenemos los scripts de Python.
        args: [img, id, scan] // Valor a pasar.
      };

      document.getElementById("main").style.opacity = "0";
      document.getElementById("main").style.visibility = "hidden";

      document.getElementById("loader").style.opacity = "1";
      setTimeout(function(){ 
        document.getElementById("loader").style.opacity = "0";

        document.getElementById("main").style.visibility = "visible";
        document.getElementById("main").style.opacity = "1";
      }, 5000);
    // Ejecutamos Python.
    PythonShell.run('main.py', options, function (error, resultados) {
      // Si existe un error, lo imprime en un alert.
      if (error) {
        dialog.showErrorBox('Error 2-5:','Consulte el manual de Usuario para ver como corregir este problema o contacte a el desarrollador.');
      }
      
      // Convertimos el resultado obtenido devuelto por Python a Float para manejarlo más facil.
      x = parseFloat(resultados);

      // Si x es mayor o igual a 60, esta aprobado, de lo contrario esta reprobado.
      if (x >= 60) {
        mostrarResultado.classList.remove("reprobado");
        mostrarResultado.classList.add("aprobado");
        mostrarResultado.innerHTML=resultados;
      }
      else {
        mostrarResultado.classList.remove("aprobado");
        mostrarResultado.classList.add("reprobado");
        mostrarResultado.innerHTML=resultados;
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
    scriptPath: 'C:/Users/isaac/Documents/Electron/static/python', // Carpeta donde guardamos los scripts python.
    args: [id] // Valor a pasar.
  };
  
  // Ejecutamos Python.
  PythonShell.run('validarExamen.py', options, function (error, resultados) {
    // Si existe un error, lo imprime en un alert.
    if (error) {
      dialog.showErrorBox('Error 6:','Fallo Python, amén.');
    }

    // Si el resultado devuelto por Python es True, se añade la clase validado. Si no, se añade la clase noValidado
    if (resultados == "True") {
      document.getElementById("validarExamen").classList.remove("noValidado");
      document.getElementById("validarExamen").classList.add("validado");
    }
    else {
      document.getElementById("validarExamen").classList.remove("validado");
      document.getElementById("validarExamen").classList.add("noValidado");
    }
  });
}