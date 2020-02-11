KEY="$(mktemp)"
trap "rm '${KEY}'" INT TERM EXIT
relaydev key gen-rsa > "${KEY}"

TOMORROW="$(date --date='tomorrow')"

# Inspect valid certificate:
openssl rsa -in "${KEY}" -inform DER -pubout -outform DER | \
  relaydev cert issue --type=gateway --end-date="${TOMORROW}" "${KEY}" | \
  relaydev cert inspect | \
  grep --quiet 'Certificate is valid'

# Inspecting an invalid certificate should fail:
! (echo "I'm a certificate. I pinky promise." | relaydev cert inspect 2>>/dev/null )
