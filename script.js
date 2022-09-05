const AddBookDialog = (() => {
  const object = {};
  const dialog = document.querySelector('.dialog');
  const inputs = {
    name: document.querySelector('#book-name'),
    author: document.querySelector('#book-author'),
    pages: document.querySelector('#book-pages'),
    read: document.querySelector('#book-read'),
  };

  dialog.querySelector('button.close').addEventListener('click', () => {
    clear();
    hide();
  });

  dialog.querySelector('button.add').addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof object.onsubmit === 'function') object.onsubmit(submit());
  });

  function show() {
    dialog.style.visibility = 'visible';
  }

  function hide() {
    dialog.style.visibility = 'hidden';
  }

  function clear() {
    inputs.name.value = '';
    inputs.author.value = '';
    inputs.pages.value = '';
    inputs.read.checked = false;
  }

  function submit() {
    return {
      name: inputs.name.value,
      author: inputs.author.value,
      pages: inputs.pages.value || 0,
      read: inputs.read.checked,
    };
  }

  return Object.assign(object, {
    show,
    hide,
    clear,
    onsubmit,
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

  function remove() {
    list.removeChild(list.firstChild);
    onchange();
  }

  function createCard(book) {
    const card = document.createElement('li');
    card.classList.add('card');
    card.innerHTML = `
      <button class="read">Unread</button>
      <div class="content">
        <h2 class="title">${book.name}</h2>
        <p class="author">${book.author} (${book.pages} pages)</p>
      </div>
      <div class="buttons">
        <button>
          <div class="icon edit"></div>
        </button>
        <button>
          <div class="icon delete"></div>
        </button>
      </div>`;
    return card;
  }

  return {
    add,
    remove,
  };
})();

document.querySelector('header button.add').addEventListener('click', () => {
  AddBookDialog.show();
});

AddBookDialog.onsubmit = (book) => {
  LibraryRenderer.add(book);
  AddBookDialog.clear();
  AddBookDialog.hide();
};