import { createRoot } from "react-dom/client";
import React, { forwardRef, useContext, Component } from 'react';
import ReactDOM from 'react-dom';
import ThemeContext from './context';

// 1. ReactDOM.render (deprecated in React 19)
class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <MyInput ref={this.inputRef} placeholder="Type here" />
        <Greeting name="Alice" />
        <ThemeDisplay />
      </div>
    );
  }
}

// 2. forwardRef (no longer needed in React 19)
const MyInput = (props, ref) => {
    return <input ref={ref} {...props} />;
  };

// 3. defaultProps (removed in React 19)
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}
// TODO: React 19 - Add default parameters to Greeting: name = 'World';

// 4. Class component with contextType
class ThemeDisplay extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = /* useContext(MyContext) */ this.context;
    return <div>Current theme: {theme}</div>;
  }
}

// 5. String ref (deprecated)
class Header extends Component {
  private inputRef: React.RefObject<HTMLInputElement>;

  render() {
    return (
      <header>
        <h1>My App</h1>
        <input ref="nameInput" type="text" />
      </header>
    );
  }
}

export default App;

// 6. ReactDOM.render call
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
