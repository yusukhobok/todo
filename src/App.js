import React from "react";
import axios from "axios";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ListGroup from "react-bootstrap/ListGroup";

import Todo from "./Todo";
import AddTodo from "./AddTodo";
import TodoSettings from "./TodoSettings";

const API_URL = "https://boiling-woodland-05459.herokuapp.com/api/";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      isError: false,
      errorMessage: "",
      showCompleted: true,
      todos: []
    };
  }


  componentDidMount() {
    this.refreshTodos();
  }


  sortTodos = todos => {
    todos.sort((a, b) => (a.order > b.order ? 1 : -1));
  }


  removeOldTodos = todosFromAPI => {
    const filteredTodos = this.state.todos.filter(item => {
      const id = item.id;
      const index = todosFromAPI.findIndex(item => item.id === id);
      return index !== -1;
    })
    this.setState(prevState => {
      return {
        ...prevState,
        todos: filteredTodos
      }
    })
  }


  addNewTodos = todosFromAPI => {
    const filteredTodosFromAPI = todosFromAPI.filter(item => {
      const id = item.id;
      const index = this.state.todos.findIndex(item => item.id === id);
      return index === -1;
    })
    this.setState(prevState => {
      return {
        ...prevState,
        todos: prevState.todos.concat(filteredTodosFromAPI)
      }
    })
  }


  getTodosFromAPI = async () => {
    try {
      const responce = await axios.get(API_URL);
      const todosFromAPI = responce.data.slice();
      return todosFromAPI;
    } catch (error) {
      throw new Error("Ошибка доступа к данным");
    }
  }


  updateTodosToAPI = async () => {
    if (this.state.todos.length === 0)
      return
    try {
      await axios.put(API_URL, this.state.todos);
    } catch (error) {
      throw new Error("Ошибка обновления данных");
    }
  }


  refreshTodos = async () => {
    this.setState(prevState => {
      return {
        ...prevState,
        loading: true
      }
    })

    try {
      const todosFromAPI = await this.getTodosFromAPI();
      this.removeOldTodos(todosFromAPI);
      try {
        await this.updateTodosToAPI();
        this.addNewTodos(todosFromAPI);
        this.setState(prevState => {
          return {
            ...prevState,
            loading: false,
            isError: false,
            errorMessage: "",
          }
        });
      } catch (error) {
        console.log(error.message);
        this.setState(prevState => {
          return {
            ...prevState,
            loading: false,
            isError: false,
            errorMessage: "",
            todos: todosFromAPI,
          }
        });
      }
    } catch (error) {
        this.setState(prevState => {
          return {
            ...prevState,
            loading: false,
            isError: true,
            errorMessage: error.message,
            todos: [],
          }
        });
      }
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
            if (item.id === newTodo.id) return newTodo;
            else return item;
          })
        };
      });
    };

    onDelete = async (todo) => {
      this.setState((prevState) => {
        return {...prevState, loading: true}
      })
      try {
        await axios.delete(API_URL + todo.id);
        this.setState(prevState => {
          return {
            ...prevState,
            loading: false,
            todos: prevState.todos.filter(item => item.id !== todo.id)
          };
        });
      }
      catch (error) {
        console.log(error.message);
      }
    };

    onChangeShowCompleted = () => {
      this.setState(prevState => {
        return {
          ...prevState,
          showCompleted: !prevState.showCompleted
        };
      });
    };

    onAddTodo = async (newTitle) => {
      const newTodo = {
        title: newTitle,
        isCompleted: false
      };

      this.setState((prevState) => {
        return {...prevState, loading: true}
      })

      try {
        const res = await axios.post(API_URL, newTodo);
        const newTodoFromAPI = res.data;
        console.log(newTodoFromAPI)

        let newTodos = this.state.todos.slice();
        newTodos.push(newTodoFromAPI);
        this.setState(prevState => {
          return {
            ...prevState,
            todos: newTodos,
            loading: false
          };
        });
      } catch (error) {
        console.log(error.message);
      }
    };

    render() {
      let todoList;
      if (this.state.isError) {
        todoList = <p>{this.state.errorMessage}</p>;
      }
      else if (this.state.loading) {
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
                onRefresh={this.refreshTodos}
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
