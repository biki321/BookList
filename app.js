//Book class : Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//ui class to handles ui task
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static showALert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //vanish after some time
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//store class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
      localStorage.setItem("books", JSON.stringify(books));
    });
  }
}

//Event: Display books
document.addEventListener("DOMContentLoaded", UI.displayBooks());

//Event add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  //get more values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate
  if (title === "" || author === "" || isbn === "") {
    UI.showALert("Please fill the fields", "danger");
  } else {
    //instatiate book
    const book = new Book(title, author, isbn);

    //add book to UI
    UI.addBookToList(book);

    //store book to localStorage
    Store.addBook(book);

    //show success msg
    UI.showALert("added a book", "success");

    //clear the input fileds after submitting
    UI.clearFields();
  }
});

//event remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
  //remove book from UI
  UI.deleteBook(e.target);

  //remove from storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show success msg
  UI.showALert("Book removed", "success");
});
