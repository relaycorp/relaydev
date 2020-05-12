TMP_DIR="$(mktemp --directory)"
trap "rm -r '${TMP_DIR}'" INT TERM EXIT

SENDER_KEY="${TMP_DIR}/sender-key.der"
SENDER_CERT="${TMP_DIR}/sender-cert.der"

TOMORROW="$(date --date='tomorrow' --iso-8601=seconds)"

relaydev key gen-rsa > "${SENDER_KEY}"
openssl rsa -in "${SENDER_KEY}" -inform DER -pubout -outform DER | \
  relaydev cert issue --type=gateway --end-date="${TOMORROW}" "${SENDER_KEY}" > "${SENDER_CERT}"

# Generating and validating cargo
relaydev ramf serialize cargo \
  --recipient-address='https://example.com' \
  --sender-key="${SENDER_KEY}" \
  --sender-cert="${SENDER_CERT}" \
  > "${TMP_DIR}/cargo.ramf"
relaydev ramf deserialize < "${TMP_DIR}/cargo.ramf" | jq -r '.type' | grep -q '^Cargo$'
relaydev ramf deserialize < "${TMP_DIR}/cargo.ramf" | jq -r '.validationError' | grep -q '^null$'

# Deserializing an invalid message
! (echo "invalid" | relaydev ramf deserialize) 2>>/dev/null
