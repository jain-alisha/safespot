# 🔥 Firebase Firestore Setup Guide

This guide will help you connect your SafeSpot Crisis Map to Firebase Firestore so reports are shared across all users in real-time!

## ✅ What You'll Get

- **Real-time sync** - Everyone sees reports instantly
- **Community-wide data** - Not just stored on your device
- **Persistent storage** - Data survives browser refresh
- **Offline fallback** - Still works without internet

---

## 📋 Step-by-Step Setup

### 1️⃣ Create Firebase Project (5 minutes)

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **"Add project"** (or "Create a project")
3. Enter project name: `safespot-crisis-map` (or anything you want)
4. **Disable Google Analytics** (toggle it off - we don't need it)
5. Click **"Create project"**
6. Wait 30 seconds for it to finish
7. Click **"Continue"**

---

### 2️⃣ Set Up Firestore Database (3 minutes)

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** 
   - ⚠️ This allows anyone to read/write (good for testing)
   - We'll secure it later!
4. Choose a location close to you:
   - US: `us-central1` or `us-east1`
   - Europe: `europe-west1`
   - Asia: `asia-northeast1`
5. Click **"Enable"**
6. Wait for it to create (takes ~1 minute)

---

### 3️⃣ Get Your Firebase Configuration (2 minutes)

1. Click the **⚙️ gear icon** next to "Project Overview" (top left)
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **`</>`** (web) icon
5. Enter app nickname: `SafeSpot Web`
6. **Don't check "Firebase Hosting"** (we don't need it)
7. Click **"Register app"**

8. **Copy the Firebase config** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q",
  authDomain: "safespot-12345.firebaseapp.com",
  projectId: "safespot-12345",
  storageBucket: "safespot-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

9. Click **"Continue to console"**

---

### 4️⃣ Add Config to Your App (1 minute)

1. Open `firebase-config.js` in your code editor
2. **Replace** the placeholder config with YOUR config from Firebase:

**Before:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // ...
};
```

**After:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q",
  authDomain: "safespot-12345.firebaseapp.com",
  projectId: "safespot-12345",
  storageBucket: "safespot-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

3. **Save the file**

---

### 5️⃣ Set Security Rules (3 minutes)

Back in Firebase Console:

1. Go to **"Firestore Database"** in the left sidebar
2. Click the **"Rules"** tab (top of page)
3. **Replace everything** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reports/{reportId} {
      // Anyone can read reports
      allow read: if true;
      
      // Anyone can create reports, but must include a timestamp
      allow create: if request.resource.data.timestamp is timestamp
                    && request.resource.data.description is string
                    && request.resource.data.category is string
                    && request.resource.data.severity is string;
      
      // Nobody can update or delete (for now)
      allow update, delete: if false;
    }
  }
}
```

4. Click **"Publish"**
5. Confirm by clicking **"Publish"** again

---

### 6️⃣ Test Your App! (2 minutes)

1. **Open `index.html`** in your browser
2. **Open the browser console** (F12 or Right-click → Inspect → Console)
3. You should see: `Firebase initialized successfully!`
4. Try creating a report!
5. **Open the app in another browser** or incognito window
6. You should see the same report! 🎉

---

## 🎉 You're Done!

Your app now has:
- ✅ Real-time data sync across all users
- ✅ Persistent cloud storage
- ✅ Automatic updates when anyone adds a report
- ✅ Offline fallback to localStorage

---

## 🔧 Troubleshooting

### Problem: "Firebase not defined" error

**Solution:** Make sure `firebase-config.js` is loaded BEFORE `app.js` in your HTML:
```html
<script src="firebase-config.js"></script>
<script src="app.js"></script>
```

### Problem: Reports not syncing

**Solutions:**
1. Check the browser console for errors (F12)
2. Verify your Firebase config is correct in `firebase-config.js`
3. Make sure Firestore is enabled in Firebase Console
4. Check that security rules are published

### Problem: "Permission denied" errors

**Solutions:**
1. Go to Firestore → Rules tab
2. Make sure rules allow `allow read: if true;`
3. Click "Publish" again

### Problem: Can't see reports from other users

**Solution:** 
1. Make sure both browsers/devices are using the SAME Firebase project
2. Check that `firebase-config.js` has the correct `projectId`
3. Wait 2-3 seconds for real-time sync to kick in

---

## 🔒 Security Notes (Important!)

**Current Security Level:** 🔴 OPEN (Test Mode)
- Anyone can read all reports
- Anyone can create reports
- Good for: Testing, demos, small trusted groups

**For Production:** You should:
1. Add user authentication (Firebase Auth)
2. Restrict who can create reports
3. Add rate limiting
4. Add report moderation/flagging

---

## 🚀 Deployment Options

Once it's working locally, you can deploy for free:

### Option 1: Netlify (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your folder
3. Done! Get a URL like `safespot.netlify.app`

### Option 2: GitHub Pages
1. Create a GitHub repo
2. Push your files
3. Enable Pages in repo settings

### Option 3: Firebase Hosting (Advanced)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 📊 View Your Data

To see all reports in Firebase:
1. Go to Firestore Database in Firebase Console
2. Click on `reports` collection
3. You'll see all submitted reports with their data!

---

## 🎨 Next Features to Add

- [ ] User accounts (Firebase Auth)
- [ ] Upvote/confirm reports
- [ ] Mark issues as "resolved"
- [ ] Photo uploads (Firebase Storage)
- [ ] Email notifications
- [ ] Admin moderation panel

---

**Need help?** Check the browser console (F12) for error messages!
