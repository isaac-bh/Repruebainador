##################################################################
##################################################################
##  FUNCION PARA AGREGAR EXAMENES NUEVOS EN BASE A UNA IMAGEN   ##
##################################################################
## ############################################################ ##
##                  AGRADECIMIENTOS ESPECIALES A:               ##
##                      - StackOverflow.                        ##
##                      - Mi santa madre por alimentarme.       ##
##                      - A la persona que esta leyendo esto.   ##
##                        Na mentira, ni hiciste nada xd.       ##
##################################################################
##################################################################
import cv2
import os
import time
from imutils.perspective import four_point_transform
from imutils import contours
import numpy as np
import argparse
import imutils
import sys

img = sys.argv[1]
es_escaneada = sys.argv[2]

def Non_Zero(img, es_escaneada):
    # Definimos las respuestas correctas del examen.
    respuestas_Correctas = ""

    # A cargar la imagen, convertimos a escala de grises, le damos un desenfoque, y encontramos los bordes.
    imagen = cv2.imread(img)
    escala_Grises = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
    desenfocado = cv2.GaussianBlur(escala_Grises, (5, 5), 0)
    bordeado = cv2.Canny(desenfocado, 75, 200)

    # Encontramos contornos en el "mapa de contornos", inicializamos el contorno de la hoja para darle perspectiva.
    contornos = cv2.findContours(bordeado.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contornos = imutils.grab_contours(contornos)
    num_Contornos = None

    # Nos aseguramos de que exista minimo 1 contorno
    if len(contornos) > 0:
        # Ordenamos los contornos en orden de tamaño, orden desendiente.
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
    
    # Aplicamos la perspectiva para transformar la imagen original en una imagen mejor presentada. 
    if es_escaneada == "true":
        base = imagen # four_point_transform(imagen, num_Contornos.reshape(4, 2))
        recortado = escala_Grises #four_point_transform(escala_Grises, num_Contornos.reshape(4, 2))
    elif es_escaneada == "false":
        base = four_point_transform(imagen, num_Contornos.reshape(4, 2))
        recortado = four_point_transform(escala_Grises, num_Contornos.reshape(4, 2))
    else:
        exit()

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

            # Detectamos pixeles negativos para identificar el inciso contestado.
            mascara_Recorte = cv2.bitwise_and(umbral, umbral, mask=mascara_Recorte)
            total = cv2.countNonZero(mascara_Recorte)

            # Si la respuesta actual tiene el mayor numero de pixeles negativos la marcamos como el inciso contestado.
            if respondida is None or total > respondida[0]:
                respondida = (total, j)

        # Se elige el color de contorno para respuesta, en este caso es por si es incorrecta.
        color = (0, 0, 255)
        respuestas_Correctas += str(respondida[1])

    print(respuestas_Correctas)


Non_Zero(img, es_escaneada)