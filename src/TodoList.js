import React, { Component } from "react";
import TodoItems from "./TodoItems";
import "./TodoList.css";

class TodoList extends Component {
    static baseUrl = 'https://tyrone-todo-list.herokuapp.com/api/v1';
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };

        this.getTasks = this.getTasks.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.updateTask = this.updateTask.bind(this);
    }

    componentDidMount() {
        fetch(TodoList.baseUrl+'/tasks').then((response) => {
          return response.json();  
        }).then((responseData) => {
            const sortedItems = responseData.data.sort((a, b) => a.status-b.status);
            this.setState({ items: sortedItems});
        }).catch(console.error);
    }

    getTasks(endpoint) {
        fetch(TodoList.baseUrl+'/tasks'+endpoint).then((response) => {
            return response.json();
        }).then((responseData) => {
            const sortedItems = responseData.data.sort((a, b) => a.status-b.status);
            this.setState({ items: sortedItems});
        })
    }

    addItem(e) {
        if (this._inputElement.value.trim() !== "") {
            var newItem = {
                title: this._inputElement.value
            };
            fetch(TodoList.baseUrl+'/tasks', {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify(newItem)
            }).then((response) => {
                return response.json();
            }).then((response) => {
                newItem.id = response.data.id;
                newItem.key = response.data.id;
                newItem.status = response.data.status;
                newItem.is_active = response.data.is_active;
                
                const items = this.state.items;
                const newItems = items.concat(newItem);
                const newSortedItems = newItems.sort((a, b) => a.status-b.status);
                this.setState((prevState) => {
                    return {
                        items: newSortedItems
                    };
                });
            });
        }

        this._inputElement.value = "";

        e.preventDefault();
    }

    deleteItem(key) {
        fetch(TodoList.baseUrl+'/task/'+key, {
            method: 'DELETE'
        }).then((response) =>{
            var filteredItems = this.state.items.filter(function (item) {
                return (item.id !== key);
            });
            this.setState({
                items: filteredItems
            });
        });
    }

    updateTask(key, params) {
        fetch(TodoList.baseUrl+'/task/'+key, {
            headers: {'Content-Type': 'application/json'},
            method: 'PATCH',
            body: JSON.stringify(params)
        }).then((response) => {
            return response.json();
        }).then((res) => {
            const response = res.updated_data;
            const items = this.state.items;
            items.map(item => { 
                if (item.id === response.id) {
                    item.status = response.status;
                    item.is_active = response.is_active;
                }
                return item;
            });
            let sortedItems = items.sort((a, b) => a.status-b.status);
            if (params.is_active) {
                sortedItems = sortedItems.filter(item => item.id !== key);
            }
            this.setState({
                items: sortedItems
            });
        });
    }

    render() {
        return (
            <div className="todoListMain">
              <div className="header">
                <div className="header-buttons">
                    <button onClick={() => this.getTasks('')}>Active</button>
                    <button onClick={() => this.getTasks('/pending')}>Pending</button>
                    <button onClick={() => this.getTasks('/done')}>Finished</button>
                    <button onClick={() => this.getTasks('/archived')}>Archived</button>
                </div>
                <form onSubmit={this.addItem}>
                  <input ref={(a) => this._inputElement = a}
                         placeholder="enter task">
                  </input>
                  <button type="submit">add</button>
                </form>
              </div>
              <TodoItems entries={this.state.items}
                         delete={this.deleteItem}
                         update={this.updateTask}
                         />
            </div>
        )
    }
}

export default TodoList;
 