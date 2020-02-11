# Default parameters:
relaydev key gen-rsa | openssl rsa -check -in - -inform DER -noout

# Custom modulus:
relaydev key gen-rsa --modulus=4096 | openssl rsa -check -in - -inform DER -noout -text | grep --quiet '4096 bit'
