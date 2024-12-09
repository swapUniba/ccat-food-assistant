#!/bin/sh

# Set the environment variable for Babel
export NODE_ENV=production

# Define the project root directory
PROJECT_ROOT_DIR=$(pwd)  # Adjust this if your script is not in the root directory

# Find all JSX files in the valid react package directories
PACKAGES_JSX_FILES=$(find "$PROJECT_ROOT_DIR/app/Packages" -type f -path "*/React/*.jsx")

# Function to get the relative path from the absolute path
get_relative_path() {
    local file_path=$1
    local base_path=$2
    local relative_path=${file_path#"$base_path/"}
    echo "$relative_path"
}

# Delete the compiled folder
rm -rf "$PROJECT_ROOT_DIR/public/react-components-dist"

# Loop through each found JSX file
echo "$PACKAGES_JSX_FILES" | while IFS= read -r FILE; do
  # Extract the relative file path to the project root directory
  FILE_DIR_RELATIVE_TO_PROJECT_ROOT=$(get_relative_path "$FILE" "$PROJECT_ROOT_DIR")
  FILE_DIR=$(dirname "$FILE_DIR_RELATIVE_TO_PROJECT_ROOT")
  FILE_NAME=$(basename "$FILE")

  # Debug statements
  # echo "- Processing file: $FILE"
  # echo "- Relative directory: $FILE_DIR"
  # echo "- File name: $FILE_NAME"

  # Call the packages-compile.sh script for each JSX file
  "$PROJECT_ROOT_DIR/app/Packages/ReactJsBundler/Scripts/packages-compile.sh" "$FILE_DIR" "$FILE_NAME"
done


./node_modules/.bin/babel ./public/react-components/ --out-dir ./public/react-components-dist --source-maps --ignore "**/*.production.js","**/*.production.js.map"
