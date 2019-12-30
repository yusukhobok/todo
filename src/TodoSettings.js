import React from "react";

import Button from "react-bootstrap/Button";
import { Icon } from "react-icons-kit";
import { refresh } from "react-icons-kit/fa/refresh";

class TodoSettings extends React.Component {
  render() {
    let btnVariantShowCompleted, btnVariantDraggeble;
    if (this.props.showCompleted) btnVariantShowCompleted = "outline-primary"
    else btnVariantShowCompleted = "outline-secondary";
    if (this.props.draggable) btnVariantDraggeble = "outline-primary"
    else btnVariantDraggeble = "outline-secondary";

    return (
      <div style={{ display: "flex"}}>
        <Button
          variant={btnVariantShowCompleted}
          style={{ width: "100%" }}
          onClick={this.props.onChangeShowCompleted}>
          Выполненные
        </Button>
        <Button
          variant={btnVariantDraggeble}
          style={{ width: "100%" }}
          onClick={this.props.onChangeDraggable}>
          Передвигать
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={this.props.onRefresh}>
          <Icon icon={refresh} />
        </Button>
      </div>
    );
  }
}

export default TodoSettings;
