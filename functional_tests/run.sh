#!/bin/bash

CURRENT_DIR="$(dirname "${BASH_SOURCE[0]}")"

for test_file in "${CURRENT_DIR}"/test-*.sh; do
  if ! bash -x -o nounset -o errexit -o pipefail "${test_file}"; then
    echo "${test_file} failed." >&2
    exit 1
  fi
done
