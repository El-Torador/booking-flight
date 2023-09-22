export default {
  path: __dirname + "../",
  title: "External API by K\u2074 COMPANY",
  version: "1.0.0",
  tagIndex: 2,
  ignore: ["/swagger", "/docs"],
  preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same rout, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI confomr headers that are commonly used
  },
};