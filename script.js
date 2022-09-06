const AddBookDialog = (() => {
  const object = {};
  const dialog = document.querySelector('.dialog');
  const title = dialog.querySelector('.title');

  const inputs = {
    title: document.querySelector('#book-title'),
    author: document.querySelector('#book-author'),
    pages: document.querySelector('#book-pages'),
    read: document.querySelector('#book-read'),
  };

  const buttons = {
    submit: dialog.querySelector('button.submit'),
    close: dialog.querySelector('button.close'),
  };

  buttons.close.addEventListener('click', () => {
    clear();
    hide();
  });

  buttons.submit.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof object.onsubmit === 'function') object.onsubmit(submit());

    clear();
    hide();
  });

  function show(titleText, buttonText, onsubmit) {
    object.onsubmit = onsubmit;
    title.textContent = titleText;
    buttons.submit.textContent = buttonText;
    dialog.style.visibility = 'visible';
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
    return {
      title: inputs.title.value,
      author: inputs.author.value,
      pages: inputs.pages.value || 0,
      read: inputs.read.checked,
    };
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
        readButton.textContent = 'unread';
        readButton.classList.remove('read');
        return;
      }

      readButton.textContent = 'read';
      readButton.classList.add('read');
    });

    card.innerHTML = `
      <div class="content">
        <h2 class="title">${book.title}</h2>
        <p class="author">${book.author} (${book.pages} pages)</p>
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
      console.log('edit');
    });

    card.querySelector('button.remove').addEventListener('click', () => {
      LibraryRenderer.remove(card);
    });

    card.insertBefore(readButton, card.firstChild);
    return card;
  }

  return {
    add,
    remove,
  };
})();

document.querySelector('header button.add').addEventListener('click', () => {
  AddBookDialog.show('Edit Book Details', 'Add Book', (book) => {
    LibraryRenderer.add(book);
  });
});
