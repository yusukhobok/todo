import React from "react";

import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import Todo from "./Todo";



class TodoList extends React.Component {

    constructor() {
        super();
        this.TodosOfCategory = null;
        this.sortedTodos = null;
        this.visibleTodos = null;
    }

    sortTodos = todos => {
        let sortedTodos = todos.slice();
        sortedTodos.sort((a, b) => (a.order > b.order ? 1 : -1));
        return sortedTodos;
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex)
            return
        // console.log("onSortEnd");
        // console.log(this.visibleTodos);
        // console.log(oldIndex, newIndex);
        const todo = this.visibleTodos[oldIndex];

        let newVisibleTodos1 = this.visibleTodos.slice();
        newVisibleTodos1.splice(oldIndex, 1);
        // console.log(newVisibleTodos1);
        
        let newVisibleTodos2 = newVisibleTodos1.slice();
        newVisibleTodos2.splice(newIndex, 0, todo);
        // console.log(newVisibleTodos2)

        let sortedNewVisibleTodos = newVisibleTodos2.slice()
        let orders = newVisibleTodos2.map(item => item.order);
        orders.sort((a, b) => a > b ? 1 : -1)
        // console.log("orders", orders)

        for (let i = 0; i < sortedNewVisibleTodos.length; i++) {
            sortedNewVisibleTodos[i].order = orders[i];
        }
        // console.log("onsortEnd_finish", sortedNewVisibleTodos)

        this.props.onSortEnd(sortedNewVisibleTodos);
    }

    render() {
        this.TodosOfCategory = this.props.todos.filter(item => {
            return item.category == this.props.currentCategory;
        })
        this.sortedTodos = this.sortTodos(this.TodosOfCategory);
        this.visibleTodos = this.sortedTodos.filter(item => {
            return (this.props.showCompleted || !item.isCompleted)
        })

        if (this.props.draggable) {
            const SortableItem = SortableElement(({ value }) =>
                // <div style={{ display: "flex" }}>
                <div>
                    <Todo
                        key={value.id}
                        todo={value}
                        showCompleted={this.props.showCompleted}
                        onChangeTodoCompleted={this.props.onChangeTodoCompleted}
                        onDelete={this.props.onDelete}
                        width="80%"
                    />
                </div>
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
        else {
            return this.visibleTodos.map((value, index) => {
                return (
                <Todo
                key={value.id}
                todo={value}
                showCompleted={this.props.showCompleted}
                onChangeTodoCompleted={this.props.onChangeTodoCompleted}
                onDelete={this.props.onDelete}
                width="100%"
                />    
                )            
            })
        }
    }
}


export default TodoList;