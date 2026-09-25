import { createHash } from "node:crypto";

export function stableId(namespace: string, semanticKey: string): string {
  return createHash("sha256")
    .update(`${namespace}:${semanticKey}`)
    .digest("base64url")
    .slice(0, 20);
}

export function stableSeed(namespace: string, semanticKey: string): number {
  const value = createHash("sha256")
    .update(`seed:${namespace}:${semanticKey}`)
    .digest()
    .readUInt32BE(0);
  return Math.max(1, value & 0x7fffffff);
}

export function versionNonce(namespace: string, semanticKey: string): number {
  const value = createHash("sha256")
    .update(`nonce:${namespace}:${semanticKey}`)
    .digest()
    .readUInt32BE(0);
  return Math.max(1, value & 0x7fffffff);
}

