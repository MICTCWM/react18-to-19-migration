import React, { forwardRef, Component } from 'react';
import ReactDOM from 'react-dom';
import ThemeContext from './context';

// ReactDOM.render (deprecated in React 19)
class App extends Component {
  render() {
    return (
      <div>
        <MyInput ref={this.inputRef} placeholder="Type here" />
        <Greeting name="Alice" />
      </div>
    );
  }
}

// forwardRef (no longer needed in React 19)
const MyInput = forwardRef<HTMLInputElement, { placeholder: string }>(
  (props, ref) => {
    return <input ref={ref} {...props} />;
  }
);

// defaultProps (removed in React 19)
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}
Greeting.defaultProps = { name: 'World' };

// String ref (deprecated)
class Header extends Component {
  render() {
    return <input ref="nameInput" type="text" />;
  }
}

// Class contextType
class ThemeDisplay extends Component {
  static contextType = ThemeContext;
  render() {
    return <div>{this.context}</div>;
  }
}

// ReactDOM.render call
ReactDOM.render(<App />, document.getElementById('root'));
