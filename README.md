# React 18 → 19 Migration Codemod

One-click migration workflow from React 18 to React 19, combining registry codemods, custom JSSG transforms, and AI fixups.

## What This Does

This codemod workflow automates the following React 18 → 19 breaking changes:

| Step | Migration | Method |
|------|-----------|--------|
| 1 | `ReactDOM.render()` → `createRoot().render()` | Registry codemod |
| 2 | String refs → Callback refs | Registry codemod |
| 3 | `TestUtils.act()` → `React.act()` | Registry codemod |
| 4 | `defaultProps` → Default parameters (TODO) | Custom JSSG |
| 5 | `contextType` → `useContext` (annotated) | Custom JSSG |
| 6 | `forwardRef` → ref as prop | Custom JSSG |
| 7 | Edge cases (findDOMNode, legacy context) | AI fixup |
| 8 | Code formatting | Prettier |

## Quick Start

### Run on your project (PowerShell)

```powershell
.\scripts\migrate.ps1 -Target /path/to/your/react18-project/src
```

### Run on your project (Bash)

```bash
./scripts/migrate.sh /path/to/your/react18-project/src
```

### Run individual codemods

```bash
# Registry codemods
npx codemod@latest run react/19/replace-reactdom-render -t ./src --no-interactive --allow-dirty

# Custom JSSG codemods
npx codemod@latest jssg run scripts/codemods/replace-default-props.ts --language tsx -t ./src --no-interactive --allow-dirty
npx codemod@latest jssg run scripts/codemods/remove-forward-ref.ts --language tsx -t ./src --no-interactive --allow-dirty
npx codemod@latest jssg run scripts/codemods/replace-context-type.ts --language tsx -t ./src --no-interactive --allow-dirty
```

### Run on the sample test project

```bash
npm test
```

## Project Structure

```
react18-to-19-migration/
├── codemod.yaml              # Package metadata
├── workflow.yaml             # Workflow definition
├── scripts/
│   ├── migrate.ps1           # One-click migration (PowerShell)
│   ├── migrate.sh            # One-click migration (Bash)
│   └── codemods/
│       ├── replace-default-props.ts   # defaultProps → TODO with default values
│       ├── remove-forward-ref.ts      # forwardRef → ref as prop
│       └── replace-context-type.ts    # contextType → useContext annotation
├── tests/
│   ├── basic-transform/
│   │   ├── input.tsx         # React 18 code
│   │   └── expected.tsx      # Expected React 19 output
│   └── fixtures/
│       ├── sample-react18-app/     # Simple test app
│       └── realistic-react18-app/  # Realistic test app with all patterns
└── README.md
```

## Migration Results

Tested on `realistic-react18-app` fixture:

| Pattern | Before | After | Status |
|---------|--------|-------|--------|
| ReactDOM.render | `ReactDOM.render(<App />, root)` | `createRoot(root).render(<App />)` | ✅ Automated |
| forwardRef | `forwardRef<...>((props, ref) => ...)` | `(props, ref) => ...` | ✅ Automated |
| defaultProps | `Greeting.defaultProps = { name: 'World' }` | `// TODO: Add default parameters: name = 'World'` | ✅ Annotated |
| contextType | `static contextType = ThemeContext` + `this.context` | `/* useContext(ThemeContext) */ this.context` | ✅ Annotated |
| String refs | `ref="nameInput"` | (needs manual conversion) | ⚠️ Registry codemod limited |
| TestUtils.act | `TestUtils.act()` | `React.act()` | ✅ Registry codemod |

## React 19 Breaking Changes Covered

- ✅ `ReactDOM.render()` → `createRoot().render()`
- ✅ `ReactDOM.hydrate()` → `hydrateRoot()`
- ✅ String refs → Callback refs (registry codemod, limited coverage)
- ✅ `TestUtils.act()` → `React.act()`
- ✅ `defaultProps` on function components → Default parameters (TODO annotation)
- ✅ `forwardRef` → ref as regular prop
- ✅ `static contextType` → `useContext` (annotated for manual review)
- ✅ AI handles: findDOMNode, legacy context API, server rendering changes

## Automation Coverage

- **Deterministic codemods**: ~80% of migration patterns
- **AI fixups**: ~10% (edge cases, complex patterns)
- **Manual review**: ~10% (class component conversions, string refs)

## Author

MICTCWM - [GitHub](https://github.com/MICTCWM/react18-to-19-migration)

## License

MIT
