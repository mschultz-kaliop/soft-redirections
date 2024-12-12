#!/bin/sh
set -ex
eval $( fixuid )
exec "$@"
