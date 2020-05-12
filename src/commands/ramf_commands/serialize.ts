import {
  Cargo,
  CargoCollectionAuthorization,
  derDeserializeRSAPrivateKey,
  Parcel,
} from '@relaycorp/relaynet-core';
import { promises as fs } from 'fs';
import { buffer as getStdin } from 'get-stdin';

import { deserializeCertificate } from '../../utils/pki';
import { parseDate } from '../../utils/time';

const RAMF_MESSAGE_BY_NAME = {
  cargo: Cargo,
  cca: CargoCollectionAuthorization,
  parcel: Parcel,
};

export const command = 'serialize type';

export const description = 'Create and serialize a new message';

export const builder = {
  'creation-date': {
    coerce: parseDate,
    description: 'Creation date; e.g., "2014-02-20" or "2014-02-20T08:00:23"',
    type: 'string',
  },
  'recipient-address': {
    demandOption: true,
    description: 'Private or public address of recipient',
    type: 'string',
  },
  'sender-cert': {
    demandOption: true,
    description: 'Path to DER-encoded X.509 certificate of the sender',
    normalize: true,
    type: 'string',
  },
  'sender-cert-chain': {
    description: 'Path(s) to the DER-encoded X.509 certificates in the sender chain',
    normalize: true,
    type: 'array',
  },
  'sender-key': {
    demandOption: true,
    description: 'Path to DER-encoded, private RSA key of the sender',
    normalize: true,
    type: 'string',
  },
  ttl: { description: 'TTL (in seconds) from the creation date of the message', type: 'number' },
  type: { choices: Object.keys(RAMF_MESSAGE_BY_NAME), type: 'string', demandOption: true },
};

interface ArgumentSet {
  readonly 'creation-date'?: Date;
  readonly ttl?: number;
  readonly type: keyof typeof RAMF_MESSAGE_BY_NAME;
  readonly 'recipient-address': string;
  readonly 'sender-cert': string;
  readonly 'sender-cert-chain'?: readonly string[];
  readonly 'sender-key': string;
}

export async function handler(argv: ArgumentSet): Promise<void> {
  const ramfMessageClass = RAMF_MESSAGE_BY_NAME[argv.type];
  const senderCertificate = await deserializeCertificate(argv['sender-cert']);
  const ramfMessage = new ramfMessageClass(
    argv['recipient-address'],
    senderCertificate,
    await getStdin(),
    {
      date: argv['creation-date'],
      senderCaCertificateChain: await Promise.all(
        (argv['sender-cert-chain'] || []).map(deserializeCertificate),
      ),
      ttl: argv.ttl,
    },
  );
  const privateKey = await deserializePrivateKey(argv['sender-key']);
  process.stdout.write(Buffer.from(await ramfMessage.serialize(privateKey)));
}

async function deserializePrivateKey(privateKeyPath: string): Promise<CryptoKey> {
  const keySerialized = await fs.readFile(privateKeyPath);
  return derDeserializeRSAPrivateKey(keySerialized, { name: 'RSA-PSS', hash: { name: 'SHA-256' } });
}
