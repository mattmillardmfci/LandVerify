# Firebase Setup for LandVerify

## Getting Started with Firebase

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `LandVerify`
4. Enable Google Analytics (optional)
5. Click "Create Project"

### 2. Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Select region (closest to you or `us-central1`)
4. Choose **Start in production mode**
5. Click **Create**

### 3. Set Up Authentication (Optional)

1. Go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Anonymous** sign-in (for demo purposes)

### 4. Get Your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click on your web app (or create one if needed)
4. Copy the Firebase config object

### 5. Update Your .env File

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and replace with your Firebase credentials:
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=landverify-xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=landverify-xxx
VITE_FIREBASE_STORAGE_BUCKET=landverify-xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...

# Change admin password to something secure
VITE_ADMIN_PASSWORD=your_secure_password_here
```

### 6. Set Firestore Rules (Security)

In Firestore Console, go to **Rules** tab and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reads only from localhost or with admin password verification
    match /queries/{document=**} {
      allow read: if request.auth != null;
      allow write: if true;
    }
    match /geolocations/{document=**} {
      allow read: if request.auth != null;
      allow write: if true;
    }
  }
}
```

## Data Collections

### `queries` Collection
Stores all parcel queries:
- `lat` - Latitude
- `lng` - Longitude
- `address` - Address searched (if applicable)
- `result` - Parcel result (owner, acres, parcelId)
- `source` - "map_click" or "address_search"
- `timestamp` - When the query was made
- `userAgent` - Browser info

### `geolocations` Collection
Stores all geolocation accesses:
- `latitude` - Latitude
- `longitude` - Longitude
- `accuracy` - Accuracy in meters
- `timestamp` - When accessed
- `type` - "geolocation_access"
- `userAgent` - Browser info

## Using the Admin Panel

1. Click the **"Admin"** button in the bottom-right corner
2. Enter your admin password (set in `.env`)
3. View all queries and geolocations
4. Click "Refresh" to reload data

## Deploying to Vercel with Firebase

When deploying to Vercel:

1. Add environment variables in Vercel project settings:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_PASSWORD`

2. Firebase will automatically connect to your database from the production URL

## Security Notes

⚠️ **Important**: The current admin panel uses a simple password. For production:
- Implement proper authentication (Firebase Auth)
- Use email/password or OAuth
- Restrict access to admins only
- Consider IP whitelisting
- Audit logs regularly
