import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load and clean data
df = pd.read_csv("../dataset/kidney_disease.csv")
df.replace("?", np.nan, inplace=True)
df = df.dropna()

# Convert appropriate columns to numeric
numeric_columns = ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 'pcv', 'wc', 'rc']
for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Drop rows with NaNs after conversion
df.dropna(inplace=True)

# Encode only categorical columns
categorical_columns = ['rbc', 'pc', 'pcc', 'ba', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane']
label_encoders = {}
for column in categorical_columns:
    le = LabelEncoder()
    df[column] = le.fit_transform(df[column])
    label_encoders[column] = le

# Encode target column
target_encoder = LabelEncoder()
df['classification'] = target_encoder.fit_transform(df['classification'])

# Split features and target
X = df.drop(['id', 'classification'], axis=1)
y = df['classification']

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save model and encoders
joblib.dump(model, "../model/kidney_model.pkl")
joblib.dump(label_encoders, "../model/kidney_label_encoders.pkl")
joblib.dump(target_encoder, "../model/kidney_target_encoder.pkl")
