TMP_DIR="$(mktemp --directory)"
trap "rm -r '${TMP_DIR}'" INT TERM EXIT

SUBJECT_KEY="${TMP_DIR}/subject-key.der"
ISSUER_KEY="${TMP_DIR}/issuer-key.der"
ISSUER_CERT="${TMP_DIR}/issuer-cert.der"

TOMORROW="$(date --date='tomorrow')"

relaydev key gen-rsa > "${ISSUER_KEY}"
relaydev key gen-rsa > "${SUBJECT_KEY}"

function extractRsaPublicKey {
  # Gets a private key in stdin and outputs the public key it contains
  openssl rsa -in - -inform DER -pubout -outform DER
}

# Self-issued, gateway certificate:
(extractRsaPublicKey < "${ISSUER_KEY}") | \
  relaydev cert issue --type=gateway --end-date="${TOMORROW}" "${ISSUER_KEY}" \
  > "${ISSUER_CERT}"
openssl x509 -in - -inform DER -noout < "${ISSUER_CERT}"

# Gateway certificate issued by another gateway:
(extractRsaPublicKey < "${SUBJECT_KEY}") | \
  relaydev cert issue \
    --type=gateway \
    --issuer-cert="${ISSUER_CERT}" \
    --end-date="${TOMORROW}" \
    "${ISSUER_KEY}" \
    | \
  openssl x509 -in - -inform DER -noout

# Self-issued, endpoint certificate (i.e., a public endpoint):
(extractRsaPublicKey < "${ISSUER_KEY}") | \
  relaydev cert issue --type=endpoint --end-date="${TOMORROW}" "${ISSUER_KEY}" \
  > "${ISSUER_CERT}"
openssl x509 -in - -inform DER -noout < "${ISSUER_CERT}"

# Endpoint certificate issued by its gateway:
(extractRsaPublicKey < "${SUBJECT_KEY}") | \
  relaydev cert issue \
    --type=endpoint \
    --issuer-cert="${ISSUER_CERT}" \
    --end-date="${TOMORROW}" \
    "${ISSUER_KEY}" \
    | \
  openssl x509 -in - -inform DER -noout

# Self-issued PDA (invalid, so it should fail!)
! (
  relaydev key gen-rsa | \
  extractRsaPublicKey | \
  relaydev cert issue --type=pda --end-date="${TOMORROW}" "${ISSUER_KEY}" 2>/dev/null
)

# PDA certificate:
(extractRsaPublicKey < "${SUBJECT_KEY}") | \
  relaydev cert issue \
    --type=pda \
    --issuer-cert="${ISSUER_CERT}" \
    --end-date="${TOMORROW}" \
    "${ISSUER_KEY}" \
    | \
  openssl x509 -in - -inform DER -noout

# Self-issued Channel Session key (invalid, so it should fail!)
! (
  relaydev key gen-rsa | \
  extractRsaPublicKey | \
  relaydev cert issue --type=session --end-date="${TOMORROW}" "${ISSUER_KEY}" 2>/dev/null
)

# PDA certificate:
(extractRsaPublicKey < "${SUBJECT_KEY}") | \
  relaydev cert issue \
    --type=session \
    --issuer-cert="${ISSUER_CERT}" \
    --end-date="${TOMORROW}" \
    "${ISSUER_KEY}" \
    | \
  openssl x509 -in - -inform DER -noout
