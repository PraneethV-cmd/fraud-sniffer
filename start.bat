@echo off
start cmd /k "cd Backend && npm install && npm start"
start cmd /k "cd Frontend && npm install && npm run dev"

:: Navigate to the plagarism_checker directory
cd plagarism_checker

:: Check if venv exists, if not, create it
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

:: Activate venv and run app.py

start cmd /k ".venv\Scripts\activate && python.exe -m pip install --upgrade pip && pip install -r requirements.txt && python app.py"
