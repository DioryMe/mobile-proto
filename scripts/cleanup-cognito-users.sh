#!/bin/bash

users=$(aws cognito-idp list-users \
    --user-pool-id $USER_POOL_ID \
    --filter "email ^= \"test\"" \
    --query "Users[*].Username" \
    --output text)

echo $users

for username in $users; do
  echo "Deleting user: $username"
  aws cognito-idp admin-delete-user \
           --user-pool-id $USER_POOL_ID \
           --username $username
done
