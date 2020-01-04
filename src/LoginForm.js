import React from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: ""
        };
    }

    handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    }

    handlseSubmit = (event) => {
        event.preventDefault();
        this.props.loginSubmit(this.state.login, this.state.password);
    }

    render() {
        return (
            <>
                <Form onSubmit={this.handlseSubmit}>
                    <Form.Group controlId="formBasicEmail" >
                        <Form.Label>Логин</Form.Label>
                        <Form.Control
                            name="login"
                            type="text"
                            placeholder="Введите логин"
                            onChange={this.handleInputChange} 
                            value={this.state.login}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            name="password"
                            type="password"
                            placeholder="Введите пароль"
                            onChange={this.handleInputChange} 
                            value={this.state.password}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Вход
                </Button>
                </Form>
                {this.props.wrongLoginOrPassword &&
                    <Alert variant="danger">
                        Неверный логин или пароль
                    </Alert>
                }
            </>
        )
    }
}

export default LoginForm;


