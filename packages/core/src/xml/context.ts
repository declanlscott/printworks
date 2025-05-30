import { Xml } from ".";
import { Utils } from "../utils";

import type { XMLBuilder, XMLParser } from "fast-xml-parser";

export type XmlContext = {
  builder: XMLBuilder;
  parser: XMLParser;
};
export const XmlContext = Utils.createContext<XmlContext>("Xml");

export const useXml = XmlContext.use;

export const withXml = <TCallback extends () => ReturnType<TCallback>>(
  callback: TCallback,
) =>
  XmlContext.with(
    () => ({
      builder: new Xml.Builder(),
      parser: new Xml.Parser({ preserveOrder: true }),
    }),
    callback,
  );
