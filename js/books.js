/*
Book keys:

When starting up, the list is picked from the local storage. Then, while using the app,
keys may be added to it using a function addKeyToList(), which then calls another 
function saveKeyList(), which updates the item "reading-list-book-keys" in the
local storage.
*/

const bookKeys = JSON.parse(localStorage.getItem("reading-app-book-keys")) || [];

function saveKeyList() {
    /*
    Saves the current key list to the local storage
    */
    localStorage.setItem("reading-app-book-keys", JSON.stringify(bookKeys));
}

function addKeyToList(key) {
    /*
    Adds a key to the key list and stores the list
    (if the list doesn't already exist in the list).
    */
    if (bookKeys.includes(key)) {
        return false;
    }
    bookKeys.push(key);
    saveKeyList();
    return true;
}

function removeKeyFromList(key) {
    /*
    Takes the key of a book object, removes it from the book key list,
    and return true. If the key doesn't exist in the list, false is
    returned.
    */
    if (bookKeys.includes(key)) {  
        bookKeys.splice(bookKeys.indexOf(key), 1)
        saveKeyList();
        return true;
    }
    return false;
}

/*
Book objects:

Books are represented by objects containing any relevant information.
They are stored in the local storage, retrievable by keys which 
are accessible in the objects themselves.

All keys are, as mentioned above, accessible in the local storage as well,
in "reading-list-book-keys". Each object is stored at "reading-list-book-X",
where "X" is replaced by the key.
*/

function createBookObject(title, author, year, days) {
    /*
    Creates a book element given a title, an author's name, 
    a year, a set of genres to which the book belongs, 
    a deadline within which the user wants to finish the book,
    in units of days (where 0 means no deadline), and the date
    when the book was finished (set to -1 until it is marked
    as read).

    The object contains a key property, which identifies the object
    and is to be used to retrieve the object from the local storage.
    When the object is created, the key is set to the current value
    of Date.now(). This should safely enough identify the object
    uniquely.
    */
    return {
        key: Date.now(),
        title: title,
        author: author,
        year: year,
        status: 0,
        days: days || -1
    };
}

function saveBookObject(obj) {
    /*
    Takes a book object and stores it in the local storage. If it is 
    a new book object, its key is added to the key list.
    */
    localStorage.setItem(`reading-app-book-${obj.key}`, JSON.stringify(obj));
    if (!bookKeys.includes(obj.key)) {
        addKeyToList(obj.key);
    }
}

function getBookObject(key) {
    /*
    Given a key, retrieves a book object from the local storage
    */
    return JSON.parse(localStorage.getItem(`reading-app-book-${key}`));
}

function deleteBookObject(book) {
    /*
    Given a key, deletes a book object from the local storage, upon which
    true is returned. If the key is not in the key list, false is returned.
    */
    if (removeKeyFromList(book.key)) {
        localStorage.removeItem(`reading-app-book-${book.key}`);
        return true;
    } else {
        return false;
    }
}

function getAllBookObjects(status = -1) {
    /*
    Retrieves all the book objects in the local storage, based on the keys
    in the key list, and the given status code. If status equals -1, 
    all retrieved book objects are returned.
    */
    return bookKeys
        .map(key => getBookObject(key))
        .filter(book => {
            if (status === -1) {
                return true;
            } else {
                return book.status === status;
            }
        });
}