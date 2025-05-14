from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import pickle
import os
import joblib
import ast
from flask_cors import CORS
from chatbot import chatbot


# Index the PDF at startup if needed
chatbot.index_pdf_if_needed()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000","http://localhost:5173"])

# Load model and datasets for symptoms
model_path = os.path.join("model", "svc.pkl")
svc = pickle.load(open(model_path, 'rb'))

# Load model and scaler for diabetes
model_path = os.path.join("model", "diabetes_model.pkl")
scaler_path = os.path.join("model", "diabetes_scaler.pkl")

diabetes_model = pickle.load(open(model_path, "rb"))
diabetes_scaler = pickle.load(open(scaler_path, "rb"))

# Load model and encoders for kidney 
model = joblib.load("./model/kidney_model.pkl")
label_encoders = joblib.load("./model/kidney_label_encoders.pkl")
target_encoder = joblib.load("./model/kidney_target_encoder.pkl")


# Load model for heart
with open('./model/heart_model.pkl', 'rb') as f:
    heart_model = pickle.load(f)


# Load datasets
description = pd.read_csv("dataset/description.csv")
medications = pd.read_csv("dataset/medications.csv")
precautions = pd.read_csv("dataset/precautions_df.csv")
diets = pd.read_csv("dataset/diets.csv")
workout = pd.read_csv("dataset/workout_df.csv")


# Symptom dictionary & disease list
symptoms_dict = {'itching': 0, 'skin_rash': 1, 'nodal_skin_eruptions': 2, 'continuous_sneezing': 3, 'shivering': 4, 'chills': 5, 'joint_pain': 6, 'stomach_pain': 7, 'acidity': 8, 'ulcers_on_tongue': 9, 'muscle_wasting': 10, 'vomiting': 11, 'burning_micturition': 12, 'spotting_ urination': 13, 'fatigue': 14, 'weight_gain': 15, 'anxiety': 16, 'cold_hands_and_feets': 17, 'mood_swings': 18, 'weight_loss': 19, 'restlessness': 20, 'lethargy': 21, 'patches_in_throat': 22, 'irregular_sugar_level': 23, 'cough': 24, 'high_fever': 25, 'sunken_eyes': 26, 'breathlessness': 27, 'sweating': 28, 'dehydration': 29, 'indigestion': 30, 'headache': 31, 'yellowish_skin': 32, 'dark_urine': 33, 'nausea': 34, 'loss_of_appetite': 35, 'pain_behind_the_eyes': 36, 'back_pain': 37, 'constipation': 38, 'abdominal_pain': 39, 'diarrhoea': 40, 'mild_fever': 41, 'yellow_urine': 42, 'yellowing_of_eyes': 43, 'acute_liver_failure': 44, 'fluid_overload': 45, 'swelling_of_stomach': 46, 'swelled_lymph_nodes': 47, 'malaise': 48, 'blurred_and_distorted_vision': 49, 'phlegm': 50, 'throat_irritation': 51, 'redness_of_eyes': 52, 'sinus_pressure': 53, 'runny_nose': 54, 'congestion': 55, 'chest_pain': 56, 'weakness_in_limbs': 57, 'fast_heart_rate': 58, 'pain_during_bowel_movements': 59, 'pain_in_anal_region': 60, 'bloody_stool': 61, 'irritation_in_anus': 62, 'neck_pain': 63, 'dizziness': 64, 'cramps': 65, 'bruising': 66, 'obesity': 67, 'swollen_legs': 68, 'swollen_blood_vessels': 69, 'puffy_face_and_eyes': 70, 'enlarged_thyroid': 71, 'brittle_nails': 72, 'swollen_extremeties': 73, 'excessive_hunger': 74, 'extra_marital_contacts': 75, 'drying_and_tingling_lips': 76, 'slurred_speech': 77, 'knee_pain': 78, 'hip_joint_pain': 79, 'muscle_weakness': 80, 'stiff_neck': 81, 'swelling_joints': 82, 'movement_stiffness': 83, 'spinning_movements': 84, 'loss_of_balance': 85, 'unsteadiness': 86, 'weakness_of_one_body_side': 87, 'loss_of_smell': 88, 'bladder_discomfort': 89, 'foul_smell_of urine': 90, 'continuous_feel_of_urine': 91, 'passage_of_gases': 92, 'internal_itching': 93, 'toxic_look_(typhos)': 94, 'depression': 95, 'irritability': 96, 'muscle_pain': 97, 'altered_sensorium': 98, 'red_spots_over_body': 99, 'belly_pain': 100, 'abnormal_menstruation': 101, 'dischromic _patches': 102, 'watering_from_eyes': 103, 'increased_appetite': 104, 'polyuria': 105, 'family_history': 106, 'mucoid_sputum': 107, 'rusty_sputum': 108, 'lack_of_concentration': 109, 'visual_disturbances': 110, 'receiving_blood_transfusion': 111, 'receiving_unsterile_injections': 112, 'coma': 113, 'stomach_bleeding': 114, 'distention_of_abdomen': 115, 'history_of_alcohol_consumption': 116, 'fluid_overload.1': 117, 'blood_in_sputum': 118, 'prominent_veins_on_calf': 119, 'palpitations': 120, 'painful_walking': 121, 'pus_filled_pimples': 122, 'blackheads': 123, 'scurring': 124, 'skin_peeling': 125, 'silver_like_dusting': 126, 'small_dents_in_nails': 127, 'inflammatory_nails': 128, 'blister': 129, 'red_sore_around_nose': 130, 'yellow_crust_ooze': 131}
diseases_list = {15: 'Fungal infection', 4: 'Allergy', 16: 'GERD', 9: 'Chronic cholestasis', 14: 'Drug Reaction', 33: 'Peptic ulcer diseae', 1: 'AIDS', 12: 'Diabetes ', 17: 'Gastroenteritis', 6: 'Bronchial Asthma', 23: 'Hypertension ', 30: 'Migraine', 7: 'Cervical spondylosis', 32: 'Paralysis (brain hemorrhage)', 28: 'Jaundice', 29: 'Malaria', 8: 'Chicken pox', 11: 'Dengue', 37: 'Typhoid', 40: 'hepatitis A', 19: 'Hepatitis B', 20: 'Hepatitis C', 21: 'Hepatitis D', 22: 'Hepatitis E', 3: 'Alcoholic hepatitis', 36: 'Tuberculosis', 10: 'Common Cold', 34: 'Pneumonia', 13: 'Dimorphic hemmorhoids(piles)', 18: 'Heart attack', 39: 'Varicose veins', 26: 'Hypothyroidism', 24: 'Hyperthyroidism', 25: 'Hypoglycemia', 31: 'Osteoarthristis', 5: 'Arthritis', 0: '(vertigo) Paroymsal  Positional Vertigo', 2: 'Acne', 38: 'Urinary tract infection', 35: 'Psoriasis', 27: 'Impetigo'}



