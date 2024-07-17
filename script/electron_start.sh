#!/bin/bash

PWD="$( cd "$(dirname "$0")" > /dev/null 2>&1 ; pwd -P )"

cd "$PWD/.."

yarn start
exec bash
