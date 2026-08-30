import { readFileSync } from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schema = JSON.parse(readFileSync(new URL("../schema/brand-dna.schema.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
addFormats(ajv);
const validate = ajv.compile(schema);

function validationErrors() {
  return (validate.errors || []).map(({ instancePath, keyword, message, params }) => ({
    instancePath,
    keyword,
    message: message || "Brand DNA validation failed",
    params,
  }));
}

export function validateBrandDNA(value) {
  const valid = validate(value);
  return { valid, errors: valid ? [] : validationErrors() };
}

export function assertValidBrandDNA(value) {
  const result = validateBrandDNA(value);
  if (!result.valid) {
    const summary = result.errors.slice(0, 5)
      .map(({ instancePath, message }) => `${instancePath || "/"} ${message}`)
      .join("; ");
    const error = new Error(`Invalid Brand DNA: ${summary}`);
    error.code = "INVALID_BRAND_DNA";
    error.validationErrors = result.errors;
    throw error;
  }
  return value;
}
