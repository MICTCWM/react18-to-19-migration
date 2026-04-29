import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import ThemeContext from './context';

// ReactDOM.render → createRoot (migrated by registry codemod)
function App() {
  return (
    <div>
      <MyInput ref={this.inputRef} placeholder="Type here" />
      <Greeting name="Alice" />
    </div>
  );
}

// forwardRef removed (React 19 supports ref as prop)
const MyInput = ({ ref, ...props }: { placeholder: string, ref?: React.Ref<HTMLInputElement> }) => {
  return <input ref={ref} {...props} />;
};

// defaultProps → default parameters
function Greeting({ name = 'World' }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// String ref → callback ref (migrated by registry codemod)
class Header extends Component {
  render() {
    return <input ref={ref => this.refs.nameInput = ref} type="text" />;
  }
}

// Class contextType → useContext (TODO: manual conversion)
// TODO: React 19 - Convert to function component with useContext(ThemeContext)
class ThemeDisplay extends Component {
  static contextType = ThemeContext;
  render() {
    return <div>{/* useContext(ThemeContext) */ this.context}</div>;
  }
}

// createRoot replaces ReactDOM.render
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
