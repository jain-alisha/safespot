# ✅ Firebase Setup Checklist

Print this or keep it open while you set up!

---

## □ Step 1: Create Firebase Project
- [ ] Go to console.firebase.google.com
- [ ] Click "Add project"
- [ ] Name: `safespot-crisis-map`
- [ ] Disable Google Analytics
- [ ] Click "Create project"

## □ Step 2: Enable Firestore
- [ ] Click "Firestore Database" in sidebar
- [ ] Click "Create database"
- [ ] Choose "Start in test mode"
- [ ] Select location (e.g., us-central1)
- [ ] Click "Enable"
- [ ] Wait for creation to complete

## □ Step 3: Get Firebase Config
- [ ] Click ⚙️ gear icon → "Project settings"
- [ ] Scroll to "Your apps"
- [ ] Click `</>` web icon
- [ ] Name: `SafeSpot Web`
- [ ] Click "Register app"
- [ ] Copy the firebaseConfig object

## □ Step 4: Add Config to Your Code
- [ ] Open `firebase-config.js`
- [ ] Paste your config (replace the placeholder)
- [ ] Save the file

## □ Step 5: Set Security Rules
- [ ] Go to Firestore → "Rules" tab
- [ ] Copy rules from FIREBASE_SETUP.md
- [ ] Paste and replace all existing rules
- [ ] Click "Publish"

## □ Step 6: Test!
- [ ] Open `index.html` in browser
- [ ] Open console (F12)
- [ ] Check for "Firebase initialized successfully!"
- [ ] Create a test report
- [ ] Open in another browser/tab
- [ ] Verify report appears! 🎉

---

## 🔍 Quick Debugging

**If it's not working:**

1. **Check console for errors** (F12 key)
2. **Verify firebaseConfig has your real values** (not placeholders)
3. **Make sure Firestore is enabled** in Firebase Console
4. **Check security rules are published**
5. **Wait 2-3 seconds** for real-time sync

---

## 📝 Your Firebase URLs (Fill in as you go)

Firebase Console: https://console.firebase.google.com/project/YOUR_PROJECT_ID

Your Project ID: `_________________`

Your App URL (after deploy): `_________________`

---

**Estimated Time:** 15 minutes
**Difficulty:** Easy (just copy/paste!)
**Cost:** FREE (Firebase has a generous free tier)
