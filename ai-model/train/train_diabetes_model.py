import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle
import os

# Correct path to dataset
data_path = os.path.join("ai-model", "dataset", "diabetes.csv")
df = pd.read_csv("../dataset/diabetes.csv")

# Train-test split
X = df.drop("Outcome", axis=1)
y = df["Outcome"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = LogisticRegression()
model.fit(X_scaled, y)

# Save model and scaler
model_path = os.path.join("../model/diabetes_model.pkl")
scaler_path = os.path.join("../model/diabetes_scaler.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

with open(scaler_path, "wb") as f:
    pickle.dump(scaler, f)

print("✅ Model and Scaler saved successfully.")
