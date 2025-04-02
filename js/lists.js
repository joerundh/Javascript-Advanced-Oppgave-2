/*
Titles of the four types of lists available
*/
const listTitles = [
    "Planned reads",
    "Currently reading",
    "Finished reading",
    "Cancelled reads"
];

/*
All available sorting settings in an array, the indices in which
correspond to the respective indices of the sorting settings. I.e., 
alphabetical sorting by title has index 2, by publishing year 
oldest to youngest has index 6, etc.
*/

const sortingNames = [              // Indices:
    "Last added",                   // 0
    "First added",                  // 1
    "First started reading",        // 2
    "Last started reading",         // 3
    "First deadline",               // 4
    "Last deadline",                // 5
    "Last finished",                // 6
    "First finished",               // 7
    "First cancelled",              // 8
    "Last cancelled",               // 9
    "Title, alphabetically",        // 10
    "Title, reverse order",         // 11
    "Author, alphabetically",       // 12
    "Author, reverse order",        // 13
    "Year, earliest to oldest",     // 14
    "Year, oldest to earliest",     // 15
    "Rating, highest to lowest",    // 16
    "Rating, lowest to highest"     // 17
];

/*
Compare functions for two book objects which, depending on the
given key, compares either the titles, the authors, the years
or their ratings, in order or in reverse order.
*/

const compareFn = [                                                 // Indices:
    (book1, book2) => book2.key - book1.key,                        // 0
    (book1, book2) => book1.key - book2.key,                        // 1
    (book1, book2) => book1.started - book2.started,                // 2
    (book1, book2) => book2.started - book1.started,                // 3
    (book1, book2) => book1.deadline - book2.deadline,              // 4
    (book1, book2) => book2.deadline - book1.deadline,              // 5
    (book1, book2) => book2.finished - book1.finished,              // 6
    (book1, book2) => book1.finished - book2.finished,              // 7
    (book1, book2) => book1.cancelled - book2.cancelled,            // 8
    (book1, book2) => book2.cancelled - book1.cancelled,            // 9
    (book1, book2) => book1.title.localeCompare(book2.title),       // 10
    (book1, book2) => book2.title.localeCompare(book1.title),       // 11
    (book1, book2) => book1.author.localeCompare(book2.author),     // 12
    (book1, book2) => book2.author.localeCompare(book1.author),     // 13
    (book1, book2) => book1.year - book2.year,                      // 14
    (book1, book2) => book2.year - book1.year,                      // 15
    (book1, book2) => book2.rating - book1.rating,                  // 16
    (book1, book2) => book1.rating - book2.rating                   // 17
];

function availableSortingKeys(listIndex) {
    /*
    Given a list index, an array is returned which holds the 
    sorting keys available for that list
    */
    if (listIndex === 0) {
        return [ 0, 1, 10, 11, 12, 13, 14, 15 ];
    } else if (listIndex === 1) {
        return [ 2, 3, 4, 5, 10, 11, 12, 13, 14, 15 ];
    } else if (listIndex === 2) {
        return [ 6, 7, 10, 11, 12, 13, 14, 15, 16, 17 ];
    } else if (listIndex === 3) {
        return [ 8, 9, 10, 11, 12, 13, 14, 15 ];
    }
}

/*
DOM elements
*/

const listTitle = document.getElementById("list-title");
const shiftLeft = document.getElementById("shift-list-left");
const shiftRight = document.getElementById("shift-list-right");
const sortingSelect = document.getElementById("sort-by");
const bookList = document.getElementById("book-list");

/*
The list settings object holds on to which list is being viewed, and
the sorting settings for all the lists. 

First then, fetch the list settings object from the local storage, or else generate 
the default settings, which are viewing planned books (the first list, 
really) and, respectively, "last added", "first started", "last finished" and 
"first cancelled".
*/
const listSettings = JSON.parse(localStorage.getItem("reading-app-list-settings")) || {
    viewing: 0,
    sortingKeys: [ 0, 2, 6, 8 ]
};

function saveListSettings() {
    /*
    Saves the current list settings object to the local storage
    */
    localStorage.setItem("reading-app-list-settings", JSON.stringify(listSettings))
}

/*
DOM element generation
*/

