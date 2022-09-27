const AWS = require('aws-sdk');
const s3 = new AWS.S3
const envVars = require('../utils/environmentUtil')

var params = {
    Bucket: process.env.AWS_BUCKET,
    //Key: "Introduction to Statistics.mp4"  // MP4 example
    //Key: "ChangeOfBaseRuleExample.PNG"  // PNG example
    //Key: "Geometry 2017 Summer Packet.pdf"  // PDF example
}

// Ensures promises are working correctly.
AWS.config.setPromisesDependency();

// Retrieves a object from bucket via a signed URL (allows access to file for a time without requiring authorization status).
async function retrieveS3ObjectByKey(paramsKey) {
    params.Key = paramsKey

    //const data = await s3.getObject(params).promise()
    const url = await s3.getSignedUrlPromise('getObject', params)
    //console.log(`URL: ${url}`)

    return url
}

/*
retrieveS3ObjectByKey("Geometry 2017 Summer Packet.pdf").then(function (data) {
    console.log(`URL: ${data}`)
}).catch(function (err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/

module.exports = {
    retrieveS3ObjectByKey
}