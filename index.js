console.log('Loading function');

var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    var destination_bucket = "icerss.condenast.com";
    var destination_path   = "/test/" + key.split("/").reverse()[0];
    
    var params = {
        Bucket: destination_bucket,
        Key: destination_path,
        CopySource: bucket + "/" + key,
        MetadataDirective: "COPY",
        ACL: "public-read"
    };
    console.log('Copying file:', JSON.stringify(params, null, 2));
 
    s3.copyObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
       console.log("Copied the file: ", data);           // successful response
          
       // s3.getObject({Bucket: destination_bucket, Key: destination_path}, function(err, data) {
       //   if (err) console.log(err, err.stack); // an error occurred
       //   else     console.log("Copied: " + JSON.stringify(data));           // successful response
       // });
       context.succeed("Copied the file!");     
      }
   });

};
