// Codemod: Replace defaultProps with default function parameters
// React 19 removes defaultProps on function components
//
// Before:
//   function Greeting({ name }) { ... }
//   Greeting.defaultProps = { name: "World" }
//
// After:
//   // TODO: React 19 - Move defaultProps to default parameters
//   function Greeting({ name = "World" }) { ... }

import type { Codemod } from "codemod:ast-grep";
import type TSX from "codemod:ast-grep/langs/tsx";

const codemod: Codemod<TSX> = (root) => {
  const rootNode = root.root();

  // Find all Component.defaultProps = { ... } assignments
  const defaultPropsAssignments = rootNode.findAll({
    rule: { pattern: "$COMP.defaultProps = $PROPS" },
  });

  if (defaultPropsAssignments.length === 0) {
    return null;
  }

  const edits: any[] = [];

  for (const assignment of defaultPropsAssignments) {
    const compName = assignment.getMatch("COMP")?.text();
    const propsNode = assignment.getMatch("PROPS");

    if (!compName || !propsNode) continue;

    // Extract default values from the object literal
    const propsText = propsNode.text();
    const defaults: string[] = [];

    // Parse { key: value, key2: value2 }
    const innerMatch = propsText.match(/^\{(.+)\}$/s);
    if (innerMatch) {
      const pairs = innerMatch[1].split(",").map((s: string) => s.trim()).filter(Boolean);
      for (const pair of pairs) {
        const colonIdx = pair.indexOf(":");
        if (colonIdx > 0) {
          const key = pair.slice(0, colonIdx).trim();
          const value = pair.slice(colonIdx + 1).trim();
          defaults.push(`${key} = ${value}`);
        }
      }
    }

    const todoMsg = defaults.length > 0
      ? `// TODO: React 19 - Add default parameters to ${compName}: ${defaults.join(", ")}`
      : `// TODO: React 19 - Remove defaultProps from ${compName}`;

    // Replace the defaultProps assignment with a TODO comment
    edits.push(assignment.replace(todoMsg));
  }

  return edits.length > 0 ? rootNode.commitEdits(edits) : null;
};

export default codemod;
