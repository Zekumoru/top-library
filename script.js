const AddBookDialog = (() => {
  const dialog = document.querySelector('.dialog');

  dialog.querySelector('button.close').addEventListener('click', hide);

  function show() {
    dialog.style.visibility = 'visible';
  };

  function hide() {
    dialog.style.visibility = 'hidden';
  };

  return {
    show,
    hide,
  };
})();

document.querySelector('header button.add').addEventListener('click', () => {
  AddBookDialog.show();
});
