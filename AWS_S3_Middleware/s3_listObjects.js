/*
    Documentation Resources:
    - https://www.npmjs.com/package/aws-sdk
    - https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html#s3-example-listing-objects
*/

const AWS = require('aws-sdk');
const s3 = new AWS.S3
const envVars = require('../utils/environmentUtil')

var params = {
    Bucket: process.env.AWS_BUCKET
}

// Ensures promises are working correctly.
AWS.config.setPromisesDependency();

// Lists all objects in bucket.
async function retrieveAllS3Objects() {
    const data = await s3.listObjectsV2(params).promise()

    return data.Contents
}

/*
retrieveAllS3Objects().then(function(data) {
    console.log(data)
}).catch(function(err) {
    console.log(`Promise rejection error --> ${err}`)
})
*/


// Working second alternative.
// s3.listObjectsV2(params, function(err, data) {
//     if (err) {
//         console.log(err, err.stack)  // An error occurred
//     } else {
//         console.log(data.Contents)
//     }
// })

