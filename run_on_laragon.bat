@echo off
echo BBSMART Plus - Laragon Helper
echo -----------------------------

REM Check for root node_modules
if not exist node_modules (
    echo [1/4] Installing root dependencies...
    call npm install
) else (
    echo [1/4] Root dependencies already installed.
)

REM Check for server node_modules
if not exist server\node_modules (
    echo [2/4] Installing server dependencies...
    cd server
    call npm install
    cd ..
) else (
    echo [2/4] Server dependencies already installed.
)

REM Check if dist exists
echo [3/4] Building the project (this may take a minute)...
if exist dist (
    rmdir /s /q dist
)
call npm run build

echo [4/4] Starting Node.js server...
echo The app will be available at http://localhost:3000
echo -----------------------------
REM Open browser automatically
start http://localhost:3000
npm start
pause
