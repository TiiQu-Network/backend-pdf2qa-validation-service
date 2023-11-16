
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from 'aws-sdk';
import { validate } from '../utils/validate';
import { v5 as uuidv5 } from "uuid";
import { error, success } from "../utils/response";
const namespace = uuidv5.URL;

const s3 = new AWS.S3();

export interface GeneratePresignedUrl {
  (event: APIGatewayEvent): Promise<APIGatewayProxyResult>;
}

export const handler: GeneratePresignedUrl = async (event) => {
  try {
    const VALIDATION_BUCKET_NAME = process?.env?.VALIDATION_BUCKET_NAME;
    if (!VALIDATION_BUCKET_NAME) return error(500, 'Missing VALIDATION_BUCKET_NAME');

    // validate request params
    const params = {
      ...JSON.parse(event.body || '{}'),
    };
    const paramsAreValid = await validate('generatePresignedUrl', params);
    if (!paramsAreValid) return error(400);

    // create unique s3 key
    const { name, size, type, lastModified } = params;
    const now = new Date().getTime();
    const uniqueString = `${name}-${size}-${type}-${lastModified}-${now}`;
    const key = uuidv5(uniqueString, namespace);
    if (!key) return error(400, 'Error creating key');

    // create pre-signed url
    const getSignedUrlParams = {
      Bucket: VALIDATION_BUCKET_NAME,
      Key: key,
      Expires: 60 * 60, // 1 hour
      ContentType: type,
    };
    const preSignedUrl = await s3.getSignedUrl('putObject', getSignedUrlParams);

    return success({ preSignedUrl, key })
  } catch (e) {
    console.error(e);
    return error(500);
  }
};
