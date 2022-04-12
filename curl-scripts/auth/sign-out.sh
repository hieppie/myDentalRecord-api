#!/bin/bash
# sh curl-scripts/auth/sign-out.sh

TOKEN="f28977cce08f78eb71619cda3c6cf400"

API="http://localhost:4741"
URL_PATH="/sign-out"

curl "${API}${URL_PATH}/" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
