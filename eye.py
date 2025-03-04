import cv2
import mediapipe as mp
import numpy as np
from scipy.spatial import distance

# Initialize Mediapipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)

# Eye landmarks based on MediaPipe
LEFT_EYE_LANDMARKS = [362, 385, 387, 263, 373, 380]
RIGHT_EYE_LANDMARKS = [33, 160, 158, 133, 153, 144]

# Eye Aspect Ratio (EAR) function
def eye_aspect_ratio(eye_landmarks, landmarks):
    A = distance.euclidean(landmarks[eye_landmarks[1]], landmarks[eye_landmarks[5]])
    B = distance.euclidean(landmarks[eye_landmarks[2]], landmarks[eye_landmarks[4]])
    C = distance.euclidean(landmarks[eye_landmarks[0]], landmarks[eye_landmarks[3]])
    ear = (A + B) / (2.0 * C)
    return ear

# EAR threshold (Adjust if needed)
EYE_AR_THRESHOLD = 0.25

# Start video capture
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Convert frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            landmarks = {i: (landmark.x * frame.shape[1], landmark.y * frame.shape[0]) 
                         for i, landmark in enumerate(face_landmarks.landmark)}

            # Calculate EAR for both eyes
            left_ear = eye_aspect_ratio(LEFT_EYE_LANDMARKS, landmarks)
            right_ear = eye_aspect_ratio(RIGHT_EYE_LANDMARKS, landmarks)
            avg_ear = (left_ear + right_ear) / 2.0

            # Display status
            if avg_ear < EYE_AR_THRESHOLD:
                cv2.putText(frame, "Eyes Closed", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            else:
                cv2.putText(frame, "Eyes Open", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Show the frame
    cv2.imshow("Eye Detection", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
