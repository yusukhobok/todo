import React from "react";

import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import Todo from "./Todo";



class TodoList extends React.Component {

    constructor() {
        super();
        this.sortedTodos = null;
        this.visibleTodos = null;
    }

    sortTodos = todos => {
        let sortedTodos = todos.slice();
        sortedTodos.sort((a, b) => (a.order > b.order ? 1 : -1));
        return sortedTodos;
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        let newVisibleTodos = this.visibleTodos.slice();

        let tempTodo = newVisibleTodos[oldIndex];
        newVisibleTodos[oldIndex] = newVisibleTodos[newIndex];
        newVisibleTodos[newIndex] = tempTodo;

        let orders = newVisibleTodos.map(item => item.order);
        orders.sort((a,b) => a>b ? 1 : -1)

        for (let i=0; i<newVisibleTodos.length; i++) {
            newVisibleTodos[i].order = orders[i];
        }

        this.props.onSortEnd(newVisibleTodos);
    }

    render() {
        this.sortedTodos = this.sortTodos(this.props.todos);
        this.visibleTodos = this.sortedTodos.filter(item => {
            return (this.props.showCompleted || !item.isCompleted)
        })

        const SortableItem = SortableElement(({ value }) =>
            <>
            <Todo
                key={value.id}
                todo={value}
                showCompleted={this.props.showCompleted}
                onChangeTodoCompleted={this.props.onChangeTodoCompleted}
                onDelete={this.props.onDelete}
            />
            </>

        );

        const SortableList = SortableContainer(({ items }) => {
            return (
                <div>
                    {items.map((value, index) => (
                        <SortableItem key={value.id} index={index} value={value} />
                    ))}
                </div>
            )
        });



        return (
            <SortableList items={this.visibleTodos} onSortEnd={this.onSortEnd} />
        )
    }
}


export default TodoList;