import React from "react";

import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Icon } from "react-icons-kit";
import { refresh } from "react-icons-kit/fa/refresh";

class TodoSettings extends React.Component {
  handleRefresh = event => {
    this.props.onRefresh();
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <Container>
        <Form>
          <Form.Check
            type="checkbox"
            label="Показывать выполненные"
            checked={this.props.showCompleted}
            onChange={this.props.onChangeShowCompleted}
          />
        </Form>
        </Container>
        <Button style={{ marginLeft: "10px" }} onClick={this.handleRefresh}>
          <Icon icon={refresh} />
        </Button>          
      </div>
    );
  }
}

export default TodoSettings;
