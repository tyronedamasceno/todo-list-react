import React, { Component } from "react";
import FlipMove from "react-flip-move";

class TodoItems extends Component {
	constructor(props) {
		super(props);

		this.createTasks = this.createTasks.bind(this);
	}

	createTasks(item) {
		var status_mapping = {
			0: 'Waiting',
			1: 'In progress',
			2: 'Done'
		};
		return <li key={item.id} className={`status-${item.status}`}>
			<div className="card-texts">
				<span className="status-name ">{status_mapping[item.status]}</span>
				<p className="task-name">{item.title}</p>
			</div>
			<div className="card-buttons">
				{(item.status === 0 && item.is_active) && (
					<button className="card-button" onClick={() => this.update(item.id, { status: 1 })}>
						Start
					</button>
				)}
				{(item.status === 1 && item.is_active) && (
					<button className="card-button" onClick={() => this.update(item.id, { status: 2 })}>
						Finish
					</button>
				)}
				{(item.is_active) && (
					<button className="card-button" onClick={() => this.delete(item.id)}>
						Archive
					</button>
				)}
				{(!item.is_active) && (
					<button className="card-button" onClick={() => this.update(item.id, { is_active: true })}>
						Unarchive
					</button>
				)}
			</div>
		</li>
	}

	delete(key) {
		this.props.delete(key);
	}

	update(key, newStatus) {
		this.props.update(key, newStatus);
	}

	render() {
		var todoEntries = this.props.entries;
		var listItems = todoEntries.map(this.createTasks);

		return (
			<ul className="theList">
				<FlipMove duration={250} easing="ease-out">
					{listItems}
				</FlipMove>
			</ul>
		);
	}
}

export default TodoItems;
