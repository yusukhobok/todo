import React from "react";
import axios from "axios";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ListGroup from "react-bootstrap/ListGroup";

import AddTodo from "./AddTodo";
import TodoSettings from "./TodoSettings";
import TodoMessage from "./TodoMessage";
import TodoList from "./TodoList";
import LoginForm from "./LoginForm";

const API_URL = "https://boiling-woodland-05459.herokuapp.com/api/";
const API_URL_CATEGORIES = "https://boiling-woodland-05459.herokuapp.com/categories/";
const API_URL_AUTH = "https://boiling-woodland-05459.herokuapp.com/auth/token/";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      token: localStorage.getItem("token"),
      wrongLoginOrPassword: false,
      loading: true,
      isError: false,
      errorMessage: "",
      showCompleted: false,
      draggable: false,
      currentCategory: 1,
      categories: [],
      todos: []
    };
  }


  componentDidMount() {
    if (this.state.token !== null) {
      this.refreshTodos(true);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.token !== this.state.token) {
      if (this.state.token !== null) {
        this.refreshTodos(true);
      }
      else {
        this.setState(prevState => {
          return {
            ...prevState,
            categories: [],
            todos: []
          }
        });
      }
    }
  }


  setToken = (token) => {
    if (token === null)
      localStorage.removeItem("token");
    else
      localStorage.setItem("token", token);
    this.setState(prevState => {
      return {
        ...prevState,
        token: token,
        wrongLoginOrPassword: false
      }
    });
  }


  getTokenInfo = () => {
    return { headers: { Authorization: 'Token ' + this.state.token } }
  }


  login = async (username, password) => {
    try {
      const data = { username, password };
      const res = await axios.post(API_URL_AUTH + "login/", data);
      const token = res.data["auth_token"];
      this.setToken(token)

      this.refreshTodos(true);

    } catch (error) {
      this.setState(prevState => {
        return {
          ...prevState,
          wrongLoginOrPassword: true
        }
      })
    }
  }

  logout = async () => {
    try {
      await axios.post(API_URL_AUTH + "logout/", null, this.getTokenInfo());
      this.setToken(null);

    } catch (error) {
      console.log(error.message);
    }
  }


  //Удаление тех дел, которых уже нет на сервере
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


  //Добавление тех дел, которые появились на сервере
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


  //чтение списка дел с сервера
  getTodosFromAPI = async () => {
    try {
      const responce = await axios.get(API_URL, this.getTokenInfo());
      let todosFromAPI = responce.data.slice();
      // todosFromAPI = todosFromAPI.map((item) => {
      //   return {
      //     ...item,
      //     order: item.id
      //   }
      // })
      return todosFromAPI;
    } catch (error) {
      throw new Error("Ошибка доступа к данным");
    }
  }


  //чтение списка категорий с сервера
  getCategoriesFromAPI = async () => {
    try {
      const responce = await axios.get(API_URL_CATEGORIES, this.getTokenInfo());
      const categoriesFromAPI = responce.data.slice();
      this.setState(prevState => {
        return {
          ...prevState,
          "categories": categoriesFromAPI
        }
      })
    } catch (error) {
      throw new Error("Ошибка доступа к данным категорий");
    }
  }


  //обновление списка дел (на сервере)
  updateTodosToAPI = async () => {
    if (this.state.todos.length === 0)
      return
    try {
      await axios.put(API_URL, this.state.todos, this.getTokenInfo());
    } catch (error) {
      throw new Error("Ошибка обновления данных");
    }
  }


  refreshTodos = async (isGetCategoriesFromAPI = false) => {
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

      if (isGetCategoriesFromAPI)
        this.getCategoriesFromAPI();
    } catch (error) {
      console.log(error.message);
      this.setToken(null);
      // this.setState(prevState => {
      //   return {
      //     ...prevState,
      //     loading: false,
      //     isError: true,
      //     errorMessage: error.message,
      //     todos: [],
      //   }
      // });
    }
  };


  onChangeTodoCompleted = todo => {
    const newTodo = {
      id: todo.id,
      title: todo.title,
      isCompleted: !todo.isCompleted,
      order: todo.order,
      category: todo.category
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


  //удаление дела
  onDelete = async (todo) => {
    this.setState((prevState) => {
      return { ...prevState, loading: true }
    })
    try {
      await axios.delete(API_URL + todo.id + "/", this.getTokenInfo());
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


  onChangeDraggable = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        draggable: !prevState.draggable
      }
    })
  }


  onChangeCurrentCategory = (newCurrentCategory) => {
    this.setState(prevState => {
      return {
        ...prevState,
        currentCategory: newCurrentCategory
      }
    });
  }


  //добаление нового дела
  onAddTodo = async (newTitle) => {
    const orders = this.state.todos.map(item => item.order)
    const maxOrder = Math.max(...orders);

    const newTodo = {
      title: newTitle,
      isCompleted: false,
      order: maxOrder + 1,
      category: this.state.currentCategory
    };

    this.setState((prevState) => {
      return { ...prevState, loading: true }
    })

    try {
      const res = await axios.post(API_URL, newTodo, this.getTokenInfo());
      const newTodoFromAPI = res.data;

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


  changeTodos = (newVisibleTodos) => {
    this.setState(prevState => {
      return {
        ...prevState,
        todos: prevState.todos.map(item => {
          const newTodo = newVisibleTodos.find(item2 => item2.id === item.id)
          if (newTodo === undefined)
            return item
          else
            return { ...item, order: newTodo.order };

        })
      };
    })
  }


  render() {
    if (this.state.token === null) {
      return <LoginForm loginSubmit={this.login} wrongLoginOrPassword={this.state.wrongLoginOrPassword} />
    }
    else {
      let todoList;
      if (this.state.isError) {
        todoList = <TodoMessage msg={this.state.errorMessage} variant="danger" />
      }
      else if (this.state.loading) {
        todoList = <TodoMessage msg="Загрузка..." variant="info" />
      } else {
        todoList = (
          <>
            <ListGroup.Item>
              <TodoSettings
                showCompleted={this.state.showCompleted}
                draggable={this.state.draggable}
                onChangeShowCompleted={this.onChangeShowCompleted}
                onChangeDraggable={this.onChangeDraggable}
                onRefresh={this.refreshTodos}
                categories={this.state.categories}
                currentCategory={this.state.currentCategory}
                onChangeCurrentCategory={this.onChangeCurrentCategory}
                logout={this.logout}
              />
            </ListGroup.Item>

            <TodoList
              todos={this.state.todos}
              currentCategory={this.state.currentCategory}
              showCompleted={this.state.showCompleted}
              draggable={this.state.draggable}
              onChangeTodoCompleted={this.onChangeTodoCompleted}
              onDelete={this.onDelete}
              onSortEnd={this.changeTodos} />

            <ListGroup.Item>
              <AddTodo onAddTodo={this.onAddTodo} />
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
}

export default App;
