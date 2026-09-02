import type { ReactNode } from "react";
import type { GeneratedFile } from "./types";

type Lang = GeneratedFile["language"];

const KEYWORDS: Record<string, string[]> = {
  prisma: ["generator", "datasource", "model", "enum", "provider", "url", "env"],
  ts: [
    "import",
    "from",
    "export",
    "default",
    "const",
    "let",
    "async",
    "await",
    "function",
    "return",
    "if",
    "else",
    "try",
    "catch",
    "new",
    "type",
    "interface",
    "switch",
    "case",
    "break",
    "class",
  ],
  docker: [
    "FROM",
    "RUN",
    "COPY",
    "WORKDIR",
    "CMD",
    "EXPOSE",
    "ENV",
    "USER",
    "HEALTHCHECK",
    "AS",
  ],
  yaml: [],
  json: [],
  md: [],
  env: [],
  text: [],
};

const COMMENT_PREFIX: Partial<Record<Lang, string>> = {
  prisma: "//",
  ts: "//",
  docker: "#",
  yaml: "#",
  env: "#",
};

/** Tiny, dependency-free tokenizer — enough colour to read generated code. */
export function highlightLine(line: string, language: Lang): ReactNode {
  const commentPrefix = COMMENT_PREFIX[language];
  if (commentPrefix && line.trimStart().startsWith(commentPrefix)) {
    return <span className="text-code-comment">{line}</span>;
  }

  const keywords = KEYWORDS[language] ?? [];
  const pattern = /("[^"]*"|`[^`]*`|@@?[a-zA-Z]+|\b[A-Za-z_][A-Za-z0-9_]*\b|\s+|.)/g;
  const parts = line.match(pattern) ?? [];

  return parts.map((token, index) => {
    const key = `${index}-${token}`;
    if (/^["`]/.test(token)) {
      return (
        <span key={key} className="text-code-string">
          {token}
        </span>
      );
    }
    if (token.startsWith("@")) {
      return (
        <span key={key} className="text-code-keyword">
          {token}
        </span>
      );
    }
    if (keywords.includes(token)) {
      return (
        <span key={key} className="text-code-keyword">
          {token}
        </span>
      );
    }
    if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) {
      return (
        <span key={key} className="text-code-type">
          {token}
        </span>
      );
    }
    if (/^[{}[\]():,=?|]+$/.test(token)) {
      return (
        <span key={key} className="text-code-punct">
          {token}
        </span>
      );
    }
    if (language === "yaml" && /^[a-z_][a-zA-Z0-9_]*$/.test(token)) {
      return (
        <span key={key} className="text-code-type">
          {token}
        </span>
      );
    }
    return <span key={key}>{token}</span>;
  });
}
