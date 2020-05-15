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

nombre = sys.argv[1]

def Non_Zero(nombre):
    # Abrir archivo csv por pandas
    homedir = os.path.expanduser("~")
    directorio_documentos = homedir + "\\Documents\\Repruebainador\\CSV\\"
    archivo = directorio_documentos + nombre + ".csv"
    if os.path.isfile(archivo):
        verificacion = 0
        print(verificacion)
        sys.stdout.flush()
    else:
        verificacion = 1
        print(verificacion)
        sys.stdout.flush()

# Declaración de una función para que se ejecuté el codigo.
Non_Zero(nombre)
