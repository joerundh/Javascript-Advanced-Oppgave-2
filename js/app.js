const addButton = document.getElementById("add-book-button");
const addBookForm = document.getElementById("add-book-form");
const titleInput = document.getElementById("title-input");
const authorInput = document.getElementById("author-input");
const yearInput = document.getElementById("year-input");
const daysSelect = document.getElementById("days-select");
const notAddBook = document.getElementById("not-add-book")

/*
Event listeners
*/
addButton.addEventListener("click", event => {
    /*
    When clicking the "+ Add book"-button, open the form 
    (add-book, index 1) after resetting the inputs
    */
    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    daysSelect.value = -1;
    goToSection(1);
});

notAddBook.addEventListener("click", event => {
    goToSection(0);
    openList(listSettings.viewing);
});

addBookForm.addEventListener("submit", event => {
    /*
    When clicking the "Add to my reading plan"-button
    (submit), and if the title and author inputs are
    filled out, create a book object, save it, and 
    go to "Planned reads".
    */
    event.preventDefault();
    const newBook = createBookObject(
        titleInput.value,
        authorInput.value,
        yearInput.value,
        parseInt(daysSelect.value)
    );
    console.log(typeof daysSelect.value)
    saveBookObject(newBook);
    goToSection(0);
    openList(0);
});

/*
Upon loading, open the last viewed list
*/

goToSection(0);
openList(listSettings.viewing);