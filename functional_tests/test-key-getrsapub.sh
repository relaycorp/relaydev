TMP_DIR="$(mktemp --directory)"
trap "rm -r '${TMP_DIR}'" INT TERM EXIT

PRIVATE_KEY="${TMP_DIR}/private-key.der"
PUBLIC_KEY="${TMP_DIR}/public-key.der"
OPENSSL_PUBLIC_KEY="${TMP_DIR}/public-key.openssl.der"

relaydev key gen-rsa > "${PRIVATE_KEY}"

relaydev key get-rsa-pub < "${PRIVATE_KEY}" > "${PUBLIC_KEY}"

base64 < "${PUBLIC_KEY}"
openssl rsa -inform DER -pubin -in "${PUBLIC_KEY}" -noout

openssl rsa -in "${PRIVATE_KEY}" -inform DER -pubout -outform DER > "${OPENSSL_PUBLIC_KEY}"

# Check that they're identical
(cmp --silent "${PUBLIC_KEY}" "${OPENSSL_PUBLIC_KEY}")
