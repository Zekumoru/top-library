
let myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

const BookDialog = (() => {
  const object = {};
  const dialog = document.querySelector('.dialog');
  const title = dialog.querySelector('.title');
  let aggressive = false;

  const inputs = {
    title: dialog.querySelector('#book-title'),
    author: dialog.querySelector('#book-author'),
    pages: dialog.querySelector('#book-pages'),
    read: dialog.querySelector('#book-read'),
  };

  const requiredParagraphs = {
    title: dialog.querySelector('#book-title + .required'),
    author: dialog.querySelector('#book-author + .required'),
    pages: dialog.querySelector('#book-pages + .required'),
  };

  const buttons = {
    submit: dialog.querySelector('button.submit'),
    close: dialog.querySelector('button.close'),
  };

  inputs.title.addEventListener('keyup', () => requireField('title', isFieldEmpty));
  inputs.author.addEventListener('keyup', () => requireField('author', isFieldEmpty));
  inputs.pages.addEventListener('keyup', () => requireField('pages', isFieldNegative));

  buttons.close.addEventListener('click', () => {
    clear();
    hide();
  });

  buttons.submit.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (!inputs.title.value || !inputs.author.value || Number(inputs.pages.value) < 0) {
      aggressive = true;
      requireField('title', isFieldEmpty);
      requireField('author', isFieldEmpty);
      requireField('pages', isFieldNegative);
      return;
    }
    aggressive = false;

    if (typeof object.onsubmit === 'function') object.onsubmit(submit());

    clear();
    hide();
  });

  function requireField(field, condition) {
    const input = inputs[field];
    const requiredParagraph = requiredParagraphs[field];

    if (!condition(input)) {
      input.classList.remove('required');
      requiredParagraph.style.display = 'none';
      return;
    }

    if (aggressive) {
      input.classList.add('required');
      requiredParagraph.style.display = 'block';
    }
  }

  function isFieldEmpty(field) {
    return !field.value;
  }

  function isFieldNegative(field) {
    return Number(field.value) < 0;
  }

  function show(uiTexts, book, onsubmit) {
    title.textContent = uiTexts.title;
    buttons.submit.textContent = uiTexts.submit;

    dialog.style.visibility = 'visible';
    object.onsubmit = onsubmit;
    if (book) fill(book);
  }

  function fill(book) {
    inputs.title.value = book.title;
    inputs.author.value = book.author;
    inputs.pages.value = book.pages;
    inputs.read.checked = book.read;
  }

  function hide() {
    dialog.style.visibility = 'hidden';
  }

  function clear() {
    inputs.title.value = '';
    inputs.author.value = '';
    inputs.pages.value = '';
    inputs.read.checked = false;
  }

  function submit() {
    return new Book(inputs.title.value, inputs.author.value, inputs.pages.value || 0, inputs.read.checked);
  }

  return Object.assign(object, {
    show,
    hide,
    clear,
  });
})();

const LibraryRenderer = (() => {
  const display = document.querySelector('.main');
  const info = document.querySelector('.main .info');

  const list = document.createElement('ul');
  list.classList.add('cards');

  const onchange = () => {
    if (list.childElementCount) {
      info.style.display = 'none';
      display.classList.remove('flex-center-vertical');
      display.appendChild(list);
      return;
    }
    
    display.removeChild(list);
    info.style.display = 'block';
    display.classList.add('flex-center-vertical');
  };

  function add(book) {
    list.appendChild(createCard(book));
    onchange();
  }

  function update(card, book) {
    card.querySelector('.title').textContent = book.title;
    card.querySelector('.author').textContent = book.author;
    card.querySelector('.pages').textContent = book.pages;

    const readButton = card.querySelector('button:first-child');
    if (book.read) {
      readButton.textContent = 'read';
      readButton.classList.add('read');
      readButton.classList.remove('unread');
    }
    else {
      readButton.textContent = 'unread';
      readButton.classList.add('unread');
      readButton.classList.remove('read');
    }
  }

  function remove(card) {
    list.removeChild(card);
    onchange();
  }

  function createCard(book) {
    const card = document.createElement('li');
    card.classList.add('card');

    const readButton = document.createElement('button');
    readButton.textContent = book.read? 'read' : 'unread';
    if (book.read) readButton.classList.add('read');

    readButton.addEventListener('click', () => {
      if (readButton.textContent === 'read') {
        book.read = false;
        readButton.textContent = 'unread';
        readButton.classList.remove('read');
        return;
      }

      book.read = true;
      readButton.textContent = 'read';
      readButton.classList.add('read');
    });

    card.innerHTML = `
      <div class="content">
        <h2 class="title">${book.title}</h2>
        <p class="description"><span class="author">${book.author}</span> (<span class="pages">${book.pages}</span> pages)</p>
      </div>
      <div class="buttons">
        <button class="edit">
          <div class="icon edit"></div>
        </button>
        <button class="remove">
          <div class="icon delete"></div>
        </button>
      </div>`
    ;

    card.querySelector('button.edit').addEventListener('click', () => {
      BookDialog.show({
        title: 'Edit Book Details',
        submit: 'Edit Book',
      },
      book,
      (editedBook) => {
        book.title = editedBook.title;
        book.author = editedBook.author;
        book.pages = editedBook.pages;
        book.read = editedBook.read;
        update(card, editedBook);
      }
      )
    });

    card.querySelector('button.remove').addEventListener('click', () => {
      LibraryRenderer.remove(card);
    });

    card.insertBefore(readButton, card.firstChild);
    return card;
  }

  return {
    add,
    update,
    remove,
  };
})();

document.querySelector('header button.add').addEventListener('click', () => {
  BookDialog.show({
    title: 'Enter Book Details',
    submit: 'Add Book',
  },
  null,
  (book) => {
    addBookToLibrary(book);
    LibraryRenderer.add(book);
  });
});
