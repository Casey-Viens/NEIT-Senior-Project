const AWS = require('aws-sdk');
const s3 = new AWS.S3
const envVars = require('../utils/environmentUtil')
const fs = require('fs')

var params = {
    Bucket: process.env.AWS_BUCKET,
    //Key: "testObjToBeDeleted.mp4"  // MP4 example
    //Key: "testObjToBeDeleted.PNG"  // PNG example
    //Key: "testObjToBeDeleted.PDF",  // PDF example
}

// Ensures promises are working correctly.
AWS.config.setPromisesDependency();

// Uploads an object to bucket.
async function uploadToS3Object(file) {
    const fileStream = fs.createReadStream(file.path)
    
    params.Key = file.filename
    params.Body = fileStream

    const data = await s3.upload(params).promise()    
    
    return data
}
/*
uploadToS3Object().then(function(data) {
    console.log(`Object with key '${params.Key}' was successfully uploaded.`)
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


module.exports = {
    uploadToS3Object
}