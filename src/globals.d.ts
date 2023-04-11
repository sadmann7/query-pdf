// pdf-parse is not a module, so we need to declare it as one
declare module "pdf-parse/lib/pdf-parse.js" {
  import pdf from "pdf-parse"

  export default pdf
}