function createListElement(book) {
    /*
    Given a book element, returns a list item element
    containing the title, author and year, as well as
    various properties depending on the status of the 
    given book object.

    The contents of the list element depends on the 
    list, and on the book object itself:

    - "Planning to read"-books shows title, author
    and the wanted number of days to read it; options are
    to "Start reading" and "Remove", the first of which
    changes the status of the book from 0 to 1, and adds
    a property "started", with value of Date.now(), and 
    "Remove" removes the book, like, from the plan, it
    will not be read... by the user... unless they read it without informing
    the app, which is legal; it's a app, not the book reading police;

    - "Currently reading" has title and author, of course,
    as well as when reading was started, in the property 
    "started", and a calculated deadline, property name
    "deadline", which is the number of days from before
    added to "started" property. Options are to "Finish",
    "Cancel", and "Remove again", any book can be removed from any list at any time. Changing one's mind about reading a book is not frowned upon; (entering the wrong info when adding the book, is frowned upon, however;)

    - Why didn't I divide this function into several? Because I didn't know that the MAJOR BULK of the essential workings of THE WHOLE APP was going to take place in it.
    Seriously, when this function was completed, there was almost nothing left. Yours truly can't describe his surprise
    at how much really important stuff just fitted in here. But it suffers from
    being unreadable. Unless I add more comments, which I promise I will in a minute.
    Also, initially the list items where just gonna show
    the title and the author. Then deadlines, rating et.al.
    became relevant, and they fitted right into it
    (inasmuch as the function is allowed to be as huge as it is)

    - "Finished reading" has much of the same as above, 
    minus deadline and all. But it has the option of 
    RATING the book after it has been finished.

    - "Cancelled": either add it to the plan again, or remove it.
    */
    const element = document.createElement("li");       // To be appended to the ul element
    element.className = "book-list-item";

    const infoDiv = document.createElement("div");      // One half of the list item
    infoDiv.className = "book-list-item-info";

    const titleElement = document.createElement("p");
    titleElement.style.fontSize = "1.2em";
    titleElement.style.fontWeight = "bold";
    titleElement.style.fontStyle = "italic";
    titleElement.textContent = `${book.title}`;

    const subtitleElement = document.createElement("p");
    subtitleElement.innerHTML = `by <b>${book.author}</b>`;

    infoDiv.append(titleElement, subtitleElement);

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "book-list-item-options";
    if (book.status === 0) {
        /*
        If the book is "Planned to read", show self-estimated 
        number of days needed to read it.
        */
        if (book.days !== -1) {
            const numberOfDays = document.createElement("p");
            numberOfDays.textContent = `Finish within: ${book.days} days`;
            infoDiv.append(numberOfDays);
        }

        /*
        Add buttons to start reading it, and to wordlessly remove it
        */
        const startReadingButton = document.createElement("button");
        startReadingButton.textContent = "Start reading";
        startReadingButton.addEventListener("click", event => {
            book.status = 1;
            book.started = Date.now();
            if (book.days !== -1) {
                book.deadline = book.started + 1000*60*60*24*book.days;
            }
            saveBookObject(book);
            openList(1);
        });

        const removeBookButton = document.createElement("button");
        removeBookButton.textContent = "Remove";
        removeBookButton.addEventListener("click", event => {
            deleteBookObject(book);
            openList(0);
        });
        optionsDiv.appendChild(removeBookButton);

        optionsDiv.append(startReadingButton);
    } else if (book.status === 1) {
        /*
        When changed to currently reading, if a number of days to 
        finish it is indicated, add info about when the book
        was started, and the day within which to finish it.
        */
        if (book.deadline) {
            const timingElement = document.createElement("p");
            timingElement.innerHTML = `Started reading: ${new Date(book.started).getDate()}.${new Date(book.started).getMonth() + 1}.${new Date(book.started).getFullYear()}<br />
                                       Deadline: ${new Date(book.deadline).getDate()}.${new Date(book.deadline).getMonth() + 1}.${new Date(book.deadline).getFullYear()}`;
            infoDiv.append(timingElement);
        }

        const finishedBookButton = document.createElement("button");
        finishedBookButton.textContent = "Finished";
        finishedBookButton.addEventListener("click", event => {
            book.status = 2;
            book.finished = Date.now();
            saveBookObject(book);
            openList(2);
        });

        const cancelBookButton = document.createElement("button");
        cancelBookButton.textContent = "Cancel";
        cancelBookButton.addEventListener("click", event => {
            book.status = 3;
            book.cancelled = Date.now();
            saveBookObject(book);
            openList(1);
        });

        const removeBookButton = document.createElement("button");
        removeBookButton.textContent = "Remove";
        removeBookButton.addEventListener("click", event => {
            deleteBookObject(book);
            openList(1);
        });
        optionsDiv.appendChild(removeBookButton);

        optionsDiv.append(finishedBookButton, cancelBookButton);
    } else if (book.status === 2) {
        /*
        If a book is "Finished", it should have an option to 
        add a rating, and if a rating is added, it shows
        under the author/year. Until a rating is added,
        a select element with the number of starts appears
        in the options half of the list element.
        */
        if (book.rating) {
            /*
            If a rating is added, it shows in the book info
            */
            const rating = document.createElement("p");
            rating.innerHTML = "My rating: ";
            for (let i = 0; i < book.rating; i++) {
                rating.innerHTML += "&#x2605;";
            }
            infoDiv.append(rating);
        } else {
            /*
            Rating select element: 1 star, 2 stars, 3 stars, 4 stars or 5 stars
            */
            const ratingSelect = document.createElement("select");
            for (let i = 0; i <= 5; i++) {
                const ratingOption = document.createElement("option");
                ratingOption.value = i;
                if (i === 0) {
                    ratingOption.textContent = "Add rating:"
                } else {
                    ratingOption.textContent = `${i} stars`;
                }
                ratingSelect.addEventListener("change", event => {
                    if (ratingSelect.value > 0) {
                        book.rating = ratingSelect.value;
                        saveBookObject(book);
                        openList(2);
                    }
                });
                ratingSelect.value = 0;
                ratingSelect.appendChild(ratingOption);
            }
            optionsDiv.append(ratingSelect);
        }

        const removeBookButton = document.createElement("button");
        removeBookButton.textContent = "Remove";
        removeBookButton.addEventListener("click", event => {
            deleteBookObject(book);
            openList(2);
        });
        optionsDiv.appendChild(removeBookButton);
    } else if (book.status === 3) {
        /*
        A "Cancelled" book can be re-added to the reading plan,
        or be removed.
        */
        const addToPlan = document.createElement("button");
        addToPlan.textContent = "Add to plan again";
        addToPlan.addEventListener("click", event => {
            book.status = 0;
            delete book.started;
            if (book.deadline) {
                delete book.deadline;
            }
            delete book.cancelled;
            saveBookObject(book);
            openList(0);
        });
        optionsDiv.append(addToPlan);

        const removeBookButton = document.createElement("button");
        removeBookButton.textContent = "Remove";
        removeBookButton.addEventListener("click", event => {
            deleteBookObject(book);
            openList(3);
        });
        optionsDiv.appendChild(removeBookButton);
    }

    element.append(infoDiv, optionsDiv);

    return element;
}

