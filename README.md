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

To learn how to use a sub-command, run it without arguments or with the `--help` option.

## `key`: Key management

### `relaydev key gen-rsa`: Generate an RSA key

For example, run the following to inspect the generated key:

```
relaydev key gen-rsa | openssl rsa -check -in - -inform DER -noout -text
```

### `relaydev key gen-ecdh`: Generate an ECDH key

For example, run the following to inspect the generated key:

```
relaydev key gen-ecdh | openssl pkey -in - -inform DER -noout -text
```

### `relaydev cert issue`: Issue a Relaynet PKI Certificate

For example, the following will create a self-issued gateway certificate that expires the following week:

```
END_DATE="$(date --date='next week' --iso-8601=seconds)"
relaydev key gen-rsa > key.der

openssl rsa -in key.der -inform DER -pubout -outform DER | \
  relaydev cert issue --type=gateway --end-date="${END_DATE}" key.der \
  > cert.der
```

### `relaydev cert inspect`: Inspect a Relaynet PKI Certificate

For example, to inspect the certificate `cert.der`, run:

```
relaydev cert inspect < cert.der
```

### `relaydev ramf serialize`: Create and serialize a RAMF message

For example, run the following to create a cargo `cargo.ramf` whose payload is contained in the file `cargo-message-set.cms`:

```
cat cargo-message-set.cms | relaydev ramf serialize cargo \
    --recipient-address=https://example.com \
    --sender-key=key.der \
    --sender-cert=cert.der \
    > cargo.ramf
```

### `relaydev ramf deserialize`: Deserialize and validate a RAMF message

For example, to inspect the cargo message created above, run:

```
relaydev ramf deserialize < cargo.ramf
```

# Development

If you're contributing to this package, after installing it locally with `npm install`, make sure to run `npm run build:dev` to transpile the TypeScript code and make the `relaydev` script available in your `$PATH` -- you'll have to re-run that whenever you want to check your changes.

To run the functional tests, run `npm test`. Note you'll need the following dependencies in your `$PATH` to run the tests:

- `openssl`
- `jq`
