// Codemod: Remove forwardRef wrapper (React 19 supports ref as a regular prop)
//
// Before:
//   const MyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
//     return <input ref={ref} {...props} />
//   })
//
// After:
//   const MyInput = ({ ref, ...props }) => {
//     return <input ref={ref} {...props} />
//   }

import type { Codemod } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const codemod: Codemod<TSX> = (root) => {
  const rootNode = root.root();

  // Find: (props, ref) =>  — the inner callback of forwardRef
  const propsRefCallbacks = rootNode.findAll({
    rule: { pattern: "(props, ref) => $$$BODY" },
  });

  if (propsRefCallbacks.length === 0) {
    return null;
  }

  const edits: any[] = [];

  for (const callback of propsRefCallbacks) {
    // Replace (props, ref) => with ({ ref, ...props }) =>
    edits.push(callback.replace("({ ref, ...props }) =>"));
  }

  // Also find: ({ ...destructuring }, ref) => pattern
  const destructureRefCallbacks = rootNode.findAll({
    rule: { pattern: "({ $$$PROPS }, $REF) => $$$BODY" },
  });

  for (const callback of destructureRefCallbacks) {
    const propTexts = callback.getMultipleMatches("PROPS").map((p) => p.text());
    const refText = callback.getMatch("REF")?.text() || "ref";
    const newParams = `{ ${propTexts.join(", ")}, ${refText} }`;
    edits.push(callback.replace(`(${newParams}) =>`));
  }

  // Find forwardRef wrapper and remove it
  // Pattern: forwardRef<...>(...) or forwardRef(...)
  const forwardRefCalls = rootNode.findAll({
    rule: {
      any: [
        { pattern: "forwardRef<$$$TYPES>($$$ARGS)" },
        { pattern: "forwardRef($$$ARGS)" },
      ],
    },
  });

  for (const call of forwardRefCalls) {
    // Get the inner content (the callback function)
    const args = call.getMultipleMatches("ARGS").map((a) => a.text());
    if (args.length > 0) {
      // Just return the inner callback, removing forwardRef wrapper
      edits.push(call.replace(args.join(", ")));
    }
  }

  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
};

export default codemod;
