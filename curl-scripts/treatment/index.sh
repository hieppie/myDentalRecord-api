#!/bin/sh

# sh curl-scripts/treatment/index.sh 

TOKEN="ce5f94b8d04eb349f7afbbce1d90380c"

API="http://localhost:4741"
URL_PATH="/treatments"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
