console.log('Loading function');

var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    var source_bucket = event.Records[0].s3.bucket.name;
    var source_key = event.Records[0].s3.object.key;
    if (source_key.match(/^msn-publications\//)) {
        var destination_bucket = "icerss.condenast.com";
        var destination_path   = "test/" + source_key.split("/").reverse()[0];
        
        var params = {
            Bucket: destination_bucket,
            Key: destination_path,
            CopySource: source_bucket + "/" + source_key,
            MetadataDirective: "COPY",
            ACL: "public-read"
        };
        console.log('Copying file:', JSON.stringify(params, null, 2));
     
        s3.copyObject(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else {
           context.succeed("Copied the file from " + source_bucket + "/" + source_key + " => " + destination_bucket + "/" + destination_path );     
          }
       });
    } else {
        console.log("Skipped this file. Not in the right path");
        context.succeed("Skipped the file");
    }
};
