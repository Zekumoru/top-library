
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

function removeBookFromLibrary(book) {
  myLibrary.splice(myLibrary.indexOf(book), 1);
}

const ElementCreator = (() => {
  function create(tag, options = {}, children = []) {
    if (typeof options === 'string') {
      options = { className: options };
    }

    if (typeof children === 'string' || typeof children === 'number') {
      options.textContent = children;
      children = [];
    }

    return assign(document.createElement(tag), options, children);
  }

  function assign(element, options, children) {
    Object.assign(element, options);
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
        return;
      }

      element.appendChild(child);
    });
    return element;
  }

  return {
    create,
  };
})();

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
  const events = {};
  const display = document.querySelector('.main');
  const info = document.querySelector('.main .info');
  const list = ElementCreator.create('ul', 'cards');

  const Card = (() => {
    const events = {};

    function createReadButton(read) {
      return ElementCreator.create('button', {
        textContent: read? 'read' : 'unread',
        classList: read? ['read'] : [],
      });
    }

    function onReadButtonClick(book) {
      if (this.textContent === 'read') {
        book.read = false;
        this.textContent = 'unread';
        this.classList.remove('read');
        return;
      }

      book.read = true;
      this.textContent = 'read';
      this.classList.add('read');
    }

    function createContent(book) {
      return ElementCreator.create('div', 'content', [
        ElementCreator.create('h2', 'title', book.title),
        ElementCreator.create('div', 'description', [
          ElementCreator.create('div', 'author', book.author),
          ElementCreator.create('div', 'pages-container', [
            '(',
            ElementCreator.create('span', 'pages', book.pages),
            ' pages)',
          ]),
        ]),
      ]);
    }

    function createButtons() {
      return ElementCreator.create('div', 'buttons', [
        ElementCreator.create('button', 'edit', [
          ElementCreator.create('div', 'icon edit'),
        ]),
        ElementCreator.create('button', 'remove', [
          ElementCreator.create('div', 'icon delete'),
        ]),
      ]);
    }

    function create(book) {
      const readButton = createReadButton(book.read);
      const buttons = createButtons();
      const card =  ElementCreator.create('li', 'card', [
        readButton,
        createContent(book),
        buttons,
      ]);

      readButton.addEventListener('click', onReadButtonClick.bind(readButton, book));
      buttons.querySelector('button.edit').addEventListener('click', () => card.onedit(card, book));
      buttons.querySelector('button.remove').addEventListener('click', () => card.onremove(card, book));

      return card;
    }

    return {
      create,
    };
  })();

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
    const card = Card.create(book);

    card.onedit = (card, book) => {
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
        },
      );
    };

    card.onremove = (card, book) => {
      remove(card);
      events.onremove(book);
    };

    list.appendChild(card);

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

  function render(library) {
    library.forEach(add);
  }

  function remove(card) {
    list.removeChild(card);
    onchange();
  }

  return Object.assign(events, {
    add,
    update,
    render,
    remove,
  });
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

document.querySelector('header button.populate').addEventListener('click', () => {
  const sampleBooks =  [
    new Book('Clean Code', 'Robert Cecil', 464, false),
    new Book('The Elements of Computing Systems: Building a Modern Computer from First Principles', 'Noam Nisan and Shimon Schocken', 344, true),
    new Book('Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', 416, false),
    new Book('Structure and Interpretation of Computer Programs', 'Gerald Jay Sussman and Hal Abelson', 657, false),
  ];

  sampleBooks.forEach((book) => addBookToLibrary(book));
  LibraryRenderer.render(myLibrary);
});

LibraryRenderer.onremove = (book) => {
  removeBookFromLibrary(book);
};
