#!/bin/bash

echo "[runner.sh] Start"
WORK_DIR=$(pwd)
echo "[runner.sh] Working Directory [$WORK_DIR]"

python3 $WORK_DIR/scripts/procLibs.py $WORK_DIR/items/mapping
python3 $WORK_DIR/scripts/checkStruct.py $WORK_DIR/scripts/inspect.js $WORK_DIR/items
#python3 $WORK_DIR/scripts/checkStruct.py $WORK_DIR/scripts/verify.js $WORK_DIR/items



echo "[runner.sh] End"
