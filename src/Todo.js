import React from "react";

import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import { Icon } from "react-icons-kit";
// import { pencil } from "react-icons-kit/fa/pencil";
import { remove } from "react-icons-kit/fa/remove";

class Todo extends React.Component {
  handleTodoClick = (e) => {
      this.props.onChangeTodoCompleted(this.props.todo)
  }

  handleTodoDelete = (e) => {
    this.props.onDelete(this.props.todo)
  }

  render() {
    let btnVariant;
    if (this.props.todo.isCompleted) btnVariant = "outline-secondary";
    else btnVariant = "outline-primary";

    return (
      <ListGroup.Item style={{ display: "flex" }}>
        <Button variant={btnVariant} style={{ width: "100%" }} onClick={this.handleTodoClick}>
          {this.props.todo.title}
        </Button>
        {/* <Form.Control type="text" placeholder="Изменить..." defaultValue={this.props.todo.title}/> */}
        {/* <Button style={{ marginLeft: "10px" }}>
          <Icon icon={pencil} />
        </Button> */}
        <Button style={{ marginLeft: "10px" }} onClick={this.handleTodoDelete}>
          <Icon icon={remove} />
        </Button>
      </ListGroup.Item>
    );
  }
}

export default Todo;
