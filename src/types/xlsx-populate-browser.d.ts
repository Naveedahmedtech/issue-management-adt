// Minimal TS shim for the browser build of xlsx-populate
declare module 'xlsx-populate/browser/xlsx-populate' {
  const XlsxPopulate: any; // use 'any' to avoid peer type issues
  export default XlsxPopulate;
}
