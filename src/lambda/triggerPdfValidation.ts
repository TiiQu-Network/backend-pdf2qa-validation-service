
import { S3CreateEvent } from "aws-lambda";
import AWS from 'aws-sdk';

export interface TriggerPdfValidation {
  (event: S3CreateEvent): Promise<void>;
}

export const handler: TriggerPdfValidation = async (event) => {
  try {
    console.log(process?.env);
    // Access the S3 event data
    const s3CreateEvent = event.Records[0].s3;
    console.log({s3CreateEvent});

    const stepFunctions = new AWS.StepFunctions();

    const params = {
      stateMachineArn: process?.env?.PDF_VALIDATION_STATE_MACHINE_ARN || '',
      input: JSON.stringify({ s3CreateEvent }),
    };
  
    try {
      const response = await stepFunctions.startExecution(params).promise();
      console.log('Step Function execution started:', response.executionArn);
    } catch (error) {
      console.error('Error starting Step Function:', error);
      throw error;
    }

  } catch (e) {
    console.error(e);
  }
};
