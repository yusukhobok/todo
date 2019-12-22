import React from "react";

import Alert from "react-bootstrap/Alert";


class TodoMessage extends React.Component {
    render() {
        return (
            <Alert variant={this.props.variant}>
                {this.props.msg}
            </Alert>
        )
    }
}

export default TodoMessage;