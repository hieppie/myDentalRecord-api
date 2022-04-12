#!/bin/bash

TOKEN="713d9b620d00fbf3a588d38330cc5215"
NAME="RCT"
TOOTH="14"
RADIOGRAPH="panoramic"
DATE="feb 01, 2022"

API="http://localhost:4741"
URL_PATH="/treatments"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "treatment": {
      "name": "'"${NAME}"'",
      "tooth": "'"${TOOTH}"'",
       "radiograph": "'"${RADIOGRAPH}"'",
      "date": "'"${DATE}"'"
    }
  }'

echo
