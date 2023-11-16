import * as yup from "yup";
import { ObjectSchema } from "yup";

export interface ValidationSchemas {
  [key: string]: ObjectSchema<{ [key: string]: unknown }>;
}

export interface ValidateParams {
  [key: string]: string | number | boolean | object;
}

const validationSchemas: ValidationSchemas = {
  uploadPdf: yup
    .object()
    .shape({
      pdfFile: yup.string().required(),
    })
    .noUnknown(),
  generatePresignedUrl: yup
  .object()
  .shape({
    name: yup.string().required(),
    type: yup.string().required(),
    size: yup.number().required(),
    lastModified: yup.number().required(),
  })
  .noUnknown(),
};

export const validate = async (lambdaName: string, params: ValidateParams) => {
  try {
    if (typeof params !== "object" || typeof lambdaName !== "string") {
      throw new Error("argument type error", {
        cause: { lambdaName, params },
      });
    }

    const schema = validationSchemas[lambdaName];
    if (!schema) {
      throw new Error("lambdaName argument not found in validationSchemas", {
        cause: { lambdaName },
      });
    }

    await schema.validate(params, { abortEarly: false, strict: true });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
