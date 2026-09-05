#!/bin/bash

# Remotion Batch Rendering Script
# Renders all compositions with automatic output management

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create output directory
mkdir -p ./out

echo -e "${BLUE}🎬 Remotion Batch Rendering Started${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Array of compositions
declare -a COMPOSITIONS=(
  "BlankCanvas"
  "ShapesPlayground"
  "PathsPlayground"
  "TransitionsPlayground"
  "MediaPlayground"
  "NoisePlayground"
  "ThreePlayground"
)

# Render each composition
for COMP in "${COMPOSITIONS[@]}"; do
  echo -e "${YELLOW}📹 Rendering: ${COMP}${NC}"

  # Convert camelCase to kebab-case for filename
  FILENAME=$(echo "$COMP" | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')

  # Render with progress
  if npm run render:"$FILENAME" 2>/dev/null || remotion render src/index.tsx "$COMP" --output "./out/${FILENAME}.mp4"; then
    echo -e "${GREEN}✓ ${COMP} rendered successfully${NC}"
  else
    # If specific script doesn't exist, use general render
    remotion render src/index.tsx "$COMP" --output "./out/${FILENAME}.mp4"
    echo -e "${GREEN}✓ ${COMP} rendered successfully${NC}"
  fi

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
done

echo -e "${GREEN}✨ All compositions rendered successfully!${NC}"
echo -e "${BLUE}📂 Output directory: ./out${NC}"

# List all rendered files
echo -e "\n${YELLOW}📋 Rendered Files:${NC}"
ls -lh ./out/*.mp4 2>/dev/null || echo "No MP4 files found"

echo -e "\n${GREEN}Done! 🎉${NC}"
