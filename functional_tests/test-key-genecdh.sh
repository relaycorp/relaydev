# Default parameters:
relaydev key gen-ecdh | openssl pkey -in - -inform DER -noout

# Custom named curve:
# TODO: Reinstate when https://github.com/relaycorp/relaynet-core-js/issues/53 has been fixed
#relaydev key gen-ecdh --named-curve=P-521 | \
#  openssl pkey -in - -inform DER -noout -text | \
#  grep --quiet 'NIST CURVE: P-521'
