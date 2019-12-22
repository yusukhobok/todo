import React from "react";

import Button from "react-bootstrap/Button";
import { Icon } from "react-icons-kit";
import { refresh } from "react-icons-kit/fa/refresh";

class TodoSettings extends React.Component {
  render() {
    let btnVariant;
    if (this.props.showCompleted) btnVariant = "outline-primary"
    else btnVariant = "outline-secondary";

    return (
      <div style={{ display: "flex" }}>
        <Button
          variant={btnVariant}
          style={{ width: "100%" }}
          onClick={this.props.onChangeShowCompleted}>
          Показывать выполненные
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={this.props.onRefresh}>
          <Icon icon={refresh} />
        </Button>
      </div>
    );
  }
}

export default TodoSettings;
