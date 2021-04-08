#!/usr/bin/env bash
set -e

# Run this script via `$ tox -e verify`
if git diff --no-ext-diff --quiet --exit-code; then
  echo "Success: The CSS file is in sync with the SCSS file."
else
  echo "Error: CSS is out of sync"
  echo "=== Start: Git diff ==="
  git --no-pager diff
  echo "=== End: Git diff ==="
  echo 'Error: The CSS file is out of sync with the SCSS file.'
  echo 'The git diff above shows the difference.'
  echo 'Please use "$ tox -e compile" locally to compile the SCSS file.'
  exit 1
fi
