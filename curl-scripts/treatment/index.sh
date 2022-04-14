#!/bin/sh

# sh curl-scripts/treatment/index.sh 

TOKEN="443cee857f0ea6622c1584163a844dd3"

API="http://localhost:4741"
URL_PATH="/treatments"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
