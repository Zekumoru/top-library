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
    onsubmit,
  });
})();

document.querySelector('header button.add').addEventListener('click', () => {
  AddBookDialog.show();
});

AddBookDialog.onsubmit = (book) => {
  console.log(book.name, book.author, book.pages, book.read);
};