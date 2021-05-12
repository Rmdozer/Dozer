# The purpose of this software is to not only satisfy CS 498 Capstone Project course requirements.
# But to also push me to the limit of learning how to use the included libraries,
# Boost my personal portfolio,
# and learn more about facial recognition.
# Written by Ryan Mendoza
# Written and updated throughout 02/2021-05/2021
# Languages: Python with the libraries below
# Resources: Too many to list, these will be included in the final paper

# Importing libraries needed.
import os
from datetime import datetime
import cv2
import face_recognition
import numpy as np
import tkinter as tk
from tkinter.filedialog import askdirectory
from PIL import Image, ImageTk

# Declaring variables
images = []
classNames = []

# Testing if CUDA is enabled
count = cv2.cuda.getCudaEnabledDeviceCount()
print("cheese", count)

# Creates GUI
window = tk.Tk()
window.title("Facial Recognition Attendance Tracker")
window.configure(background='yellow')
window.grid_rowconfigure(0, weight=1)
window.grid_columnconfigure(0, weight=1)
message = tk.Label(
    window, text="Facial Recognition Attendance Tracker",
    bg="blue", fg="white", width=50,
    height=3, font=('times', 30, 'bold'))
message.pack()
lmain = tk.Label(window)
lmain.pack()
captureDevice = cv2.VideoCapture(0)

# Gets directory of pictures, and prints out a list of the pictures within the directory
path = tk.filedialog.askdirectory()
cv2image = None
myList = os.listdir(path)
print(myList)

# Prints out the names of the people in the pictures
faceLoc = []
for cl in myList:

    # Original image
    curImg = cv2.imread(f'{path}/{cl}')
    images.append(curImg)
    name = os.path.splitext(cl)[0]
    classNames.append(name)
    detectedFaces = face_recognition.face_locations(curImg)
    print("DETECT:", detectedFaces)

    # Creates a copy of the image to have a new mask made.
    face = detectedFaces[0]
    faceLoc.append(detectedFaces)
    startY = (face[0] + face[2]) // 2

    # Mask variant 1
    maskImg = np.copy(curImg)
    cv2.rectangle(maskImg, (face[1], startY), (face[3], face[2]), (0, 255, 0), -1)
    images.append(maskImg)
    classNames.append(name)
    faceLoc.append(detectedFaces)

    # Skeleton to have a new mask made
    # maskImg2 = np.copy(curImg)
    # cv2.rectangle(maskImg2, (face[1], startY), (face[3], face[2]), (255, 255, 255), -1)
    # images.append(maskImg2)
    # classNames.append(name)
    # faceLoc.append(detectedFaces)

# Function to find the face encodings
encodeList = []
index = 0
for img in images:
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    cv2.imshow("FACE", img)
    cv2.waitKey(-1)
    encode = face_recognition.face_encodings(img, faceLoc[index])[0]
    encodeList.append(encode)
    index += 1
print('Encoding Completed')


# Function used to write the name and date into the Attendance CSV file
def mark(name):
    with open('Attendance.csv', 'w+') as f:
        f.write('Name,Date/Time')
        myDataList = f.readlines()
        nameList = []
        for line in myDataList:
            entry = line.split(',')
            nameList.append(entry[0])
        if name not in nameList:
            now = datetime.now()
            dtString = now.strftime('%D %H:%M:%S')
            f.writelines(f'\n{name},{dtString}')


# Function to preform main functionality of the program.
def getFrame():
    global cv2image
    _, frame = captureDevice.read()
    frame = cv2.flip(frame, 1)
    cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGBA)

    imgSmall = cv2.resize(frame, (0, 0), None, 0.25, 0.25)
    imgSmall = cv2.cvtColor(imgSmall, cv2.COLOR_BGR2RGB)

    facesWebcam = face_recognition.face_locations(imgSmall, model="cnn")
    # print("faces", facesWebcam)
    encodesWebcam = face_recognition.face_encodings(imgSmall, facesWebcam)

    for encodeFace, faceLoc in zip(encodesWebcam, facesWebcam):
        matches = face_recognition.compare_faces(encodeList, encodeFace)
        faceDis = face_recognition.face_distance(encodeList, encodeFace)
        print(faceDis)
        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            name = classNames[matchIndex]
            print(name)
            y1, x2, y2, x1 = faceLoc
            # Scales the face locations up
            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
            # Writes a label with the name of the found person
            cv2.putText(cv2image, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 255), 2)
            mark(name)

    # Implements the showing of the webcam in the GUI
    img = Image.fromarray(cv2image)
    imgtk = ImageTk.PhotoImage(image=img)
    lmain.imgtk = imgtk
    lmain.configure(image=imgtk)
    lmain.pack()
    lmain.after(10, getFrame)


# Implements the quit button in the GUI
quitWindow = tk.Button(window, text="Quit",
                       command=window.destroy, fg="white", bg="blue",
                       width=20, height=3, activebackground="Red",
                       font=('times', 15, ' bold '))
quitWindow.pack()

# Gets window frame and loops the Tkinter window
getFrame()
window.mainloop()
