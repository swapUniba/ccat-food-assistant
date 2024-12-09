#!/bin/sh

# Set the environment variable for Babel
export NODE_ENV=production

# Get the file path variables from PHPStorm
FILE_DIR_RELATIVE_TO_PROJECT_ROOT=$1
FILE_NAME=$2
#echo "FILE_DIR_RELATIVE_TO_PROJECT_ROOT: $FILE_DIR_RELATIVE_TO_PROJECT_ROOT"
#echo "FILE_NAME: $FILE_NAME"
# Extract the package name from the file path
PACKAGE_NAME=$(echo "$FILE_DIR_RELATIVE_TO_PROJECT_ROOT" | sed -n 's#^app/Packages/\([^/]*\)/React.*$#\1#p')
#echo "$PACKAGE_NAME"
# End the script without errors if the package name is not valid
if [ -z "$PACKAGE_NAME" ]; then
  exit 0
fi

# Extract the relative path within the package excluding 'app/Packages/{package_name}/React/'
RELATIVE_PATH_WITHIN_PACKAGE=$(echo "$FILE_DIR_RELATIVE_TO_PROJECT_ROOT" | sed -n "s#^app/Packages/$PACKAGE_NAME/React##p")
#echo "RELATIVE_PATH_WITHIN_PACKAGE: $RELATIVE_PATH_WITHIN_PACKAGE"

# Ensure the output directory structure
OUTPUT_DIR="./public/react-components-dist/__packages__/$PACKAGE_NAME/$RELATIVE_PATH_WITHIN_PACKAGE"
#echo "OUTPUT_DIR: $OUTPUT_DIR"

# Run Babel with the updated output directory path
./node_modules/.bin/babel "$FILE_DIR_RELATIVE_TO_PROJECT_ROOT" --out-dir "$OUTPUT_DIR" --only "$FILE_DIR_RELATIVE_TO_PROJECT_ROOT/$FILE_NAME" --source-maps --ignore "**/*.production.js","**/*.production.js.map"
