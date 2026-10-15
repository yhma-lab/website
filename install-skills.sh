#!/bin/bash

set -eu -o pipefail

pnpx skills add \
  emilkowalski/skills \
  -p -a universal -y \
  --skill mobile-native \
  --skill emil-design-eng \
  --skill apple-design

pnpx skills add \
  antfu/skills \
  -p -a universal -y \
  --skill vite \
  --skill vitest

pnpx skills add \
  GoogleChrome/modern-web-guidance \
  -p -a universal -y \
  --skill modern-web-guidance

pnpx skills add \
  mcollina/skills \
  -p -a universal -y \
  --skill node \
  --skill typescript-magician

pnpx skills add \
  mattpocock/skills \
  -p -a universal -y \
  --skill grill-me \
  --skill grilling \
  --skill codebase-design \
  --skill research

pnpx skills add \
  jakubkrehel/skills \
  -p -a universal -y \
  --skill better-interface
