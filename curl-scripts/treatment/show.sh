#!/bin/sh

# sh curl-scripts/treatment/show.sh 

TOKEN="713d9b620d00fbf3a588d38330cc5215"
ID="6255c6fbc58b892200a41908"

API="http://localhost:4741"
URL_PATH="/treatments"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
