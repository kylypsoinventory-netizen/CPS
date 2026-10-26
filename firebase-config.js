/* Ilagay dito ang Firebase settings mo (Firebase Console → Project settings).
   Hindi ito sikreto: normal na public ang mga ito sa web apps. */
self.FIREBASE_CONFIG = {
  apiKey: 'PASTE_API_KEY',
  authDomain: 'PASTE_PROJECT_ID.firebaseapp.com',
  projectId: 'PASTE_PROJECT_ID',
  messagingSenderId: 'PASTE_SENDER_ID',
  appId: 'PASTE_APP_ID'
};
/* Project settings → Cloud Messaging → Web Push certificates → Generate key pair */
self.FIREBASE_VAPID_KEY = 'PASTE_WEB_PUSH_KEY_PAIR';
