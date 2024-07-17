#!/bin/bash

PWD="$( cd "$(dirname "$0")" > /dev/null 2>&1 ; pwd -P )"

cd "$PWD"
set -a
. ../.env
set +a

yarn package 

ssh "$ROBOT_COM_HOST" "mkdir -p $APP_NAME/frontend"
ssh "$ROBOT_COM_HOST" "mv -f $APP_NAME/frontend/Electron*.AppImage $APP_NAME/frontend/Electron-$(date +%Y%m%d-%H%M%S)"
scp -p ../build/release/Electron* "$ROBOT_COM_HOST:$APP_NAME/frontend/"
