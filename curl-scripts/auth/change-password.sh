#!/bin/bash

# sh curl-scripts/auth/change-password.sh 

TOKEN="fa19388a9920d090a5727ca369a89f21"
OLDPW="store"
NEWPW='stored'

API="http://localhost:4741"
URL_PATH="/change-password"

curl "${API}${URL_PATH}/" \
  --include \
  --request PATCH \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "passwords": {
      "old": "'"${OLDPW}"'",
      "new": "'"${NEWPW}"'"
    }
  }'

echo
