
import { SQSEvent } from "aws-lambda";
import AWS from 'aws-sdk';

export interface TriggerPdfValidation {
  (event: SQSEvent): Promise<void>;
}

export const handler: TriggerPdfValidation = async (event) => {
  try {
  // Access the SQS event data
  const sqsEvent = event.Records[0].body;

    const stepFunctions = new AWS.StepFunctions();

    const params = {
      stateMachineArn: process?.env?.PDF_VALIDATION_STATE_MACHINE_ARN || '',
      input: JSON.stringify({ sqsEvent }),
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
