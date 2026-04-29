// Codemod: Replace class contextType with useContext hook
// React 19 encourages functional components with hooks over class components
//
// Before:
//   class MyComponent extends React.Component {
//     static contextType = MyContext
//     render() { return <div>{this.context}</div> }
//   }
//
// After (TODO comment for manual conversion):
//   // TODO: React 19 - Convert to function component with useContext(MyContext)
//   class MyComponent extends React.Component { ... }

import type { Codemod } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const codemod: Codemod<TSX> = (root) => {
  const rootNode = root.root();

  // Find this.context references
  const thisContextRefs = rootNode.findAll({
    rule: { pattern: "this.context" },
  });

  if (thisContextRefs.length === 0) {
    return null;
  }

  // Extract context name from source text (since AST pattern matching
  // doesn't easily match class field definitions with 'static' keyword)
  const sourceText = rootNode.text();
  const contextTypeMatch = sourceText.match(/static\s+contextType\s*=\s*(\w+)/);
  const contextName = contextTypeMatch ? contextTypeMatch[1] : "Context";

  const edits: any[] = [];

  // Annotate this.context references with the context name
  for (const ref of thisContextRefs) {
    edits.push(ref.replace(`/* useContext(${contextName}) */ this.context`));
  }

  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
};

export default codemod;
