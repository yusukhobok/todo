import React from "react";

import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import { Icon } from "react-icons-kit";
// import { refresh } from "react-icons-kit/fa/refresh";

class TodoSettings extends React.Component {
  handleRefresh = event => {
    this.props.onRefresh();
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        {/* <Button style={{ marginRight: "10px" }} onClick={this.handleRefresh}>
          <Icon icon={refresh} />
        </Button>           */}
        <Form>
          <Form.Check
            type="checkbox"
            label="Скрывать выполненные"
            checked={this.props.showCompleted}
            onChange={this.props.onChangeShowCompleted}
          />
        </Form>
      </div>
    );
  }
}

export default TodoSettings;
