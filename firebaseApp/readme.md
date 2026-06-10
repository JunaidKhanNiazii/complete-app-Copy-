cd "/media/junaid-ameer-khan/University Data/semester 7/fyp/mobileleedapp/firebaseApp"
npm start



cd "/media/junaid-ameer-khan/University Data/semester 7/fyp/mobileleedapp/firebaseApp/backend"
node index.jscd "/media/junaid-ameer-khan/University Data/semester 7/fyp/mobileleedapp/firebaseApp/backend"
node index.js

https://github.com/settings/tokens




Run this once right now:
bashgit rm --cached backend/.env
git rm --cached backend/firebase.json
git add .
git commit -m "remove sensitive files from git tracking"
git push origin main

Then from today onwards, every time you update code, just run:
bashgit add .
git commit -m "describe what you changed"
git push origin main
No more errors will come. ✅