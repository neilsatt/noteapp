import React, { Component } from 'react'
// custom icons
import FaPencil from 'react-icons/lib/fa/pencil'
import FaTrash from 'react-icons/lib/fa/trash'
import FaFloppyO from 'react-icons/lib/fa/floppy-o'

class Note extends Component {
	constructor(props) {
		super(props)
		// default editing state
		this.state = {
			editing: false
		}
		// bind attaches the methods to the class prototype
		this.edit = this.edit.bind(this)
		this.remove = this.remove.bind(this)
		this.save = this.save.bind(this)
		this.renderForm = this.renderForm.bind(this)
		this.renderDisplay = this.renderDisplay.bind(this)
		this.randomBetween = this.randomBetween.bind(this)
	}

	componentWillMount() {
		this.style = {
			left: this.randomBetween(200, 800, 'px'),
			top: this.randomBetween(100, 600, 'px'),
			transform: `rotate(${this.randomBetween(-25, 25, 'deg')})`
		}
	}

  // Place notes randomly on the screen
	// takes in x and y values, and s is for a unit of measure
	randomBetween(x, y, s) {
		return x + Math.ceil(Math.random() * (y-x)) + s
	}

  // highlight text when updating, use our ref for textArea
	componentDidUpdate() {
		var textArea
		if(this.state.editing) {
			textArea = this._newText
			textArea.focus()
			textArea.select()
		}

	}

  // this will check to be sure that something HAS been changed
	// then re-render
	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.children !== nextProps.children || this.state !== nextState
		)
	}


	// Button events
	// when clicked, editing becomes true
	edit() {
		this.setState({
			editing: true
		})
	}

 // works in concert with remove in the parent (Board.js)
	remove() {
		this.props.onRemove(this.props.index)
	}

	// Used in renderForm
	// onChange refers to update (from eachNote method in Board.js)
	// use ref from renderForm below
	// reset editing state
	save(e) {
		e.preventDefault()
		this.props.onChange(this._newText.value, this.props.index)
		this.setState({
			editing: false
		})
	}


 // The Note form and display states will show based on editing state
 // ref is used to capture what the user enters, sort of like an ID
	renderForm() {
		return (
			<div className="note" style={this.style}>
				<form onSubmit={this.save}>
					<textarea ref={input => this._newText = input}
							  defaultValue={this.props.children}/>
					<button id="save"><FaFloppyO /></button>
				</form>
			</div>
		)
	}
  // this.props.children will display whatever the value of note.note is
	renderDisplay() {
		return (
			<div className="note" style={this.style}>
				<p>{this.props.children}</p>
				<span>
					<button onClick={this.edit} id="edit"><FaPencil /></button>
					<button onClick={this.remove} id="remove"><FaTrash /></button>
				</span>
			</div>
		)
	}
	render() {
		return this.state.editing ? this.renderForm() : this.renderDisplay()
	}

}

export default Note
