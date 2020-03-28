// Evento para arrastrar imagen.
document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Bucle: obtiene la ruta de los archivos dejados.
    for (const f of e.dataTransfer.files) {
        var ruta = f.path; 
        var nameFile, nombreFixed = ""; 
        for (var i = ruta.length; i > 0; i--) { 
            if (ruta[i - 1] == "\\") { 
                break;
            }
            nameFile += ruta[i - 1];
        }
        for (var x = nameFile.length; x > 0; x--) {
            nombreFixed += nameFile[x - 1];
        }

        document.getElementById("oculto").innerHTML = f.path;
        document.getElementById("holder").innerHTML = '<img src="' + f.path + '" alt="" id="previo">';
        document.getElementById("holder").innerHTML += nombreFixed;
    }
});
// Deja de seguir el cursor para que ya no arrastre nada.
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});