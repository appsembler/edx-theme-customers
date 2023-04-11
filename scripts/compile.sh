#!/usr/bin/env bash
set -ex

# Run via `tox -e compile`
pysassc cms/static/sass/amc-specific.scss cms/static/css/amc-specific.css
