import React from "react";

import Form from "react-bootstrap/Form";

class AddTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  onChange = event => {
    this.setState({ value: event.target.value });
  };
  
  onFormSubmit = event => {
      event.preventDefault();
      if (this.state.value !== "") {
        this.props.onAddTodo(this.state.value);
        this.setState({ value: "" });
      }
  }

  render() {
    return (
      <Form onSubmit={this.onFormSubmit}>
        <Form.Control
          type="text"
          placeholder="Добавить..."
          value={this.state.value}
          onChange={this.onChange}
        />
      </Form>
    );
  }
}

export default AddTodo;
