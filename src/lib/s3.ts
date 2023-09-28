import AWS from "aws-sdk";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new AWS.S3({
        region: "eu-west-2",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
      });
      console.log("Built S3 obj with: ", {
        region: "eu-west-2",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
      });
      const file_key = `uploads/${Date.now().toString()}${file.name.replace(
        " ",
        "-"
      )}`;
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };
      const upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          console.log(
            "uploading to s3...",
            parseInt(((evt.loaded * 100) / evt.total).toString()),
            "%"
          );
        })
        .promise();

      s3.putObject(params, () => {
        return resolve({
          file_key,
          file_name: file.name,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-west-2.amazonaws.com/${file_key}`;
  return url;
}
