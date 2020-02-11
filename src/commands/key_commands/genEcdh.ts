import {
  derSerializePrivateKey,
  ECDHCurveName,
  generateECDHKeyPair,
} from '@relaycorp/relaynet-core';

export const command = 'gen-ecdh';

export const description = 'Generate an ECDH key and output its private component DER-encoded';

export const builder = {
  'curve-name': { choices: ['P-256', 'P-384', 'P-521'], default: 'P-256', type: 'string' },
};

interface ArgumentSet {
  readonly 'curve-name': ECDHCurveName;
}

export async function handler(argv: ArgumentSet): Promise<void> {
  const keyPair = await generateECDHKeyPair(argv['curve-name']);
  process.stdout.write(await derSerializePrivateKey(keyPair.privateKey));
}
