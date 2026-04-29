# React 18 → 19 One-Click Migration Script (PowerShell)
# Usage: .\scripts\migrate.ps1 <target-directory>

param(
    [string]$Target = "."
)

Write-Host "🚀 Starting React 18 → 19 migration on: $Target" -ForegroundColor Cyan
Write-Host ""

# Step 1: Replace ReactDOM.render with createRoot
Write-Host "📝 Step 1/6: Replacing ReactDOM.render with createRoot..." -ForegroundColor Yellow
npx codemod@latest run react/19/replace-reactdom-render -t $Target --no-interactive --allow-dirty 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  ⚠️ Skipped (no matches or error)" -ForegroundColor DarkYellow }

# Step 2: Replace string refs with callback refs
Write-Host "📝 Step 2/6: Replacing string refs with callback refs..." -ForegroundColor Yellow
npx codemod@latest run react/19/replace-string-ref -t $Target --no-interactive --allow-dirty 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  ⚠️ Skipped (no matches or error)" -ForegroundColor DarkYellow }

# Step 3: Replace TestUtils.act with React.act
Write-Host "📝 Step 3/6: Replacing TestUtils.act with React.act..." -ForegroundColor Yellow
npx codemod@latest run react/19/replace-act-import -t $Target --no-interactive --allow-dirty 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  ⚠️ Skipped (no matches or error)" -ForegroundColor DarkYellow }

# Step 4: Run custom JSSG codemods
Write-Host "📝 Step 4/6: Running custom codemods (defaultProps, forwardRef, contextType)..." -ForegroundColor Yellow
npx codemod@latest jssg run scripts/codemods/replace-default-props.ts --language tsx -t $Target --no-interactive --allow-dirty 2>$null
npx codemod@latest jssg run scripts/codemods/remove-forward-ref.ts --language tsx -t $Target --no-interactive --allow-dirty 2>$null
npx codemod@latest jssg run scripts/codemods/replace-context-type.ts --language tsx -t $Target --no-interactive --allow-dirty 2>$null

# Step 5: AI fixups
Write-Host "📝 Step 5/6: AI fixups for edge cases..." -ForegroundColor Yellow
Write-Host "  💡 Run manually with: npx codemod@latest workflow run -w . -t $Target --agent claude" -ForegroundColor DarkGray

# Step 6: Format code
Write-Host "📝 Step 6/6: Formatting code..." -ForegroundColor Yellow
npx prettier --write "$Target/**/*.{ts,tsx,js,jsx}" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "  ⚠️ Prettier not available, skipping" -ForegroundColor DarkYellow }

Write-Host ""
Write-Host "✅ Migration complete! Review the changes and run your tests." -ForegroundColor Green
Write-Host ""
Write-Host "📋 Post-migration checklist:" -ForegroundColor White
Write-Host "  1. Update package.json: react and react-dom to ^19.0.0"
Write-Host "  2. Run npm install && npm test"
Write-Host "  3. Review any TODO comments added by the codemod"
Write-Host "  4. Manually convert remaining class components (if any)"
