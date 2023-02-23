export TMP_DIR="../tmp/ipk-web"
export MAIN_TMP_DIR="ipk-web"


# pull vue src
echo [LOG][ipk-web][frontend][init] pull vue src
git reset --hard HEAD
git clean -fd
git pull origin

# renew package
echo [LOG][ipk-web][frontend][init] excute: npm ci
npm ci --registry=http://10.42.70.218/artifactory/api/npm/npm/

#build uat
echo [LOG][uat][ipk-web][frontend] excute: npm run build:uat
npm run build:uat

# make sure default tmp folder
mkdir -p $TMP_DIR/uat/$MAIN_TMP_DIR

# delete prev data
rm -rf $TMP_DIR/uat/$MAIN_TMP_DIR

echo [LOG][uat][ipk-web][frontend] copy vue build folder to TMP_DIR/
cp -R dist/. $TMP_DIR/uat/$MAIN_TMP_DIR
