# EL REPRUEBAINADOR
*Este software fue creado con el fin de mejorar los procesos en la Universidad de Guadalajara, por lo que es publicado bajo una licencia GNU Affero General Public License GNU AGPLv3 , cualquier modificación de este programa, debera de ser publicado el código fuente bajo la misma licencia.*

**ATENCIÓN:** para ejecutar la interfaz grafica es necesario predisponer de Google Chrome, Chromium o Microsoft Edge basado en Chromium.

---

Guia para instalar esta madre:
1. Instalar dependencias de npm: 

>npm install

2. Las dependencias de Python pueden ser instaladas de la siguiente manera:

**Windows:**
>pip install -r requirements.txt

**Linux y MacOS:**
>sudo pip3 install -r requirements.txt
3. Ejecutar el comando para correr la interfaz grafica:
>npm start
4. Gozar.

---
# Por hacer:
    - [ X ] Detección de datos de estudiante mediante OCR.
    - [ X ] Ingreso de datos de estudiante y calificación obtenida en algun archivo.
    - [ X ] Producción en serie.

![Logotipo](static/images/Logo2.png)

# Patch notes:
**Versión 2.1.0 _(09/04/2020)_:** Terminada la función para calificar un examen de multiples columnas, falta que obtenga el código del alumno. Todo el resto de función esta totalmente integrada a la Interfaz Grafica. Tambien ya se eliminan los archivos residuales que generaba el programa para poder operar.

**Versión 2.2.0 _(10/04/2020)_:** Totalmente operacional la función que califica en secuencia, sin embargo falta escribir en el archivo CSV, corregidas las vistas que se se vieron afectadas por el cambio de navbar. Corregida la manera en la que guarda las respuestas de un examen dentro de un txt. Agregada la libreria Pandas al archivo **requirements.txt**.

_Agradecimientos especiales a Stack Overflow y a mi abuelita._
