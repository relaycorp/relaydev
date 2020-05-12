# relaydev: Development tools for implementers of the Relaynet Protocol Suite

This command-line application is a thin wrapper around the [Relaynet core library for Node.js](https://github.com/relaycorp/relaynet-core-js) and it contains a series of utilities aimed at implementers of the Relaynet protocol suite. If you're porting Relaynet to a new programming language or platform, you may want to check the input and output of your implementation against these utilities.

Relaynet couriers, service providers or end users do not need to use this software at all.

## Install

You must have Node.js 10 or newer to use this software. To get the latest stable version, run:

```
npm install -g @relaycorp/relaydev
```

And to get or upgrade to the latest development version, run:

```
npm install -g @relaycorp/relaydev@dev
```

## `relaydev` CLI

## `key`: Key management

### `relaydev key gen-rsa`: Generate an RSA key

```
$ relaydev key gen-rsa --help
relaydev key gen-rsa

Generate an RSA key and output its private component DER-encoded

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  --modulus                 [number] [choices: 2048, 3072, 4096] [default: 2048]
```

For example, run the following to inspect the generated key:

```
relaydev key gen-rsa | openssl rsa -check -in - -inform DER -noout -text
```

### `relaydev key gen-ecdh`: Generate an ECDH key

```
$ relaydev key gen-ecdh --help
relaydev key gen-ecdh

Generate an ECDH key and output its private component DER-encoded

Options:
  --version     Show version number                                    [boolean]
  --help        Show help                                              [boolean]
  --curve-name  [string] [choices: "P-256", "P-384", "P-521"] [default: "P-256"]
```

For example, run the following to inspect the generated key:

```
relaydev key gen-ecdh | openssl pkey -in - -inform DER -noout -text
```

### `relaydev cert issue`: Issue a Relaynet PKI Certificate

```
$ relaydev cert issue --help
relaydev cert issue issuer-key

Issue a Relaynet PKI certificate and output its DER serialization

Options:
  --version            Show version number                             [boolean]
  --help               Show help                                       [boolean]
  --end-date           Certificate end date; e.g., "2014-02-20" or
                       "2014-02-20T08:00:23"                 [string] [required]
  --hashing-algorithm
        [string] [choices: "SHA-256", "SHA-384", "SHA-512"] [default: "SHA-256"]
  --issuer-cert        Path to DER-encoded X.509 certificate of issuer, unless
                       it will be self-issued                           [string]
  --type  [string] [required] [choices: "endpoint", "gateway", "pda", "session"]
```

For example, the following will create a self-issued gateway certificate that expires the following week:

```
END_DATE="$(date --date='next week' --iso-8601=seconds)"
relaydev key gen-rsa > key.der

openssl rsa -in key.der -inform DER -pubout -outform DER | \
  relaydev cert issue --type=gateway --end-date="${END_DATE}" key.der \
  > cert.der
```

### `relaydev cert inspect`: Inspect a Relaynet PKI Certificate

```
$ relaydev cert inspect --help
relaydev cert inspect

Inspect DER-encoded Relaynet PKI certificate

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

For example, to inspect the certificate `cert.der`, run:

```
relaydev cert inspect < cert.der
```

# Development

If you're contributing to this package, after installing it locally with `npm install`, make sure to run `npm run build:dev` to transpile the TypeScript code and make the `relaydev` script available in your `$PATH` -- you'll have to re-run that whenever you want to check your changes.

To run the functional tests, run `npm test`. Note you'll need the following dependencies in your `$PATH` to run the tests:

- `openssl`
- `jq`
