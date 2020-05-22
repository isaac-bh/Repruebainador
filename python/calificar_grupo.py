#!/usr/bin/env python
#_*_ coding: utf-8 _*_
# HORAS GASTADAS EN ESTA MIERDA: 28 Y CONTANDO.
# FECHA DE CREACIÓN: 12 DE ENERO DE 2020.
# Autor: Isaac Alain Benavides Hernandez.
#        Jesus Isaac Lomeli Flores
#        Jonathan Joshua Romo Valadez
# Patch Notes:
#   1.1. - Agregado el menú de opciones.
#   1.2. - Agregadas las funciones para obtener imagenes y las de comparaciones, sin embargo NINGUNA COMPARACIÓN FUNCIONA CORRECTAMENTE.
#   1.3. - Agregada la funcion para calificar en base a diferencias, esta en BETA.
#   1.4. - Agregada la funcion para estabilizar el documento, sin embargo falta el fix para poder pasarla por parametros.
#   1.5. - Función experimental(Non-Zero), se remplaza la función de comparación entre imagenes, ahora se compara por pixeles negativos.
#   1.6. - Actualización función Non-Zero: funciona bien, en etapa de pruebas para saber si funciona optimamente.
#       1.6.3. - Actualización función Non-Zero: probada con una hoja impresa y contestada por mi. Por ahora funciona. A espera de mas pruebas.
# Porfavor Jesucristo ayudame.

import argparse
import cv2
import imutils
import numpy as np
import os
import pathlib
import PIL.Image
import platform
import pytesseract
import sys
import time
import pandas as pd
from imutils import contours
from imutils.perspective import four_point_transform
from pytesseract import image_to_string
from PIL import Image
from os import remove

ruta_carpeta = sys.argv[1]
ide = sys.argv[2]
nombre = sys.argv[3]
ruta_absoluta = os.getcwd()
ruta_archivo = ruta_absoluta + "/python/respuestasExamenes.txt"

