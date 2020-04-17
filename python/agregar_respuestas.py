#!/usr/bin/env python
#_*_ coding: utf-8 _*_

import sys
import random
import os

respuestas_examen = sys.argv[1]
ruta_absoluta = os.getcwd()
ruta_archivo = ruta_absoluta + "/python/respuestasExamenes.txt"

def escribir_respuestas(respuestas_examen):
    random_id = generar_id()
    # Genera numero de columnas.
    if len(respuestas_examen) <= 25:
        columnas = "1"
    elif len(respuestas_examen) > 25 and len(respuestas_examen) <= 50:
        columnas = "2"
    else:
        columnas = "3"

    # Guardar respuestas.
    archivo = open(ruta_archivo, "a")
    archivo.write("\n" + random_id + ":" + respuestas_examen + "." + columnas)
    print(random_id)

def generar_id():
    identificador = ""
    lista = "ABCDEFGHIJKLMNOPQRSTUVXYZ1234567890"

    for x in range(0,5):
        identificador += random.choice(lista)
    
    archivo = open(ruta_archivo, "r")
    for linea in archivo.readlines():
        aux = ""
        # Bucle: por cada caracter dentro de la linea.
        for letra in linea:
            # Si la letra en curso del bucle es ":", se rompe el ciclo.
            if letra == ":":
                break
            # Si no, se suma la letra a la variable auxiliar.
            else:
                aux += letra
        
        # Si auxiliar es igual al ID deseado, se retorna True
        if aux == identificador:
            generar_id()
        else:
            return identificador

escribir_respuestas(respuestas_examen)