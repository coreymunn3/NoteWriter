class UI {
  constructor (){
    // containers and areas
    this.notesList = document.querySelector('#notes-list');
    this.noteDisplay = document.querySelector('#note-display');
    this.editNote = document.querySelector('#edit');
    this.alertArea = document.querySelector('#alert');
    // forms and inputs
    this.createTitle = document.querySelector('#create-note-title');
    this.createBody = document.querySelector('#create-note-body');
    this.searchField = document.querySelector('#search');
    // buttons and submit features
    this.createNote = document.querySelector('#create-note');
  }
  showNotes(notes) {
    let output = '';
    notes.forEach(note => {
      output += `
        <a href="#" class="collection-item note" data-id="${note.id}">
          <h6 class="note-title truncate indigo-text">${note.title}</h6>
          <span class="note-date grey-text">${note.date}</span>
          <span class="secondary-content valign-wrapper">
            <i class="material-icons teal-text edit"  data-id="${note.id}">edit</i>
            <i class="material-icons indigo-text delete" data-id="${note.id}">delete</i>
          </span>
        </a>
      `
    })
    this.notesList.innerHTML = output;
  }
  displayNoteText(note){
    this.noteDisplay.innerHTML = `
      <div class="card" data-id="${note.id}">
          <div class="card-content">
            <div class="right"><i class="material-icons close-note btn-flat">close</i></div>
            <div id="reading-title" class="card-title"><h5>${note.title}</h5></div>
            <span id="reading-date" class="helper-text grey-text">${note.date}</span>
            <p id="reading-body">${note.body}</p>
          </div>
        </div>
      </div>
    `
  }
  makeActive(element,style){
    // first clear any existing active notes
    ui.clearActive()
    // set class of current element to include active
    element.classList.add(`active-${style}`);
  }
  clearActive(){
    // get array of all note elements
    let currentNotes = Array.from(this.notesList.children);
    // remove the class of "active" if any notes have it
    currentNotes.forEach(note => {
      if(note.classList.contains('active-read')){
        note.classList.remove('active-read');
      }
      else if (note.classList.contains('active-edit')){
        note.classList.remove('active-edit');
      }
    })
  }
  closeCard(parent){
    // remove the first element of the notes display (the card containing note info)
    parent.firstElementChild.remove();
    // reset the note list so that nothing shows as "active"
    ui.clearActive();
  }
  showEditState(note){
    // make sure reading pane is closed
    // think of a more nimble way of doing this
    try { ui.closeCard(ui.noteDisplay); }
    catch {} // doesn't matter, just continue

    // insert edit form
    this.editNote.innerHTML = `
      <div class="card-content">
        <div class="right"><i class="material-icons close-edit btn-flat">close</i></div>
        <div class="card-title"><h5 class="center-align">Edit Note</h5></div>
        <div class="section">
          <div class="input-field">
            <input class="title-edit" type="text" id="title">
          </div>
          <div class="input-field">
            <textarea name="note-body" id="note-body" cols="30" rows="30" class="materialize-textarea body-edit"></textarea>
            <small><span class="teal-text">Last modified on ${note.date}</span></small>
          </div>
          <button class="btn teal saveEdits" data-id="${note.id}">Save Edits
            <i class="material-icons right">check</i>
          </button>
        </div> 
      </div>
    `
    // insert title text
    const editTitle = document.querySelector('.title-edit');
    editTitle.value = note.title;
    // insert body text
    const editBody = document.querySelector('.body-edit');
    editBody.value = note.body;
  }
  formatDate(date){
    let dd = this.padDate(String(date.getDate()).slice(-2));
    let mm = this.padDate(String(date.getMonth() + 1).slice(-2));
    let yyyy = String(date.getFullYear());
    return `${mm}/${dd}/${yyyy}`;
  }
  padDate(dateString) {
    const dateInt = parseInt(dateString);
    if (dateInt < 10){
      return '0' + String(dateString);
    }
    else {
      return dateString;
    }
  }
}

