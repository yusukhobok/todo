import React from "react";
import axios from "axios";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ListGroup from "react-bootstrap/ListGroup";

import Todo from "./Todo";
import AddTodo from "./AddTodo";
import TodoSettings from "./TodoSettings";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showCompleted: true,
      refreshInterval: 2000,
      todos: []
    };
  }

  componentDidMount() {
    this.onReadTodos();
    setInterval(this.onReadTodos, this.state.refreshInterval)
  }

  onReadTodos = () => {
    axios.get("https://boiling-woodland-05459.herokuapp.com/api/").then(res => {
      let todos = res.data.slice();
      let sortById = todos => {
        todos.sort((a, b) => (a.id > b.id ? 1 : -1));
      };
      sortById(todos);

      this.setState(prevState => {
        return {
          ...prevState,
          todos: todos
        };
      });
    });
  };

  onChangeTodoCompleted = todo => {
    const newTodo = {
      id: todo.id,
      title: todo.title,
      isCompleted: !todo.isCompleted
    };
    this.setState(prevState => {
      return {
        ...prevState,
        todos: prevState.todos.map(item => {
          if (item.id === newTodo.id)
            return newTodo
          else
            return item
        })
      }
    })
    axios
      .put(
        `https://boiling-woodland-05459.herokuapp.com/api/${newTodo.id}`,
        newTodo
      )
  };

  onDelete = todo => {
    this.setState(prevState => {
      return {
        ...prevState,
        todos: prevState.todos.filter(item => item.id !== todo.id)
      }
    })    
    axios.delete(`https://boiling-woodland-05459.herokuapp.com/api/${todo.id}`)
  }

  onChangeShowCompleted = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        showCompleted: !prevState.showCompleted
      };
    });
  };

  onAddTodo = newTitle => {
    const newTodo = {
      title: newTitle,
      isCompleted: false
    };
    let newTodos = this.state.todos.slice()
    newTodos.push(newTodo)
    this.setState(prevState => {
      return {
        ...prevState,
        todos: newTodos
      }
    })  
    axios.post("https://boiling-woodland-05459.herokuapp.com/api/", newTodo)
  };

  render() {
    let todoList;
    if (this.state.todos.length === 0) {
      todoList = <p>Загрузка...</p>;
    } else {
      todoList = (
        <>
          {this.state.todos.map(item => {
            if (!this.state.showCompleted && item.isCompleted) return;
            else
              return (
                <Todo
                  key={item.id}
                  todo={item}
                  showCompleted={this.state.showCompleted}
                  onChangeTodoCompleted={this.onChangeTodoCompleted}
                  onDelete={this.onDelete}
                />
              );
          })}

          <ListGroup.Item>
            <AddTodo onAddTodo={this.onAddTodo} />
          </ListGroup.Item>

          <ListGroup.Item>
            <TodoSettings
              showCompleted={this.state.showCompleted}
              onChangeShowCompleted={this.onChangeShowCompleted}
              onRefresh={this.onReadTodos}
            />
          </ListGroup.Item>
        </>
      );
    }

    return (
      <div className="App">
        <header className="App-header">{todoList}</header>
      </div>
    );
  }
}

export default App;
