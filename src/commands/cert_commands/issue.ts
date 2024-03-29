import {
  derDeserializeRSAPrivateKey,
  derDeserializeRSAPublicKey,
  issueDeliveryAuthorization,
  issueEndpointCertificate,
  issueGatewayCertificate,
} from '@relaycorp/relaynet-core';
import { promises as fs } from 'fs';
import { buffer as getStdin } from 'get-stdin';
import { deserializeCertificate } from '../../utils/pki';
import { parseDate } from '../../utils/time';

export const command = 'issue issuer-key';

export const description = 'Issue a Relaynet PKI certificate and output its DER serialization';

type CertificateType = 'gateway' | 'endpoint' | 'pda';
const issuanceFunctions: {
  readonly [key in CertificateType]:
    | typeof issueEndpointCertificate
    | typeof issueGatewayCertificate
    | typeof issueDeliveryAuthorization;
} = {
  endpoint: issueEndpointCertificate,
  gateway: issueGatewayCertificate,
  pda: issueDeliveryAuthorization,
};

export const builder = {
  'end-date': {
    coerce: parseDate,
    demandOption: true,
    description: 'Certificate end date; e.g., "2014-02-20" or "2014-02-20T08:00:23"',
    type: 'string',
  },
  'hashing-algorithm': {
    choices: ['SHA-256', 'SHA-384', 'SHA-512'],
    default: 'SHA-256',
    type: 'string',
  },
  'issuer-cert': {
    description: 'Path to DER-encoded X.509 certificate of issuer, unless it will be self-issued',
    normalize: true,
    type: 'string',
  },
  type: {
    choices: Object.keys(issuanceFunctions),
    demandOption: true,
    type: 'string',
  },
};

interface ArgumentSet {
  readonly 'end-date': Date;
  readonly 'hashing-algorithm': string;
  readonly 'issuer-cert'?: string;
  readonly 'issuer-key': string;
  readonly type: string;
}

export async function handler(argv: ArgumentSet): Promise<void> {
  const subjectPublicKeyDer = await getStdin();

  const issuerPrivateKeyDer = await fs.readFile(argv['issuer-key']);
  const issuerPrivateKey = await derDeserializeRSAPrivateKey(await issuerPrivateKeyDer, {
    hash: { name: argv['hashing-algorithm'] },
    name: 'RSA-PSS',
  });
  const issuerCertificate = argv['issuer-cert']
    ? await deserializeCertificate(argv['issuer-cert'])
    : undefined;
  if (issuerCertificate === undefined && argv.type === 'pda') {
    throw new Error(
      'This certificate type cannot be self-issued: An issuer certificate is required',
    );
  }

  const issuanceFunction = issuanceFunctions[argv.type as CertificateType];
  const cert = await issuanceFunction({
    // @ts-ignore
    issuerCertificate,
    issuerPrivateKey,
    subjectPublicKey: await derDeserializeRSAPublicKey(subjectPublicKeyDer, {
      hash: { name: argv['hashing-algorithm'] },
      name: 'RSA-PSS',
    }),
    validityEndDate: argv['end-date'],
  });
  process.stdout.write(Buffer.from(cert.serialize()));
}
