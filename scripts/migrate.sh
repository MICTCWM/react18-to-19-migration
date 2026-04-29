#!/bin/bash
# React 18 → 19 One-Click Migration Script
# Usage: ./scripts/migrate.sh <target-directory>

set -e

TARGET="${1:-.}"

echo "🚀 Starting React 18 → 19 migration on: $TARGET"
echo ""

# Step 1: Replace ReactDOM.render with createRoot
echo "📝 Step 1/6: Replacing ReactDOM.render with createRoot..."
npx codemod@latest run react/19/replace-reactdom-render -t "$TARGET" --no-interactive --allow-dirty 2>/dev/null || echo "  ⚠️ Skipped (no matches or error)"

# Step 2: Replace string refs with callback refs
echo "📝 Step 2/6: Replacing string refs with callback refs..."
npx codemod@latest run react/19/replace-string-ref -t "$TARGET" --no-interactive --allow-dirty 2>/dev/null || echo "  ⚠️ Skipped (no matches or error)"

# Step 3: Replace TestUtils.act with React.act
echo "📝 Step 3/6: Replacing TestUtils.act with React.act..."
npx codemod@latest run react/19/replace-act-import -t "$TARGET" --no-interactive --allow-dirty 2>/dev/null || echo "  ⚠️ Skipped (no matches or error)"

# Step 4: Run custom JSSG codemods
echo "📝 Step 4/6: Running custom codemods (defaultProps, forwardRef, contextType)..."
npx codemod@latest jssg --js-file scripts/codemods/replace-default-props.ts --language typescript -t "$TARGET" 2>/dev/null || echo "  ⚠️ defaultProps: Skipped"
npx codemod@latest jssg --js-file scripts/codemods/remove-forward-ref.ts --language typescript -t "$TARGET" 2>/dev/null || echo "  ⚠️ forwardRef: Skipped"
npx codemod@latest jssg --js-file scripts/codemods/replace-context-type.ts --language typescript -t "$TARGET" 2>/dev/null || echo "  ⚠️ contextType: Skipped"

# Step 5: AI fixups (requires --agent flag)
echo "📝 Step 5/6: AI fixups for edge cases..."
echo "  💡 Run manually with: npx codemod@latest workflow run -w . -t $TARGET --agent claude"

# Step 6: Format code
echo "📝 Step 6/6: Formatting code..."
npx prettier --write "$TARGET/**/*.{ts,tsx,js,jsx}" 2>/dev/null || echo "  ⚠️ Prettier not available, skipping"

echo ""
echo "✅ Migration complete! Review the changes and run your tests."
echo ""
echo "📋 Post-migration checklist:"
echo "  1. Update package.json: react and react-dom to ^19.0.0"
echo "  2. Run npm install && npm test"
echo "  3. Review any TODO comments added by the codemod"
echo "  4. Manually convert remaining class components (if any)"
