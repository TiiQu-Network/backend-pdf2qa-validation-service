
import { S3CreateEvent } from "aws-lambda";
import AWS from 'aws-sdk';

export interface PubValidationMsg {
  (event: S3CreateEvent): Promise<void>;
}

export const handler: PubValidationMsg = async (event) => {
  try {
    // Access the S3 event data
    const s3CreateEvent = event.Records[0].s3;
    console.log({s3CreateEvent});
    const { PDF_VALIDATION_TOPIC_ARN } = process.env;
    console.log({PDF_VALIDATION_TOPIC_ARN});

    const sns = new AWS.SNS();

    const Message = JSON.stringify({
      s3CreateEvent,
      status: 'Validation Pending',
      action: 'triggerValidation'
    });

    const params = {
      TopicArn: PDF_VALIDATION_TOPIC_ARN,
      Message,
    };
    
    try {
      const response = await sns.publish(params).promise();
      console.log('Message published:', response.MessageId);
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }

  } catch (e) {
    console.error(e);
  }
};
