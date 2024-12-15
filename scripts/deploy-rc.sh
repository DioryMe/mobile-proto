read -p "Ready to tag and deploy current branch?" confirm
if [[ "$confirm" != "y" ]]; then
    echo "Deployment aborted."
    exit 1
fi

RC_BRANCH_NAME="rc-$(date +%Y%m%d)-$(git rev-parse --short HEAD)"

# Tag and push to github
git tag $RC_BRANCH_NAME
git push origin $RC_BRANCH_NAME

# Prepare and push for workflow to deploy
git checkout -b $RC_BRANCH_NAME-branch
git cherry-pick 020b4a1f1b0e6032fda78bccc906b366d2df931a
git push origin $RC_BRANCH_NAME-branch

# Wait for workflow to deploy
echo "Deployment started. Please wait for the workflow to complete."
