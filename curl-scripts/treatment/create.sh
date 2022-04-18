#!/bin/bash

# sh curl-scripts/treatment/create.sh 

# TOKEN="884bc0deab7fd803d3c8324002fb4d90"
# NAME="fill"
# TOOTH="18"
# RADIOGRAPHS="Pas"
# DATE="April 11, 2020"

# API="http://localhost:4741"
# URL_PATH="/treatments"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "treatment": {
      "name": "'"${NAME}"'",
      "tooth": "'"${TOOTH}"'",
       "radiographs": "'"${RADIOGRAPHS}"'",
      "date": "'"${DATE}"'"
    }
  }'

echo
