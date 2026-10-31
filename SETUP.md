# Tomato Guard — Setup Guide

Tomato Guard is an AI-powered tomato leaf disease detection application built using TensorFlow/Keras, Flask, React Native, and Expo. It detects tomato leaf conditions and maintains user prediction history using MongoDB.

## 1. Project Requirements

- Python 3.11 recommended
- Node.js and npm
- MongoDB Atlas account
- Expo Go mobile application
- OpenWeatherMap API key (optional)

## 2. Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

On Windows, activate the environment using:

```powershell
venv\Scripts\activate
```

### Environment Variables

Create a local `.env` file inside the `backend` folder using `.env.example` as a template.

Configure:

- `MONGO_URI` — MongoDB connection string.
- `WEATHER_API_KEY` — OpenWeatherMap API key (optional).
- `PORT` — Backend port (default: 5000).

Never commit your real `.env` file or API credentials.

### Model

The trained model is located at:

`backend/model/best_tomato_model.keras`

- Input dimensions: 224 × 224 × 3
- Output classes: 12
- Image format: RGB

The backend uses the class labels defined in `CLASS_NAMES` in `backend/app.py`. Keep their order consistent with the model's training output.

### Run Backend

From the `backend` directory:

```bash
python app.py
```

The Flask API runs on port 5000.

Check backend health:

```bash
curl http://127.0.0.1:5000/health
```

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npx expo start
```

### API Configuration

Edit:

`frontend/utils/api.js`

Set `API_HOST` to your computer's local network IP address when using a physical phone.

For Android Emulator, enable `USE_ANDROID_EMULATOR_HOST` if supported by your configuration.

Make sure your phone and computer are connected to the same network.

### Run Mobile Application

1. Install Expo Go on your phone.
2. Start the Expo development server.
3. Scan the QR code.
4. Allow camera, photo library, and location permissions when requested.

## 4. Main Features

- AI-based tomato leaf disease prediction.
- Image capture and upload.
- Confidence-based prediction results.
- Weather information.
- User authentication.
- MongoDB-backed prediction history.
- Guest access with separate guest history.

## 5. Technologies Used

**Backend:** Python, Flask, TensorFlow, Keras, MongoDB, PyMongo

**Frontend:** React Native, Expo, JavaScript

**Machine Learning:** Convolutional Neural Network (CNN), image preprocessing

**APIs:** REST API, OpenWeatherMap API

## 6. Security Notes

- Keep API keys and database credentials in local environment files.
- Never upload `.env` files to GitHub.
- Use HTTPS and a production-ready server before public deployment.
- Rotate any credentials that were exposed or committed accidentally.