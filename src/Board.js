import React, { Component } from 'react'
import Note from './Note'
import FaPlus from 'react-icons/lib/fa/plus'


// Parent component that will render the Note component
// state is an array of notes that will be added to board

/*
This is how a lot of our react applications work.
- store state data in the parent component
- pass down state via props
- pass up new information with events
save method is a good example

*/

class Board extends Component {
	constructor(props) {
		super(props)
		this.state = {
			notes: []
		}
		this.add = this.add.bind(this)
		this.eachNote = this.eachNote.bind(this)
		this.update = this.update.bind(this)
		this.remove = this.remove.bind(this)
		this.nextId = this.nextId.bind(this)
	}

	componentWillMount() {
		var self = this
		if(this.props.count) {
			fetch(`https://baconipsum.com/api/?type=all-meat&sentences=${this.props.count}`)
				.then(response => response.json())
				.then(json => json[0]
								.split('. ')
								.forEach(sentence => self.add(sentence.substring(0, 15))))
		}
	}

  // takes in previous state and takes in an object
	// use spread operator to takes notes already in state and push them into a new array
	// then append a new note
	add(text) {
		this.setState(prevState => ({
			notes: [
				...prevState.notes,
				{
					id: this.nextId(),
					note: text
				}
			]
		}))
	}
  // each time we add a new note, it will increment the ID
	nextId() {
		this.uniqueId = this.uniqueId || 0
		return this.uniqueId++
	}


  // Each time we update a note, we need to send that new note text from its child (Note component)
	// In other words, using the text from inside the note form
	// pass in newText and i
	// if the note id is not equal to i, return note (if we're not updating it, leave it as is)
	// otherwise return new object, pass in all of the note 'keys' and overwrite the text
	// this gets called in eachNote function
	update(newText, i) {
		console.log('updating item at index', i, newText)
		this.setState(prevState => ({
			notes: prevState.notes.map(
				note => (note.id !== i) ? note : {...note, note: newText}
			)
		}))
	}

 // pass in id of note we'll remove
 // pass in previous note state and reset state of notes using the filter method
 // returns a new array that will remove the item - where we are removing by that id
	remove(id) {
		console.log('removing item at', id)
		this.setState(prevState => ({
			notes: prevState.notes.filter(note => note.id !== id)
		}))
	}

  // method to render a note based on each item in state
	// note.note = the display text
	eachNote(note, i) {
		return (
			<Note key={note.id}
				  index={note.id}
				  onChange={this.update}
				  onRemove={this.remove}>
				  {note.note}
		    </Note>
		)
	}

  // map over all of the notes that are in state
	// Create an Add button here, since it is being added to the state of the Board
	// Every time a new note is added, use this.add.bind (without this), to add text
	render() {
		return (
			<div className="board">
				{this.state.notes.map(this.eachNote)}
				<button onClick={this.add.bind(null, "New Note")}
						id="add">
					<FaPlus />
				</button>
			</div>
		)
	}
}

export default Board
