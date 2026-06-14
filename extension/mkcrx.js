#!/usr/bin/env node
// Builds a CRX3 package from a private key + a zip archive, with no browser.
// Usage: node mkcrx.js <key.pem> <archive.zip> <out.crx>
//
// CRX3 layout:  "Cr24" | uint32LE(version=3) | uint32LE(headerLen) | header | zip
// The header is a CrxFileHeader protobuf carrying an RSA-SHA256 signature over
//   "CRX3 SignedData\0" | uint32LE(len(signedHeaderData)) | signedHeaderData | zip
// where signedHeaderData is a SignedData protobuf holding the 16-byte crx_id
// (= first 16 bytes of SHA-256 over the DER SubjectPublicKeyInfo).
"use strict";
const fs = require("fs");
const crypto = require("crypto");

const [keyPath, zipPath, outPath] = process.argv.slice(2);
if (!keyPath || !zipPath || !outPath) {
  console.error("usage: node mkcrx.js <key.pem> <archive.zip> <out.crx>");
  process.exit(2);
}

// Minimal protobuf helpers (length-delimited fields only).
const varint = (n) => {
  const out = [];
  while (n > 0x7f) { out.push((n & 0x7f) | 0x80); n = Math.floor(n / 128); }
  out.push(n);
  return Buffer.from(out);
};
const field = (num, buf) =>
  Buffer.concat([varint((num << 3) | 2), varint(buf.length), buf]);

const privateKey = crypto.createPrivateKey(fs.readFileSync(keyPath));
const spki = crypto.createPublicKey(privateKey).export({ type: "spki", format: "der" });
const zip = fs.readFileSync(zipPath);

const crxId = crypto.createHash("sha256").update(spki).digest().subarray(0, 16);
const signedHeaderData = field(1, crxId); // SignedData { crx_id = 1 }

const sizeLE = Buffer.alloc(4);
sizeLE.writeUInt32LE(signedHeaderData.length, 0);
const signer = crypto.createSign("sha256");
signer.update(Buffer.from("CRX3 SignedData\0", "latin1"));
signer.update(sizeLE);
signer.update(signedHeaderData);
signer.update(zip);
const signature = signer.sign(privateKey); // RSASSA-PKCS1-v1_5

// CrxFileHeader { sha256_with_rsa = 2 (AsymmetricKeyProof{pubkey=1,sig=2}),
//                 signed_header_data = 10000 }
const keyProof = Buffer.concat([field(1, spki), field(2, signature)]);
const header = Buffer.concat([field(2, keyProof), field(10000, signedHeaderData)]);

const prefix = Buffer.alloc(12);
prefix.write("Cr24", 0, "latin1");
prefix.writeUInt32LE(3, 4);
prefix.writeUInt32LE(header.length, 8);

fs.writeFileSync(outPath, Buffer.concat([prefix, header, zip]));

// Extension ID: crx_id nibbles mapped 0-15 -> 'a'-'p'.
const extId = Array.from(crxId)
  .map((b) => [b >> 4, b & 0xf])
  .flat()
  .map((n) => String.fromCharCode(97 + n))
  .join("");
console.log(`crx written: ${outPath}`);
console.log(`extension id: ${extId}`);
