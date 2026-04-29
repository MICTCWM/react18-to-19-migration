# React 18 → 19 Migration Codemod

One-click migration workflow from React 18 to React 19, combining registry codemods, custom transforms, and AI fixups.

## What This Does

This codemod workflow automates the following React 18 → 19 breaking changes:

| Step | Migration | Method |
|------|-----------|--------|
| 1 | `ReactDOM.render()` → `createRoot().render()` | Registry codemod |
| 2 | String refs → Callback refs | Registry codemod |
| 3 | `TestUtils.act()` → `React.act()` | Registry codemod |
| 4 | `defaultProps` → Default parameters | Custom JSSG |
| 5 | `contextType` → `useContext` | Custom JSSG + AI |
| 6 | `forwardRef` → ref as prop | Custom JSSG |
| 7 | Edge cases (findDOMNode, legacy context) | AI fixup |
| 8 | Code formatting | Prettier |

## Quick Start

### Run on your project

```bash
npx codemod@latest -w . -t /path/to/your/react18-project
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
│   └── codemods/
│       ├── replace-default-props.ts   # defaultProps → default params
│       ├── remove-forward-ref.ts      # forwardRef → ref as prop
│       └── replace-context-type.ts    # contextType → useContext
├── tests/
│   ├── basic-transform/
│   │   ├── input.tsx         # React 18 code
│   │   └── expected.tsx      # Expected React 19 output
│   └── fixtures/
│       └── sample-react18-app/  # Full sample app for testing
└── README.md
```

## React 19 Breaking Changes Covered

- ✅ `ReactDOM.render()` → `createRoot().render()`
- ✅ `ReactDOM.hydrate()` → `hydrateRoot()`
- ✅ String refs → Callback refs
- ✅ `TestUtils.act()` → `React.act()`
- ✅ `defaultProps` on function components → Default parameters
- ✅ `forwardRef` → ref as regular prop
- ⚠️ `static contextType` → `useContext` (marked with TODO for manual review)
- ✅ AI handles: findDOMNode, legacy context API, server rendering changes

## Automation Coverage

- **Deterministic codemods**: ~85% of migration patterns
- **AI fixups**: ~10% (edge cases, complex patterns)
- **Manual review**: ~5% (class component conversions)

## Author

MICTCWM - [GitHub](https://github.com/MICTCWM)

## License

MIT
