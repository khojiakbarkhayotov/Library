"use strict";
const addBtn = document.querySelector(".add");
const delAll = document.querySelector(".delall");
const popUpModal = document.querySelector(".modal");
const addForm = document.querySelector("form");
const addSubmit = document.getElementById("add-btn");
const addContainer = document.querySelector(".add-book");
const mainContainer = document.querySelector(".booklist");
const readInput = document.querySelector(".read");
const readBtn = document.getElementsByClassName("status");
const remove = document.getElementsByClassName("remove");
const errorMsg = document.querySelector(".errorMsg");
// colors
const green = "#86efac";
const red = "#fda4af";

let bookList = localStorage.getItem("booklist")
  ? JSON.parse(localStorage.getItem("booklist"))
  : [];

if (bookList !== []) {
  renderTemplate();
}

function AddBook(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  // this code below is not recommended, because it duplicates this function in all objects and makes the performance of the program down
  // this.info = function () {
  //   return `The ${title} by ${author}, ${pages} pages, ${
  //     read ? "read already" : "not read yet"
  //   }.`;
  // };
}

AddBook.prototype.info = function () {
  return `The ${this.title} by ${this.author}, ${this.pages} pages, ${
    this.read ? "read already" : "not read yet"
  }.`;
};

const book = new AddBook("Complete Angular book", "Murray", 769, false);
console.log(book.info());

// Adding some event listeners to dom elements

[addBtn, addContainer].forEach((el) => {
  el.addEventListener("click", function () {
    popUpModal.classList.remove("hidden");
  });
});

function itemToRemove(obj, id) {
  return obj.parentElement.children[id].innerHTML.replaceAll('"', "");
}

function removeBook() {
  // console.log(itemToRemove(this, 0));
  const del = bookList.findIndex((el) => {
    return (
      el.title == itemToRemove(this, 0) && el.author == itemToRemove(this, 1)
    );
  });
  bookList.splice(del, 1);
  addLocal(bookList);
  // [...document.getElementsByClassName("book")].forEach(function (book) {
  //   mainContainer.removeChild(book);
  // });
  mainContainer.removeChild(this.parentElement);
  // rem.parentElement.style.display = "none";
  // renderTemplate();
  // location.reload();
}

function readBook() {
  const itemID = bookList.findIndex((el) => {
    // console.log(el.read);
    return (
      itemToRemove(this, 0) == el.title && itemToRemove(this, 1) == el.author
    );
  });
  bookList[itemID].read = bookList[itemID].read === "on" ? undefined : "on";
  addLocal(bookList);
  this.innerHTML = bookList[itemID].read ? "Read" : "Not read";
  this.style.backgroundColor = bookList[itemID].read ? green : red;
  // location.reload();
}

[...remove].forEach((rem) => {
  rem.addEventListener("click", removeBook.bind(rem));
});

[...readBtn].forEach((book) => {
  book.addEventListener("click", readBook.bind(book));
});

popUpModal.addEventListener("click", function (e) {
  if (e.target === this) {
    this.classList.add("hidden");
  }
});

function addFormLogic(formContext) {
  bookList.push(formContext);
  addLocal(bookList);
  renderTemplate(true);
  popUpModal.classList.add("hidden");
  addForm.reset();
  if (!errorMsg.classList.contains("hidden")) errorMsg.classList.add("hidden");
}

// Add new book
addForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formElement = new FormData(addForm);
  const formContext = Object.fromEntries(formElement);
  let error = false;
  bookList.findIndex((book) => {
    if (book.title === formContext.title) {
      errorMsg.classList.remove("hidden");
      error = true;
    }
  });
  if (!error) addFormLogic(formContext);
});

delAll.addEventListener("click", function () {
  bookList = [];
  localStorage.clear();
  const allNodeChilds = document.querySelectorAll(".book");
  allNodeChilds.forEach((el) => {
    mainContainer.removeChild(el);
  });
});

// addForm.addEventListener("submit", function (e) {
//   e.preventDefault();
// });

// Template maker
function addTemplate(title, author, pages, read = false) {
  const template = `
  <div class="book">
            <p>"${title}"</p>
            <p>${author}</p>
            <p>${pages} pages</p>
            <button class="status" data-status="false" style="background-color: ${
              read ? green : red
            }">${read ? "Read" : "Not read"}</button>
            <button class="remove">Remove</button>
        </div>
  `;
  return template;
}

// local storage refresher
function addLocal(list) {
  localStorage.setItem("booklist", JSON.stringify(list));
}

function renderTemplate(single = false) {
  if (single) {
    mainContainer.insertAdjacentHTML(
      "afterbegin",
      addTemplate(...Object.values(bookList[bookList.length - 1]))
    );
    remove[0].addEventListener("click", removeBook.bind(remove[0]));
    readBtn[0].addEventListener("click", readBook.bind(readBtn[0]));
    return;
  }
  bookList.forEach((book) => {
    const values = Object.values(book);
    mainContainer.insertAdjacentHTML("afterbegin", addTemplate(...values));
  });
}
