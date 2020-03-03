//Intercomunicación con Python
var myPythonScriptPath = 'test.py';
var PythonShell = require('python-shell');
var pyshell = new PythonShell(myPythonScriptPath);
//var path = document.getElementById('holder').files[0].path;
//document.getElementById('scorePersona').innerHTML=path;
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  alert(message);
});


function calcular() {
  var img = document.getElementById("scorePersona").innerHTML;

  var options = {
       mode: 'text',
       pythonPath: 'C:/Users/isaac/AppData/Local/Programs/Python/Python38-32',
       pythonOptions: ['-u'],
       // make sure you use an absolute path for scriptPath
       scriptPath: 'C:/Users/isaac/Documents/Electron/Archivos/Nucleo',
       args: [img]
     };
     alert(img);
     pyshell.send(img);
     PythonShell.run('test.py', options, function (err, results) {
       if (err) {
         alert(err);
       }
       // results is an array consisting of messages collected during execution
       alert(results);
     });
}