def Non_Zero(ruta_carpeta, ide, nombre):
    Path = pathlib.Path(ruta_carpeta)
    # Abrir archivo csv por pandas
    homedir = os.path.expanduser("~")
    directorio_documentos = homedir + "\\Documents\\Repruebainador\\CSV\\"
    archivo = directorio_documentos + nombre + ".csv"
    csv = open(archivo, "w")

    #Obtiene la imagen correspondiente a cada hoja de respuestas y las recorre
    for imagen in Path.iterdir():
        # Inicialización de imagen con tamaño corregido.
        compr_ext = comprobacion_extension(str(imagen))
        if compr_ext == True:
            try:
                img = Image.open(imagen)
                new_img = img.resize((1552,2000))
                new_img.save('ajuste.png','png')

                #Recorte de la parte del nombre
                img = cv2.imread('ajuste.png')
                crop_img = img[230:310, 200:1300]
                cv2.imwrite('nombre.png', crop_img)

                #Recorte del codigo
                crop_img = img[305:365, 200:450]
                cv2.imwrite('codigo.png', crop_img)

                #Leer el nombre de quien hizo el examen
                nombre = obtener_nombre()
                codigo = obtener_codigo()
                respuestas_Correctas, columnas = obtener_respuestas()
                recortar_imagen(img, columnas)

                # A cargar la imagen, convertimos a escala de grises, le damos un desenfoque, y encontramos los bordes.
                imagen = cv2.imread("fila.png")
                escala_Grises = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
                desenfocado = cv2.GaussianBlur(escala_Grises, (5, 5), 0)
                bordeado = cv2.Canny(desenfocado, 75, 200)

                # Encontramos contornos en el "mapa de contornos", inicializamos el contorno de la hoja para darle perspectiva.
                contornos = cv2.findContours(bordeado.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                contornos = imutils.grab_contours(contornos)
                num_Contornos = None

                # Nos aseguramos de que exista minimo 1 contorno
                if len(contornos) > 0:
                    # Ordenamos los contornos en orden de tamaño, orden descendente.
                    contornos = sorted(contornos, key=cv2.contourArea, reverse=True)

                    # Bucle sobre los contornos ordenados.
                    for c in contornos:
                        # Nos aproximamos a el contorno.
                        perimetro = cv2.arcLength(c, True)
                        aprox = cv2.approxPolyDP(c, 0.02 * perimetro, True)

                        # Si tenemos 4 puntos en el contorno, encontramos la hoja, finaliza el bucle.
                        if len(aprox) == 4:
                            num_Contornos = aprox
                            break


                base = imagen
                recortado = escala_Grises

                # Aplicacmos metodo de Umbral de Otsu para binarizar la imagen.
                umbral = cv2.threshold(recortado, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]

                # Encontramos contornos en la imagen binarizada, inicializamos la lista de contornos que corresponden a las preguntas.
                contornos = cv2.findContours(umbral.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                contornos = imutils.grab_contours(contornos)
                preguntas_Contorno = []

                # Bucle a traves de los contornos.
                for c in contornos:
                    # Calculamos el cuadro delimitador del contorno, luego usamos el cuadro delimitador para obtener la relación de aspecto.
                    (x, y, w, h) = cv2.boundingRect(c)
                    ar = w / float(h)

                    # Para etiquetar el contorno como una pregunta, la región debe ser lo suficientemente ancha,
                    # lo suficientemente alta y tener una relación de aspecto aproximadamente igual a 1.
                    if w >= 20 and h >= 20 and ar >= 0.9 and ar <= 1.1:
                        preguntas_Contorno.append(c)

                # Ordenamos los contornos de las preguntas de arriba a abajo, luego inicializamos el número total de respuestas correctas.
                preguntas_Contorno = contours.sort_contours(preguntas_Contorno, method="top-to-bottom")[0]
                correctas = 0

                # Cada pregunta tiene 5 respuestas posibles, para recorrer la pregunta en lotes de 5.
                for (q, i) in enumerate(np.arange(0, len(preguntas_Contorno), 5)):
                    # Ordenar los contornos de la pregunta actual de izquierda a derecha, luego inicializar el índice de la respuesta contestada.
                    contornos = contours.sort_contours(preguntas_Contorno[i:i + 5])[0]
                    respondida = None

                    # Recorremos los contornos ordenados.
                    for (j, c) in enumerate(contornos):
                        # Dibujamos un contorno en el inciso de la pregunta.
                        mascara_Recorte = np.zeros(umbral.shape, dtype="uint8")
                        cv2.drawContours(mascara_Recorte, [c], -1, 255, -1)

                        # Detectamos pixeles no negativos para identificar el inciso contestado.
                        mascara_Recorte = cv2.bitwise_and(umbral, umbral, mask=mascara_Recorte)
                        total = cv2.countNonZero(mascara_Recorte)

                        # Si la respuesta actual tiene el mayor numero de pixeles no negativos la marcamos como el inciso contestado.
                        if respondida is None or total > respondida[0]:
                            respondida = (total, j)

                    # Se elige el color de contorno para respuesta, en este caso es por si es incorrecta.
                    color = (0, 0, 255)
                    k = respuestas_Correctas[q]

                    # Checamos si el inciso contestado es correcto.
                    if k == respondida[1]:
                        #Si es correcto, cambiamos el color a verde y aumentamos el contador de respuestas correctas.
                        color = (0, 255, 0)
                        correctas += 1

                    # Dibujamos el contorno en el inciso correcto.
                    cv2.drawContours(base, [contornos[k]], -1, color, 3)

                # En base a el numero de preguntas y a los aciertos, calculamos su calificación.
                calificacion = (correctas / len(respuestas_Correctas)) * 100

                calificacion1 = str(calificacion)

                #Se guardan los datos en el csv
                filas = codigo + "," + nombre + "," + calificacion1 + "\n"
                csv.write(filas)

                print(calificacion)
                print(codigo)
                print(nombre)
                eliminar_residuales(columnas)
                sys.stdout.flush()
            except PIL.UnidentifiedImageError as e:
                pass
            except IndexError as a:
                pass
        else:
            pass

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
#                  Función maestra ancestral para obtener el nombre de la imagen recortada previamente                #
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
def obtener_nombre():
    os = platform.system()

    if os == "Windows":
        pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract'
        TESSDATA_PREFIX = 'C:/Program Files/Tesseract-OCR'

    nombre = pytesseract.image_to_string(PIL.Image.open('nombre.png').convert("RGB"), lang='eng', config='--psm 4 --oem 3')
    return nombre

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
#                  Función maestra ancestral para obtener el codigo de la imagen recortada previamente                #
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
def obtener_codigo():
    os = platform.system()

    if os == "Windows":
        pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract'
        TESSDATA_PREFIX = 'C:/Program Files/Tesseract-OCR'

    codigo = pytesseract.image_to_string(PIL.Image.open('codigo.png').convert("RGB"), lang='eng', config='--psm 4 --oem 3')
    return codigo

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
#               Función maestra ancestral para obtener las respuestas de un examen previamente guardado               #
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
def obtener_respuestas():
    respuestas_correc = {}
    diccionario = ""
    contador = 0
    respuestas = open(ruta_archivo, "r")
    for linea in respuestas.readlines():
        aux = ""
        # Bucle: por cada caracter dentro de la linea.
        for letra in linea:
            # Si la letra en curso del bucle es ":", se rompe el ciclo.
            if letra == ":":
                break
            # Si no, se suma la letra a la variable auxiliar.
            else:
                aux += letra

        # Si auxiliar es igual al ID deseado, entra.
        if aux == ide:
            # Bucle: se revisa en cada letra de la linea, si letra es igual a ":" se limpia el diccionario para que no guarde el ID.
            for letter in linea:
                if letter == ":":
                    diccionario = ""
                # Si letra es igual a "." se rompe el ciclo y se dejan de almacenar los caracteres en la variable diccionario.
                elif letter == ".":
                    columnas = int(linea[contador+1])
                    break
                else:
                    diccionario += letter
                contador += 1

    # Bucle: se repite la secuencia dependientemente de la longitud de diccionario es decir de las preguntas que tenga el examen.
    for x in range(len(diccionario)):
        # Se guarda en respuestas_Correctas el valor de diccionario en el campo que vaya el bucle.
        respuestas_correc[x] = int(diccionario[x])

    return respuestas_correc, columnas



# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
#               Función maestra ancestral para recortar las filas del examen y uniendolas en una                      #
#           sola imagen para poder manejar más facil la imagen y no tener problemas con el diccionario.               #
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
def recortar_imagen(img, columnas):
    # Recortamos la imagen redimencionada en tres correspondientes a la cantidad de columnas
    # Comienza el recorte y calificacion por columnas

    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # Procedimiento para 2 columnas o más de 25 preguntas y menos o igual a 50.
    if columnas == 1:
        primero = 214
        segundo = 814

        crop_img = img[530:1920, 580:1020]
        cv2.imwrite("fila.png", crop_img)


    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # Procedimiento para 2 columnas o más de 25 preguntas y menos o igual a 50. 1552x2000
    if columnas == 2:
        nombres = ["r1", "r2"]
        primero = 250
        segundo = 800

        for x in nombres:
            crop_img = img[530:1920, primero:segundo]
            cv2.imwrite(x + '.png', crop_img)
            primero = segundo
            segundo += 550

        r1 = Image.open('r1.png')
        r2 = Image.open('r2.png')
        fila = Image.new('RGB', (r1.width, r1.height + r2.height))
        fila.paste(r1, (0, 0))
        fila.paste(r2, (0, r1.height))
        fila.save('fila.png')

    # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    # Procedimiento para 3 columas o más de 50 preguntas, menor o igual a 75.
    elif columnas == 3:
        nombres = ["r1","r2","r3"]
        primero = 214
        segundo = 614

        for x in nombres:
            crop_img = img[530:1920, primero:segundo]
            cv2.imwrite(x + '.png', crop_img)
            primero = segundo
            segundo += 400

        r1 = Image.open('r1.png')
        r2 = Image.open('r2.png')
        r3 = Image.open('r3.png')
        fila = Image.new('RGB', (r1.width, r1.height + r2.height + r3.height))
        fila.paste(r1, (0, 0))
        fila.paste(r2, (0, r1.height))
        fila.paste(r3, (0, r1.height + r2.height))
        fila.save('fila.png')



# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
#          Función maestra ancestral para eliminar los archivos que se crean en el proceso de calificación.           #
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - #
def eliminar_residuales(columnas):
    remove('ajuste.png')
    remove('codigo.png')
    remove('nombre.png')
    remove('fila.png')
    if columnas == 2:
        remove('r1.png')
        remove('r2.png')
    elif columnas == 3:
        remove('r1.png')
        remove('r2.png')
        remove('r3.png')


def comprobacion_extension(parametroX):
    ext = parametroX.split(".")
    x = len(ext)
    if ext[x-1] == "png" or ext[x-1] == "jpg" or ext[x-1] == "jpeg":
        return True
    else:
        return False

# Declaración de una función para que se ejecuté el codigo.
Non_Zero(ruta_carpeta, ide, nombre)