/*
List navigation
*/

function openList(listIndex) {
    /*
    Clear the list, set the title to that of the given list,
    fetch all book elements with status matching the list index
    (0 for unread, 1 for read, 2 for finished, 3 for cancelled), 
    sort the book elements according to the set sorting method, 
    create a list item element for each book and add to the list
    element.
    */
    bookList.innerHTML = "";                            // Clear the list
    listSettings.viewing = listIndex;                   // Set the viewing property in the list settings object
    saveListSettings();                                 // Save the list settings object
    listTitle.textContent = listTitles[listIndex];      // Insert the relevant list title

    /*
    Fetch all book objects using getAllBookObjects, with a filter that selects
    according to status, which corresponds to the list index, and run the function
    sortBookObjects.
    If no book objects are found, a paragraph saying as much is inserted instead.
    */
    const bookObjects = getAllBookObjects().filter(obj => obj.status === listIndex);
    if (bookObjects.length === 0) {
        bookList.textContent = "No books found."
    } else {
        bookObjects.sort(compareFn[listSettings.sortingKeys[listIndex]]);
        bookObjects.forEach(obj => {
            const element = createListElement(obj);
            bookList.appendChild(element);
        })
    }
    /*
    Put the sort settings available for the currently viewed list 
    into the select element, and set the select element value 
    to the current sort setting
    */
    sortingSelect.innerHTML = "";
    const sortingKeys = availableSortingKeys(listIndex);
    sortingKeys.forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = `${sortingNames[key]}`
        sortingSelect.appendChild(option);
    });
    sortingSelect.value = listSettings.sortingKeys[listIndex];
}

/*
Event listeners for list navigation buttons
*/

shiftLeft.addEventListener("click", event => {
        /*
    When clicking the right arrow button, set the list-to-view index
    and refresh the list
    */
    if (listSettings.viewing > 0) {
        openList(--listSettings.viewing);
        saveListSettings();
    }
});

shiftRight.addEventListener("click", event => {
    /*
    When clicking the right arrow button, set the list-to-view index
    and refresh the list
    */
    if (listSettings.viewing < listTitles.length - 1) {
        openList(++listSettings.viewing);
        saveListSettings();
    }
});

/*
Event listener for sort setting select element
*/

sortingSelect.addEventListener("change", event => {
    /*
    When the preferred sort setting is changed, save it to the 
    listSettings object and store that in the local storage,
    and re-open the current list.
    */
    listSettings.sortingKeys[listSettings.viewing] = sortingSelect.value;
    saveListSettings();
    openList(listSettings.viewing);
});