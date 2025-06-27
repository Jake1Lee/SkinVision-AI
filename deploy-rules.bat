@echo off
echo Deploying Firebase rules...
firebase deploy --only firestore:rules
firebase deploy --only storage
echo Done!
pause
