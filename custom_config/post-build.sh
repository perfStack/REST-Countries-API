#!/usr/bin/env zsh

CONFIG_FILE_PATH='./custom_config'
HTML_FILES="$(find dist \( -name "*.html" \))"
CSS_FILES="$(find dist \( -name "*.css" \))"
JS_FILES="$(find dist \( -name "*.js" \))"


function minifyHtml() {
    node ${CONFIG_FILE_PATH}/htmlnano.js
}

# check if atleast 1 file was found
if [ "${#HTML_FILES[@]}" -gt "0" ]; then
    printf 'Html files found now minifying them\n'
    # parallel -j+0 ::: minifyHtml
    # minifyHtml
fi
if [ "${#CSS_FILES[@]}" -gt "0" ]; then
    printf 'Css files found now minifying them\n'
    # Uses npx to run postcss with cssnano to minify css files
    parallel -j+0 npx postcss --config ${CONFIG_FILE_PATH}/postcss.config.js -r $file ::: $CSS_FILES
fi
if [ "${#JS_FILES[@]}" -gt "0" ]; then
    printf 'Js files found\n'

fi

# function stringToArray() {
#     while IFS= read -r -d $'\0' FILE; do
#         FILES_ARRAY+=("$FILE")
#     done <<<$FILES_TO_COMPRESS
# }

# function printArray() {
#     for file in "${FILES_ARRAY[*]}"; do
#         printf '%s\n' "$file"
#     done
# }

# function printArrayLength() {
#     printf "${#FILES_ARRAY[@]}\n"
# }

# function checkIfFilesFound() {
#     $TOTAL_FILES=$1
#     if [ "$TOTAL_FILES" -gt "0" ]; then
#     fi
# }

# Check if the previous command exited with 0 else exit with exit code 1
# function checkExitCode() {
#     local exitMsg=$1
#     if [ "$?" -ne "0" ]; then
#         printf '%s\n' $exitMsg
#         exit 1
#     fi
# }

# FILES_TO_COMPRESS="$(find dist \( -name "*.css" -o -name "*.js" -o -name "*.html" \) -print0)"
# Convert the results of find into an array

# for fi in "$FILES_TO_COMPRESS"; do
#     printf '%s\n' $fi
# done
# parallel echo {} ::: $FILES_TO_COMPRESS

# Parallelly iterates through the list of files and gzips it with level 9 compression
# parallel -j+0 gzip --best -k {} ::: $FILES_TO_COMPRESS

# Parallelly iterates through the list of files and uses brotli with level 9 compression
# parallel -j+0 brotli -9 {} ::: $FILES_TO_COMPRESS
