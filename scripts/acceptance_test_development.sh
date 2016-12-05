#! /usr/bin/env bash
# Development level acceptance tests

# Generate all reports, for all units of development
cd .. && mocha --recursive
