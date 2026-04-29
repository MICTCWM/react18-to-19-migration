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

  // Find this.context references and annotate them
  const thisContextRefs = rootNode.findAll({
    rule: { pattern: "this.context" },
  });

  // Find contextType assignments (both static and non-static)
  const contextTypeStatic = rootNode.findAll({
    rule: { pattern: "contextType = $CONTEXT" },
  });

  if (contextTypeStatic.length === 0 && thisContextRefs.length === 0) {
    return null;
  }

  const edits: any[] = [];

  // Collect all context names first
  const contextNames: string[] = [];
  for (const usage of contextTypeStatic) {
    const contextName = usage.getMatch("CONTEXT")?.text();
    if (contextName) {
      contextNames.push(contextName);
      // Replace contextType assignment with a TODO comment
      edits.push(
        usage.replace(
          `contextType = ${contextName} // TODO: React 19 - Convert to function component with useContext(${contextName})`
        )
      );
    }
  }

  // Annotate this.context references
  for (const ref of thisContextRefs) {
    const contextName = contextNames.length > 0 ? contextNames[0] : "Context";
    edits.push(ref.replace(`/* useContext(${contextName}) */ this.context`));
  }

  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
};

export default codemod;
