@echo off
SET "SRC_PATH=%cd%"
SET JBOSS_SERVER=10.240.70.152
SET DEPLOY_PATH=/jbossas/deploy_war
SET /P MODULE_NAME=Enter Module Name :
SET /P PACKAGE_MODE=Enter MODE [1:backend,2:frontend,3:batch]:
SET BUILD_ENV=uat
echo "source code path:"%SRC_PATH%
echo "deployment server IP:"%JBOSS_SERVER%
echo "deploy file path:"%DEPLOY_PATH%
echo "package mode[1:backend,2:frontend,3:batch]:"%PACKAGE_MODE%
echo "deploy module:"%MODULE_NAME%
echo "if wrong info,press ctrl+c exit"
Pause
git log --merges --since=1.weeks > package.log
cd %SRC_PATH%
if /i %PACKAGE_MODE% equ 1 goto backend
if /i %PACKAGE_MODE% equ 2 goto frontend
if /i %PACKAGE_MODE% equ 3 goto batch
:backend
echo "package backend"
call mvn clean package -P%BUILD_ENV% -Dmaven.test.skip=true
SET "Deploy_WAR=%MODULE_NAME%-1.0-SNAPSHOT.war"
SET "Local_File_Path=%SRC_PATH%\%MODULE_NAME%\target\%Deploy_WAR%"
goto deploy
Pause
exit /b 0
:frontend
echo "package frontend"
call mvn package -P%BUILD_ENV%
if errorlevel 1 exit /b 1
SET "Deploy_WAR=%MODULE_NAME%.war"
SET "Local_File_Path=%SRC_PATH%\target\%Deploy_WAR%"
goto deploy
Pause
exit /b 0
:batch
echo "package batch"
call mvn -pl :obd-batch -am clean package -Pwar -Dmaven.test.skip=true
if errorlevel 1 exit /b 1
SET "Deploy_WAR=%MODULE_NAME%-1.0-SNAPSHOT.war"
SET "Local_File_Path=%SRC_PATH%\%MODULE_NAME%\target\%Deploy_WAR%"
goto deploy
Pause
exit /b 0
:deploy
echo "scp local file to jboss server"
echo %Deploy_WAR%
echo %Local_File_Path%
scp %Local_File_Path% jbossas@%JBOSS_SERVER%:%DEPLOY_PATH%
echo "deploy step"
ssh -tt jbossas@%JBOSS_SERVER% sh /jbossas/script/runDeploy.sh
Pause