def parse_list(val):
    if isinstance(val, list):
        return val
    if isinstance(val, str):
        try:
            parsed = ast.literal_eval(val)
            if isinstance(parsed, list):
                return parsed
        except:
            pass
    return [val]  # fallback as single-item list

# Helper function
def get_predicted_value(symptoms):
    input_vector = np.zeros(len(symptoms_dict))
    for s in symptoms:
        s = s.strip().lower()
        if s in symptoms_dict:
            input_vector[symptoms_dict[s]] = 1
    if np.sum(input_vector) == 0:
        return "Unknown Disease - No valid symptoms provided"
    prediction = svc.predict([input_vector])[0]
    return diseases_list.get(prediction, "Unknown Disease")



def get_disease_info(disease):
    desc = " ".join(description[description['Disease'] == disease]['Description'])
    
    pre = precautions[precautions['Disease'] == disease][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']].values.tolist()
    pre = [p for p in pre[0] if isinstance(p, str)] if pre else []

    med_raw = medications[medications['Disease'] == disease]['Medication'].tolist()
    med = []
    for m in med_raw:
        med.extend(parse_list(m))

    diet_raw = diets[diets['Disease'] == disease]['Diet'].tolist()
    diet = []
    for d in diet_raw:
        diet.extend(parse_list(d))

    wrk = workout[workout['disease'] == disease]['workout'].tolist()
    
    return desc, pre, med, diet, wrk




# API endpoint for symptoms predict
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    symptoms = data.get("symptoms", [])

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    predicted_disease = get_predicted_value(symptoms)
    if "Unknown" in predicted_disease:
        return jsonify({"error": predicted_disease}), 400

    desc, pre, med, diet, wrk = get_disease_info(predicted_disease)

    return jsonify({
        "disease": predicted_disease,
        "description": desc,
        "precautions": pre,
        "medications": med,
        "diet": diet,
        "workout": wrk
    })

# diabetes api endpoint
@app.route("/api/diabetes", methods=["POST"])
def predict_diabetes():
    try:
        data = request.get_json()

        expected_fields = [
            "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
            "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
        ]

        input_data = [float(data[field]) for field in expected_fields]
        scaled_input = diabetes_scaler.transform([input_data])
        prediction = diabetes_model.predict(scaled_input)[0]
        probability = diabetes_model.predict_proba(scaled_input)[0][1]

        return jsonify({
            "diabetes": bool(prediction),
            "confidence": round(probability * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Endpoint to predict kidney disease
@app.route("/api/predict-kidney", methods=["POST"])
def predict_kidney():
    data = request.json  # JSON with all fields
    try:
        # Convert to DataFrame
        input_df = pd.DataFrame([data])

        # Encode categorical columns
        for col, encoder in label_encoders.items():
            if col in input_df.columns:
                try:
                    input_df[col] = encoder.transform(input_df[col])
                except:
                    return jsonify({"error": f"Invalid or unseen label in column '{col}': {input_df[col].values[0]}"}), 400


        # Drop ID column if present
        input_df = input_df.drop(columns=["id"], errors='ignore')

        # Predict
        prediction = model.predict(input_df)
        result = target_encoder.inverse_transform(prediction)[0]

        return jsonify({"prediction": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

# api endpoint for heart disease prediction
@app.route('/api/predict-heart', methods=['POST'])
def predict_heart():
    data = request.json
    features = [data[col] for col in ['age','sex','cp','trestbps','chol','fbs','restecg',
                                      'thalach','exang','oldpeak','slope','ca','thal']]
    
    prediction = heart_model.predict([np.array(features)])
    result = int(prediction[0])
    
    return jsonify({'prediction': result})


@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        answer = chatbot.get_answer(question)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "running"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=1000)
