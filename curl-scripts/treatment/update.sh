#!/bin/bash

# sh curl-scripts/treatment/update.sh 

TOKEN="713d9b620d00fbf3a588d38330cc5215"
ID="6255c6fbc58b892200a41908"
NAME="implant"
TOOTH="31"
RADIOGRAPH="panoramic & PAs"
DATE="March 01, 2022"

API="http://localhost:4741"
URL_PATH="/treatments"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
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
