# 🍅 Tomato Guard
### AI-Powered Tomato Leaf Disease Detection

Tomato Guard is an AI-powered mobile application that identifies tomato leaf diseases 
using a trained deep learning model. It combines image-based disease prediction with 
weather information, user authentication, and personalized prediction history.

## 🚀 Features

- **AI Disease Detection:** Predicts tomato leaf conditions from uploaded or captured 
images.
- **12 Output Classes:** Supports 11 named tomato leaf conditions and an `unknown` 
class.
- **Confidence Score:** Displays the model's prediction confidence.
- **Image Capture & Upload:** Allows users to capture or select leaf images.
- **Weather Information:** Integrates OpenWeatherMap API.
- **User Authentication:** Supports signup and login.
- **Prediction History:** Stores individual user predictions in MongoDB.
- **Guest Access:** Provides guest login with separate prediction history.

## 🛠️ Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React Native, Expo, JavaScript |
| Backend | Python, Flask |
| Machine Learning | TensorFlow, Keras |
| Database | MongoDB Atlas, PyMongo |
| Image Processing | Pillow, NumPy |
| APIs | REST API, OpenWeatherMap |
| Authentication | Password hashing |

## 🧠 Model Information

The application uses a trained Keras image classification model.

- Model file: `best_tomato_model.keras`
- Input shape: `224 × 224 × 3`
- Output shape: `12 classes`
- Image format: RGB

### Supported Classes

1. Bacterial Spot
2. Early Blight
3. Late Blight
4. Leaf Mold
5. Septoria Leaf Spot
6. Spider Mites
7. Target Spot
8. Tomato Yellow Leaf Curl Virus
9. Tomato Mosaic Virus
10. Healthy
11. Powdery Mildew
12. Unknown

## 🏗️ System Architecture

```text
       React Native Mobile App
                 |
                 v
          Image Capture
                 |
                 v
           Flask REST API
                 |
                 v
       Image Preprocessing
       (224 × 224 RGB)
                 |
                 v
       TensorFlow / Keras
          ML Model
                 |
                 v
        Prediction Results
        + Confidence Score
                 |
          +------+------+
          |             |
          v             v
       MongoDB       Mobile UI
       History       Result Display
```

## 📁 Project Structure

```text
Tomato-Guard/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── class_names.json
│   ├── model/
│   │   └── best_tomato_model.keras
│   └── utils/
│       ├── disease_db.py
│       └── weather_service.py
│
├── frontend/
│   ├── App.js
│   ├── components/
│   ├── context/
│   ├── screens/
│   └── utils/
│       └── api.js
│
├── class_names.json
├── SETUP.md
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.11
- Node.js and npm
- MongoDB Atlas account
- Expo Go application

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Tomato-Guard
```

### 2. Start the Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a local `.env` file using `.env.example` and configure your MongoDB connection 
string and optional weather API key.

Start Flask:

```bash
python app.py
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code using Expo Go to launch the application.

**Note:** Configure the backend API host in `frontend/utils/api.js` to match your 
computer's network address.

For detailed instructions, see [SETUP.md](SETUP.md).

## 🔐 Security

- API keys and database credentials are stored in environment variables.
- Real `.env` files must never be committed to GitHub.
- User passwords are stored as hashes rather than plaintext.

## 🔮 Future Enhancements

- Improve model accuracy and generalization across different lighting conditions.
- Add more crop disease categories.
- Provide treatment and prevention recommendations.
- Deploy the backend to a cloud platform.
- Add multilingual support and enhanced analytics.

## 👩‍💻 Author

Developed as an AI-powered mobile application project integrating deep learning, backend 
development, and mobile application development.
