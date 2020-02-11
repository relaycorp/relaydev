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

## `relaydev key gen-ecdh`: Generate an ECDH key

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

# Development

If you're contributing to this package, after installing it locally with `npm install`, make sure to run `npm run build:dev` to transpile the TypeScript code and make the `relaydev` script available in your `$PATH` -- you'll have to re-run that whenever you want to check your changes.

To run the functional tests, run `npm test`.
