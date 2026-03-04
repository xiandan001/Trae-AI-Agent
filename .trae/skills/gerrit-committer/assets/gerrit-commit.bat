@echo off
chcp 65001 > nul

REM XBH_AI_PATCH_START
REM Gerrit commit batch script
REM Read commit-message.txt and execute git operations
REM XBH_AI_PATCH_END

REM Check if commit-message.txt exists
if not exist "commit-message.txt" (
    echo Error: commit-message.txt not found
    echo Please edit commit-message.txt first
    pause
    exit /b 1
)

REM XBH_AI_PATCH_START
REM XBH_AI_PATCH_MODIFY
REM Ask user if this is a new commit or amend existing one
REM XBH_AI_PATCH_END

echo.
echo ========================================
echo Ready to commit to Gerrit
echo ========================================
echo.
echo Commit message:
echo.
type "commit-message.txt"
echo.
echo.

REM Ask if this is a new commit or amend
set /p amend="Is this a new commit? (y/n): "
if /i "%amend%"=="n" (
    set COMMIT_CMD=git commit --amend --no-edit
    echo Mode: Amend existing commit
) else (
    set COMMIT_CMD=git commit -F ''commit-message.txt''
    echo Mode: New commit
)

echo.

@REM REM Confirm commit
@REM set /p confirm="Confirm commit? (y/n): "
@REM if /i not "%confirm%"=="y" (
@REM     echo Commit cancelled
@REM     pause
@REM     exit /b 0
@REM )

REM XBH_AI_PATCH_START
REM XBH_AI_PATCH_MODIFY
REM Use Git Bash to execute git operations with message from file
REM XBH_AI_PATCH_END
"C:\Program Files\Git\git-bash.exe" -c "git add . && %COMMIT_CMD% && git add . && git commit --amend --no-edit && BRANCH=$(git rev-parse --abbrev-ref HEAD) && git push origin HEAD:refs/for/$BRANCH && echo '' && echo ======================================== && echo Press Enter to close this window && echo ======================================== && read"

echo.
echo ========================================
echo Commit successful!
echo ========================================
echo.
pause
