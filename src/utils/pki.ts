import { Certificate } from '@relaycorp/relaynet-core';
import bufferToArray from 'buffer-to-arraybuffer';
import { promises as fs } from 'fs';

export async function deserializeCertificate(certificatePath: string): Promise<Certificate> {
  const certificateDer = await fs.readFile(certificatePath);
  return Certificate.deserialize(bufferToArray(certificateDer));
}
