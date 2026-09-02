export type ModuleId =
  | "auth"
  | "database"
  | "billing"
  | "docker"
  | "cicd"
  | "testing";

export interface ModuleDef {
  id: ModuleId;
  label: string;
  blurb: string;
  /** Modules that cannot be switched off — they are the chassis. */
  locked?: boolean;
}

export const MODULES: ModuleDef[] = [
  {
    id: "database",
    label: "Database",
    blurb: "Prisma client singleton, migrations, seed script",
    locked: true,
  },
  {
    id: "docker",
    label: "Docker",
    blurb: "Multi-stage Dockerfile, compose with Postgres, .dockerignore",
    locked: true,
  },
  { id: "auth", label: "Auth", blurb: "Session cookies, hashing, route guard" },
  {
    id: "billing",
    label: "Stripe billing",
    blurb: "Checkout route, webhook handler with signature check",
  },
  {
    id: "cicd",
    label: "CI/CD",
    blurb: "GitHub Actions: typecheck, lint, test, docker build",
  },
  {
    id: "testing",
    label: "Testing",
    blurb: "Vitest config plus an example unit test",
  },
];

export type ScalarType =
  | "String"
  | "Int"
  | "Float"
  | "Boolean"
  | "DateTime"
  | "Json"
  | "BigInt"
  | "Decimal";

export const SCALAR_TYPES: ScalarType[] = [
  "String",
  "Int",
  "Float",
  "Boolean",
  "DateTime",
  "Json",
  "BigInt",
  "Decimal",
];

export interface FieldDef {
  id: string;
  name: string;
  type: ScalarType;
  optional: boolean;
  unique: boolean;
  list: boolean;
}

export interface ModelDef {
  id: string;
  name: string;
  fields: FieldDef[];
}

export interface ProjectConfig {
  name: string;
  description: string;
  port: number;
  nodeVersion: "20" | "22" | "24";
  packageManager: "npm" | "pnpm";
  modules: ModuleId[];
  models: ModelDef[];
}

export interface GeneratedFile {
  path: string;
  contents: string;
  language: "prisma" | "ts" | "json" | "yaml" | "docker" | "md" | "env" | "text";
}

export interface TreeNode {
  name: string;
  path: string;
  kind: "dir" | "file";
  children?: TreeNode[];
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function makeField(partial: Partial<FieldDef> = {}): FieldDef {
  return {
    id: uid(),
    name: "field",
    type: "String",
    optional: false,
    unique: false,
    list: false,
    ...partial,
  };
}

export function defaultConfig(): ProjectConfig {
  return {
    name: "orbit-app",
    description: "A Dockerized Next.js 16 application with Prisma and Postgres",
    port: 3000,
    nodeVersion: "22",
    packageManager: "npm",
    modules: ["database", "docker", "auth", "cicd"],
    models: [
      {
        id: uid(),
        name: "User",
        fields: [
          makeField({ name: "email", type: "String", unique: true }),
          makeField({ name: "name", type: "String", optional: true }),
          makeField({ name: "createdAt", type: "DateTime" }),
        ],
      },
      {
        id: uid(),
        name: "Post",
        fields: [
          makeField({ name: "title", type: "String" }),
          makeField({ name: "body", type: "String", optional: true }),
          makeField({ name: "published", type: "Boolean" }),
        ],
      },
    ],
  };
}

/** Slug-safe project directory / docker service name. */
export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "app"
  );
}

/** PascalCase identifier suitable for a Prisma model. */
export function pascalCase(value: string): string {
  const parts = value.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/);
  if (parts.length === 0) return "Model";
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

export function camelCase(value: string): string {
  const p = pascalCase(value);
  return p.charAt(0).toLowerCase() + p.slice(1);
}
