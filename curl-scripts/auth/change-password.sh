#!/bin/bash

# sh curl-scripts/auth/change-password.sh 

TOKEN="125e1d130842b2ca4dc38ee7501e62fe"
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
