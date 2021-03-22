import cv2
import numpy as np
import face_recognition

imgRyan = face_recognition.load_image_file('Images/RyanImage.jpg')
imgRyan = cv2.cvtColor(imgRyan,cv2.COLOR_BGR2RGB)
imgTest = face_recognition.load_image_file('Images/RyanTest.jpg')
imgTest = cv2.cvtColor(imgTest,cv2.COLOR_BGR2RGB)

faceLoc = face_recognition.face_locations(imgRyan)[0]
encodeRyan = face_recognition.face_encodings(imgRyan)[0]
cv2.rectangle(imgRyan,(faceLoc[3],faceLoc[0]),(faceLoc[1],faceLoc[2]),(0,255,255),2)

faceLocTest = face_recognition.face_locations(imgTest)[0]
encodeTest = face_recognition.face_encodings(imgTest)[0]
cv2.rectangle(imgTest,(faceLocTest[3],faceLocTest[0]),(faceLocTest[1],faceLocTest[2]),(0,255,255),2)

results = face_recognition.compare_faces([encodeRyan],encodeTest)
faceDis = face_recognition.face_distance([encodeRyan],encodeTest)
print(results,faceDis)
cv2.putText(imgTest,f'{results} {round(faceDis[0],2)}',(50,50),cv2.FONT_HERSHEY_COMPLEX,1,(0,255,255),2)

cv2.imshow('Ryan Mendoza',imgRyan)
cv2.imshow('Ryan Test',imgTest)
cv2.waitKey(0)
