import { Crypto } from '@peculiar/webcrypto';
import { derDeserializeRSAPrivateKey, derSerializePublicKey } from '@relaycorp/relaynet-core';
import { buffer as getStdin } from 'get-stdin';

const CRYPTO = new Crypto();

export const command = 'get-rsa-pub';

export const description = 'Extract the public key from a private key';

export async function handler(): Promise<void> {
  const privateKeyDer = await getStdin();
  const privateKey = await derDeserializeRSAPrivateKey(privateKeyDer);
  const publicKey = await getPublicKeyFromPrivate(privateKey);
  process.stdout.write(await derSerializePublicKey(publicKey));
}

async function getPublicKeyFromPrivate(privateKey: CryptoKey): Promise<CryptoKey> {
  const jwkPrivateKey = await CRYPTO.subtle.exportKey('jwk', privateKey);
  const publicKeyData = {
    alg: jwkPrivateKey.alg,
    e: jwkPrivateKey.e,
    ext: jwkPrivateKey.ext,
    kty: jwkPrivateKey.kty,
    n: jwkPrivateKey.n,
  };
  const hashingAlgoName = (privateKey.algorithm as any).hash.name;
  const opts = { hash: { name: hashingAlgoName }, name: privateKey.algorithm.name };
  return CRYPTO.subtle.importKey('jwk', publicKeyData, opts, true, ['verify']);
}
