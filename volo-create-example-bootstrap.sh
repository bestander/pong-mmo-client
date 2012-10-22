# run this script to create a sample html file that will test the library standalone

volo create example # creates a folder with require.js dependency and an empty index.html
cd example
volo install jquery # downloads jquery from repository
cp -f ../amd-example-bootstrap.js ./www/js/app/main.js # replace empty main module with ours that adds canvas to index.html and starts up the application

