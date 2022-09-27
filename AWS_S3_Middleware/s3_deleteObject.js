const AWS = require('aws-sdk');
const s3 = new AWS.S3
const envVars = require('../utils/environmentUtil')

var params = {
    Bucket: process.env.AWS_BUCKET,
    //Key: "testObjToBeDeleted.PNG"  
}

// Ensures promises are working correctly.
AWS.config.setPromisesDependency();

// Deletes an object from bucket.
async function deleteS3ObjectByKey(paramsKey) {
    params.Key = paramsKey

    const data = await s3.deleteObject(params).promise()

    return data
}

/*
deleteS3ObjectByKey("testObjToBeDeleted.PNG").then(function(data) {
    console.log(`Object with key '${params.Key}' was successfully deleted.`)
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/

module.exports = {
    deleteS3ObjectByKey
}
