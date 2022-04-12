#!/bin/bash
# sh curl-scripts/auth/sign-out.sh

TOKEN="34af4b1b27ec64675bad7892720bb76f"

API="http://localhost:4741"
URL_PATH="/sign-out"

curl "${API}${URL_PATH}/" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
