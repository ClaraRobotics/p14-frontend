#!/bin/bash

PWD="$( cd "$(dirname "$0")" > /dev/null 2>&1 ; pwd -P )"

cd "$PWD/.."

# --- Required env ---
# ROBOT_PC_HOST
# --------------------

set -a
. .env
set +a

while getopts dplv: flag
do
    case "${flag}" in
        p) p2p=true;;            # build then scp to ROBOT_PC_HOST
        l) local=true;;          # build only
    esac
done

[ ! -z $p2p ] && { local=''; }

[ -z $p2p   ] &&
[ -z $local ] &&
{ p2p=true; }

app_name="App"
release_dir="build/release"

echo "ROBOT_PC_HOST = $ROBOT_PC_HOST"
echo "app_name      = $app_name"
echo "p2p           = $p2p"
echo "local         = $local"
echo


# ===
# Test ssh connection
# ===

if [ ! -z $p2p ]
then
    ssh "$ROBOT_PC_HOST" "echo test ROBOT_PC_HOST connection. SUCCESS" || exit 65
    echo
fi


# ===
# Main process
# ===

yarn package

mv "$release_dir"/Electron*.AppImage "$release_dir/$app_name.AppImage"

if [ ! -z $p2p ]
then
    ssh "$ROBOT_PC_HOST" "mkdir -p $app_name/frontend"
    ssh "$ROBOT_PC_HOST" "mv -f $app_name/frontend/$app_name.AppImage $app_name/frontend/$app_name-$(date +%Y%m%d-%H%M%S)"
    scp -p "$release_dir/$app_name.AppImage" "$ROBOT_PC_HOST:$app_name/frontend/$app_name.AppImage"
fi
