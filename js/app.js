const request = new Request();
const ui = new UI();

// EVENT LISTENERS =================================

// Content Load
document.addEventListener('DOMContentLoaded',getNotes);

// Create a new note
document.querySelector('#create-note').addEventListener('click',createNote);

// Read a note - open reading pane
document.querySelector('#notes-list').addEventListener('click',readNote);

// Close reading pane
document.querySelector('#note-display').addEventListener('click',closeNote);

// Edit note
document.querySelector('#notes-list').addEventListener('click',editState);

// Submit edits
document.querySelector('#edit').addEventListener('click',submitEdits);

// Close Edit pane
document.querySelector('#edit').addEventListener('click',closeEdit);

// Delete note
document.querySelector('#notes-list').addEventListener('click',deleteNote);

// Search Notes
document.querySelector('#search').addEventListener('keyup',searchNotes);

// LISTENER FUNCTIONS ==============================

// get posts from server
function getNotes(){
  request.get('http://localhost:3000/notes')
    .then(data => ui.showNotes(data))
    .catch(err => console.log(err));
}
// create a new post
function createNote(e) {
  e.preventDefault();
  // note title and body
  let title = ui.createTitle.value;
  let body = ui.createBody.value;
  // note formatted date
  let currentDate = new Date();
  let date = ui.formatDate(currentDate);
  // format data for Post
  const postData = {
    title,
    body,
    date
  };

  // do a post request to db.json, pass data from above
  request.post('http://localhost:3000/notes', postData)
    .then(res => {
      console.log(res)
    })
    .catch(err => console.log(err));
}

// read a note in the reading panel
function readNote(e) {
  // first IF - when user clicks in the general list-item which has a class of 'note'
  if(e.target.classList.contains('note')){
    // get data id from target
    const id = e.target.getAttribute('data-id');
    // request note data using the id
    request.get(`http://localhost:3000/notes/${id}`)
      .then(note => {
        ui.displayNoteText(note);
      })
      .catch(err => console.log(err));
    // highlight the clicked note using class "active"
    ui.makeActive(e.target,'read');
    
  }
  // second IF - when the user clicks on the note title or date. The title stretches across the page.
  else if(e.target.classList.contains('note-title')|| e.target.classList.contains('note-date')){
    // get data id from target's parent
    const id = e.target.parentElement.getAttribute('data-id');
    // request note data using the id
    request.get(`http://localhost:3000/notes/${id}`)
      .then(note => {
        ui.displayNoteText(note);
      })
      .catch(err => console.log(err));
    // highlight the clicked note using class "active"
    ui.makeActive(e.target.parentElement,'read');
    
  }
}
// close the reading pane
function closeNote(e) {
  if (e.target.classList.contains('close-note')){
    ui.closeCard(ui.noteDisplay);
  }
}
// enable the edit state
function editState(e){
  e.preventDefault()
  if (e.target.classList.contains('edit')){
    // get data id number
    const id = e.target.getAttribute('data-id');
    // get request to retrieve note data
    request.get(`http://localhost:3000/notes/${id}`)
      .then( note => {
        ui.showEditState(note)
      })
      .catch(err => console.log(err))
    
    ui.makeActive(e.target.parentElement.parentElement,'edit');
  }

}
// close the edit state
function closeEdit(e) {
  if(e.target.classList.contains('close-edit')){
    ui.closeCard(ui.editNote);
  }
}
// submit edits
function submitEdits(e) {
  e.preventDefault()
  if (e.target.classList.contains('saveEdits')){
    // construct note data from edit form
    const title = document.querySelector('.title-edit').value;
    const body = document.querySelector('.body-edit').value;
    const id = parseInt(document.querySelector('.saveEdits').getAttribute('data-id'));
    const date = ui.formatDate(new Date());
    // format data for put request
    const postData = {
      title,
      body, 
      date
    }

    // put request
    request.put(`http://localhost:3000/notes/${id}`,postData)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
}
// delete a note
function deleteNote(e) {
  e.preventDefault()
  if (e.target.classList.contains('delete')){
    // get data id number
    const id = e.target.getAttribute('data-id');
    // delete request
    request.delete(`http://localhost:3000/notes/${id}`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
}
// search all notes
function searchNotes(e) {
  // get search phrase
  let filter = e.target.value.toLowerCase();

  // loop through the list notes to search titles for search phrase
  let notes = Array.from(ui.notesList.children);
  notes.forEach(note => {
    // get title of note
    let title = note.firstElementChild.textContent.toLowerCase();
    // search title to match filter phrase
    if(filter !==''){
      if (title.indexOf(filter) === -1){
        // if it doesn't match filter, hide it
        note.style.display = 'none';
      }
    }
    else {
      note.style.display = 'block';
    }
    
  })
}