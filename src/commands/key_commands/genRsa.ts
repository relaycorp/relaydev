import { derSerializePrivateKey, generateRSAKeyPair } from '@relaycorp/relaynet-core';

export const command = 'gen-rsa';

export const description = 'Generate an RSA key and output its private component DER-encoded';

export const builder = {
  modulus: { choices: [2048, 3072, 4096], default: 2048, type: 'number' },
};

interface ArgumentSet {
  readonly modulus: number;
}

export async function handler(argv: ArgumentSet): Promise<void> {
  const keyPair = await generateRSAKeyPair(argv);
  process.stdout.write(await derSerializePrivateKey(keyPair.privateKey));
}
