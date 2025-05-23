@echo off
chcp 65001>nul
setlocal enabledelayedexpansion

echo ====== START UPDATING ASSETS ======
echo.

echo 1. Scanning assets and creating data.json...
call npm run scan
if !errorlevel! neq 0 (
    echo Error scanning assets! Please check.
    pause
    exit /b 1
)
echo Assets scanning successful!
echo.

echo 2. Building project...
call npm run build
if !errorlevel! neq 0 (
    echo Error building project! Please check.
    pause
    exit /b 1
)
echo Build successful!
echo.

echo 3. Copying data.json to docs folder...
copy /Y "public\data.json" "docs\"
if !errorlevel! neq 0 (
    echo Error copying data.json! Please check.
    pause
    exit /b 1
)
echo Copy successful!
echo.

echo 4. Committing changes to Git...
git add "assets/" "public/data.json" "docs/"
git commit -m "Updated assets %date% %time%"
if !errorlevel! neq 0 (
    echo Error while committing! Please check.
    pause
    exit /b 1
)
echo Commit successful!
echo.

echo 5. Pushing to GitHub...
git push origin main
if !errorlevel! neq 0 (
    echo Error while pushing! Please check.
    pause
    exit /b 1
)
echo Push successful!
echo.

echo ====== ASSETS UPDATE COMPLETED ======
echo Visit https://kienbb.github.io/MU-Art-Compare/ to see the results.
echo The website will be updated in a few minutes.
echo.

pause
endlocal 