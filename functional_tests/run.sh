#!/bin/bash

CURRENT_DIR="$(dirname "${BASH_SOURCE[0]}")"

find "${CURRENT_DIR}" -name 'test-*.sh' -print0 | \
  xargs --null --max-args=1 --verbose bash -x -o nounset -o errexit -o pipefail
