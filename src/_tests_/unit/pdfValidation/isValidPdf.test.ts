import { isValidPdf } from "../../../utils/pdfValidation";
import fs from "fs";
import path from "path";

describe("isValidPdf", () => {
  it("Should return false if the binary data is NOT a PDF", async () => {
    // prep
    const validPngPath = "../../assets/validPng.png";
    const buffer = fs.readFileSync(path.resolve(__dirname, validPngPath));

    // test
    const result = await isValidPdf(buffer);
    expect(result).toEqual(false);
  });

  it("Should return a PDF data object if the binary data is a PDF", async () => {
    // prep
    const validPdfPath = "../../assets/validPdf.pdf";
    const buffer = fs.readFileSync(path.resolve(__dirname, validPdfPath));

    // test
    const result = await isValidPdf(buffer);
    if (result) {
      expect(result.numpages).toEqual(74);
    } else {
      fail("Expected a result object");
    }
  });
});
