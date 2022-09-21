import { parseDocument } from "yaml";

export const isValidYaml = (str: string) => {
  const yaml = parseDocument(str);

  if (yaml.errors.length > 0) return false;
  return yaml;
};
