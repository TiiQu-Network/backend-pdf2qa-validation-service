import PDFParser, { Result } from "pdf-parse";

export async function isValidPdf(buffer: Buffer): Promise<Result | false> {
  try {
    return await PDFParser(buffer);
  } catch (error) {
    return false;
  }
}
