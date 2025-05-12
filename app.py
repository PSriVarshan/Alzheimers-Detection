from flask import Flask, request, jsonify, render_template
import tensorflow as tf
import numpy as np
import pydicom
from pydicom.pixel_data_handlers.util import apply_voi_lut
import cv2
import os
from PIL import Image  # For saving as JPG

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['CONVERTED_FOLDER'] = 'converted'

# Load the trained model
model = tf.keras.models.load_model('model.h5')

class_names = ['MildDemented', 'ModerateDemented', 'NonDemented', 'VeryMildDemented'] 

IMG_HEIGHT = 128
IMG_WIDTH = 128

def preprocess_and_convert_dicom(dcm_path, save_as_jpg=True):
    """
    Preprocess a DICOM file and optionally save it as a JPG.
    Returns the preprocessed image for model input.
    """
    dicom = pydicom.dcmread(dcm_path)
    data = apply_voi_lut(dicom.pixel_array, dicom)
    data = (data - np.min(data)) / (np.max(data) - np.min(data)) * 255.0  # Normalize to 0-255
    data = data.astype(np.uint8)  # Convert to 8-bit integer

    # Resize for the model
    resized_image = cv2.resize(data, (IMG_WIDTH, IMG_HEIGHT))

    # Convert grayscale to RGB if needed
    if len(resized_image.shape) == 2:
        resized_image = np.stack([resized_image] * 3, axis=-1)

    # Save as JPG if needed
    if save_as_jpg:
        os.makedirs(app.config['CONVERTED_FOLDER'], exist_ok=True)
        jpg_path = os.path.join(app.config['CONVERTED_FOLDER'], os.path.basename(dcm_path).replace('.dcm', '.jpg'))
        Image.fromarray(resized_image).save(jpg_path)
        print(f"DICOM file converted and saved as: {jpg_path}")
    
    # Normalize for model input
    resized_image = resized_image / 255.0
    return resized_image

def predict_dicom(file_path):
    """
    Convert, preprocess, and make predictions on a DICOM file.
    """
    preprocessed_image = preprocess_and_convert_dicom(file_path)
    image_batch = np.expand_dims(preprocessed_image, axis=0)
    predictions = model.predict(image_batch)
    predicted_class = np.argmax(predictions[0])
    confidence = predictions[0][predicted_class]
    return class_names[predicted_class], confidence

@app.route('/')
def index():
    return render_template('mri.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Endpoint for uploading a DICOM file.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file and file.filename.endswith('.dcm'):
        # Save the uploaded DICOM file
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        # Predict and convert DICOM
        predicted_class, confidence = predict_dicom(file_path)
        return jsonify({
            'predicted_class': predicted_class,
            'confidence': float(confidence),
            'message': f"File processed and converted to JPG successfully."
        })
    else:
        return jsonify({'error': 'Invalid file format. Please upload a .dcm file.'})

import pydicom
from pydicom.errors import InvalidDicomError
from pydicom.pixel_data_handlers.util import apply_voi_lut

def preprocess_and_convert_dicom(dcm_path):
    try:
        dicom = pydicom.dcmread(dcm_path, force=True)  # Force-read for testing
        if not hasattr(dicom, 'PixelData'):
            raise ValueError("No pixel data found in the DICOM file.")
        if 'TransferSyntaxUID' not in dicom.file_meta:
            raise ValueError("Transfer Syntax UID is missing. Cannot decode pixel data.")

        preprocessed_image = apply_voi_lut(dicom.pixel_array, dicom)
        return preprocessed_image
    except InvalidDicomError as e:
        print("Invalid DICOM file:", e)
    except Exception as e:
        print("Error processing DICOM file:", e)

    return None


if __name__ == '__main__':
    app.run(debug=True)
