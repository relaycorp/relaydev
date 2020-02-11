/* tslint:disable:no-console */

import { Certificate } from '@relaycorp/relaynet-core';
import bufferToArray from 'buffer-to-arraybuffer';
import { buffer as getStdin } from 'get-stdin';

export const command = 'inspect';

export const description = 'Inspect DER-encoded Relaynet PKI certificate';

export const builder = {};

interface ArgumentSet {}

export async function handler(_argv: ArgumentSet): Promise<number | void> {
  const certificateDer = await getStdin();

  const certificate = Certificate.deserialize(bufferToArray(certificateDer));

  console.log('Common Name:', certificate.getCommonName());
  console.log('Private address:', await certificate.calculateSubjectPrivateAddress());

  certificate.validate();

  console.info('Certificate is valid');

  console.info('');
  console.info('Use `openssl` to get the full details:');
  console.info('openssl x509 -noout -text -inform DER -in /path/to/cert.der');
}
