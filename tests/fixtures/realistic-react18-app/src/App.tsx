import React, { forwardRef, Component, useState } from 'react';
import ReactDOM from 'react-dom';
import ThemeContext from './ThemeContext';

// ============ Pattern 1: forwardRef ============
// React 19: ref is a regular prop, no need for forwardRef
const CustomInput = forwardRef<HTMLInputElement, { label: string }>(
  (props, ref) => {
    return (
      <div>
        <label>{props.label}</label>
        <input ref={ref} type="text" />
      </div>
    );
  }
);

const CustomButton = forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
  (props, ref) => {
    return <button ref={ref}>{props.children}</button>;
  }
);

// ============ Pattern 2: defaultProps ============
// React 19: defaultProps removed for function components
function UserCard({ name, role, avatar }: { name: string; role: string; avatar: string }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}
UserCard.defaultProps = { name: 'Guest', role: 'Viewer', avatar: '/default.png' };

function Message({ text, type }: { text: string; type: string }) {
  return <div className={`message message-${type}`}>{text}</div>;
}
Message.defaultProps = { type: 'info' };

// ============ Pattern 3: Class with contextType ============
// React 19: prefer useContext hook
class ThemedSection extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    return (
      <div style={{ color: theme.foreground, background: theme.background }}>
        <h2>Themed Content</h2>
        <p>This section uses the current theme.</p>
      </div>
    );
  }
}

// ============ Pattern 4: String refs (deprecated) ============
class LegacyForm extends Component {
  handleSubmit = () => {
    const input = this.refs.nameInput as HTMLInputElement;
    console.log(input.value);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref="nameInput" type="text" />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

// ============ Pattern 5: ReactDOM.render ============
class App extends Component {
  render() {
    return (
      <div>
        <h1>React 18 App</h1>
        <CustomInput label="Name" />
        <CustomButton>Click me</CustomButton>
        <UserCard name="Alice" role="Admin" />
        <Message text="Welcome!" />
        <ThemedSection />
        <LegacyForm />
      </div>
    );
  }
}

export default App;

// Entry point using legacy ReactDOM.render
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
}
