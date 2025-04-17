import { Scalar } from "@scalar/hono-api-reference";
import type { AppOpenAPI } from "@/lib/types";

import packageJSON from "../../package.json" with { type: "json" };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc31("/api/doc", { openapi: "3.1.0", info: { version: packageJSON.version, title: "Edelman test API" } });

  app.get(
    "/api/reference",
    Scalar({
      layout: "modern",
      defaultHttpClient: { targetKey: "node", clientKey: "fetch" },
      url: "/api/doc",
      favicon: "./favicon.ico",
      hideTestRequestButton: true,
      hiddenClients: {
        c: true,
        clojure: true,
        csharp: true,
        go: true,
        java: true,
        javascript: ["xhr", "jquery"],
        kotlin: true,
        node: true,
        objc: true,
        ocaml: true,
        php: true,
        powershell: true,
        python: true,
        r: true,
        ruby: true,
        swift: true,
      },
      metaData: {
        title: "Edelman test API",
        description: "Edelman test API Documentation",
      },
      hideDownloadButton: true,
    }),
  );
}
