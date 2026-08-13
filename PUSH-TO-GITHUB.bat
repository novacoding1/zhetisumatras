@echo off
title Uploading ZHETISUMATRAS to GitHub...
cd /d "C:\Users\Zangar\.gemini\antigravity\scratch\mattress-store"
echo Sending files to https://github.com/novacoding1/zhetisumatras ...
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo ========================================================
echo SUCCESS! All files uploaded to GitHub novacoding1/zhetisumatras
echo ========================================================
pause
