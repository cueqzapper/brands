export type ArtifactKind = "website" | "logo-system" | "business-card" | "cv" | "label" | "social" | "icon-set" | "backgrounds" | "photography" | "decorative";
export type ReadinessState = "planned" | "draft" | "review" | "ready" | "blocked" | "deprecated";
export type DeliveryState = "not-requested" | "prepared" | "delivered" | "accepted" | "rejected";
export type EditorProvider = "seezweb" | "picorn" | "portable";
export type JsonPointer = string;

export type BrandLogoComponentStatus = "draft" | "approved" | "deprecated";

export interface BrandLogoComponent {
  id: string;
  assetId: string;
  description: string;
  use: string;
  status: BrandLogoComponentStatus;
}

export interface BrandLogoLockup {
  id: string;
  assetId: string;
  composition: ["signet", "wordmark"] | ["wordmark", "signet"];
  orientation: "horizontal" | "vertical" | "compact";
  use: string;
  status: BrandLogoComponentStatus;
}

export interface BrandLogoComponents {
  signet: BrandLogoComponent;
  wordmark: BrandLogoComponent;
  lockups: BrandLogoLockup[];
}

export interface BrandDnaV12 {
  schemaVersion: "1.2.0";
  visual: { logo: { components: BrandLogoComponents; [key: string]: unknown }; [key: string]: unknown };
  assets: Record<string, unknown>;
  [key: string]: unknown;
}

export interface BrandDnaSource {
  document: "brand-dna";
  pointer: JsonPointer;
}

export interface BrandProjectTokenBinding {
  source: BrandDnaSource;
  valueType: "color" | "dimension" | "font-family" | "font-weight" | "string" | "number" | "boolean" | "asset" | "object" | "array";
  mode: "live";
}

export interface BrandProjectBinding {
  target: JsonPointer;
  source: BrandDnaSource;
  mode: "live";
  required: boolean;
}

export interface ReadinessCheck {
  id: string;
  status: "pending" | "passed" | "failed" | "waived";
  label: string;
  evidence?: string;
}

export interface BrandProjectArtifact {
  id: string;
  kind: ArtifactKind;
  name: string;
  document: { path: string; mediaType: string; formatVersion: string };
  editor: { provider: EditorProvider; projectId?: string; documentId?: string; surface?: string };
  bindings: BrandProjectBinding[];
  assetIds: string[];
  readiness: { state: ReadinessState; checks: ReadinessCheck[]; updatedAt: string };
  delivery: {
    state: DeliveryState;
    exports: Array<{ id: string; path: string; mediaType: string; createdAt: string }>;
    updatedAt: string;
  };
}

export interface BrandProject {
  $schema?: string;
  schemaVersion: "1.0.0" | "1.1.0";
  project: {
    id: string;
    name: string;
    version: string;
    status: "draft" | "active" | "archived";
    createdAt: string;
    updatedAt: string;
    owner: string;
  };
  brandDna: {
    path: string;
    mediaType: "application/vnd.cueqzapper.brand-dna+json";
    schemaVersion: string;
    integrity?: string;
  };
  tokens: Record<string, BrandProjectTokenBinding>;
  artifacts: BrandProjectArtifact[];
}

export interface ResolvedArtifactBinding extends BrandProjectBinding { value: unknown }

export interface BrandDnaValidationError {
  instancePath: string;
  keyword: string;
  message: string;
  params: Record<string, unknown>;
}

export interface BrandDnaValidationResult {
  valid: boolean;
  errors: BrandDnaValidationError[];
}

export const BRAND_PROJECT_ARTIFACT_KINDS: readonly ArtifactKind[];
export const BRAND_PROJECT_READINESS_STATES: readonly ReadinessState[];
export const BRAND_PROJECT_DELIVERY_STATES: readonly DeliveryState[];
export function getByJsonPointer<T = unknown>(document: unknown, pointer: JsonPointer): T;
export function resolveBrandProjectTokens(project: BrandProject, brandDna: unknown): Record<string, unknown>;
export function resolveArtifactBindings(project: BrandProject, artifactId: string, brandDna: unknown): ResolvedArtifactBinding[];
export function validateBrandDNA(value: unknown): BrandDnaValidationResult;
export function assertValidBrandDNA<T>(value: T): T;

export function compileBrandDNA(...args: unknown[]): unknown;
export function compileBrandDNAWithProfile(...args: unknown[]): unknown;
export function selectBrandContext(...args: unknown[]): unknown;
export function renderPromptPacket(...args: unknown[]): unknown;
export function resolveLocale(...args: unknown[]): unknown;
export function exportBrandYml(...args: unknown[]): string;
export function exportTokensCss(...args: unknown[]): string;
