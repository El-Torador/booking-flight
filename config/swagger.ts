export default {
  path: __dirname + '../',
  title: 'Booking Flight API by CAPE COMPANY',
  description: 'Designed to book and sale our own fligh tickets.',
  version: '1.0.0',
  tagIndex: 3,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT', // if PUT/PATCH are provided for the same rout, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI confomr headers that are commonly used
  },
}
