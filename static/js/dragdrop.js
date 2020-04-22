// Función que se ejecuta en el momento que alguien arrastra un archivo hacia la interfaz.
document.addEventListener('drop', (e) => {
    e.preventDefault();             // Callback para prevenir errores.
    e.stopPropagation();            // Callback para que deje de seguir el cursor despues de dejar un archivo.

    // Bucle: obtiene la ruta del archivo que el usuario arrastro.
    for (const f of e.dataTransfer.files) {
        // Se obtiene la ruta absoluta del archivo arrastrado.
        var ruta = f.path; 

        // Variables auxiliares para mostrar el nombre del archivo.
        var nameFile = "";
        var nombreFixed = "";

        // Bucle, se va a repetir la misma cantidad que tenga la cadena de caracteres anteriormente obtenida.
        for (var i = ruta.length; i > 0; i--) { 

            // Si encuentra una diagonal invertida, rompe el bucle y se guarda el nombre del archivo al revés.
            if (ruta[i - 1] == "\\") { 
                break;
            }
            nameFile += ruta[i - 1];
        }

        // Bucle, del tamaño de la cadena de caracteres del nombre del archivo, este bucle es para acomodar el nombre.
        for (var x = nameFile.length; x > 0; x--) {
            nombreFixed += nameFile[x - 1];
        }

        // Se muestra en la interfaz la miniatura de la imagen arrastrada y el nombre que tiene.
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