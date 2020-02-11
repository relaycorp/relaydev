#!/bin/bash

CURRENT_DIR="$(dirname "${BASH_SOURCE[0]}")"

find "${CURRENT_DIR}" -name 'test-*.sh' -print -exec bash -x -o nounset -o errexit -o pipefail {} \;
