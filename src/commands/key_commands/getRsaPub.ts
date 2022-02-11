import {
  derDeserializeRSAPrivateKey,
  derSerializePublicKey,
  getRSAPublicKeyFromPrivate,
} from '@relaycorp/relaynet-core';
import { buffer as getStdin } from 'get-stdin';

export const command = 'get-rsa-pub';

export const description = 'Extract the public key from a private key';

export async function handler(): Promise<void> {
  const privateKeyDer = await getStdin();
  const privateKey = await derDeserializeRSAPrivateKey(privateKeyDer);
  const publicKey = await getRSAPublicKeyFromPrivate(privateKey);
  process.stdout.write(await derSerializePublicKey(publicKey));
}
