export default function strToJsVar(str: string) {
  let obj;
  try {
    obj = new Function(`$data`, `with ($data) { return (${str}) }`)({});
  } catch (e: any) {
    console.error(`${e.message} in expression: ${str}`);
  }

  return obj;
}
