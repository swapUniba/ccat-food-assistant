#!/bin/sh

# Set the environment variable for Babel
export NODE_ENV=production

# Get the file path variables from PHPStorm
FILE_DIR_RELATIVE_TO_PROJECT_ROOT=$1
FILE_NAME=$2

# Run Babel with the updated output directory path
./node_modules/.bin/babel ./public/react-components/ --out-dir ./public/react-components-dist --only "$FILE_DIR_RELATIVE_TO_PROJECT_ROOT/$FILE_NAME" --source-maps --ignore "**/*.production.js","**/*.production.js.map"
