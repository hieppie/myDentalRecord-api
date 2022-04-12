#!/bin/sh

# sh curl-scripts/treatment/index.sh 

TOKEN="713d9b620d00fbf3a588d38330cc5215"

API="http://localhost:4741"
URL_PATH="/treatments"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
