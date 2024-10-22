import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const inputTitleNode = document.getElementById("inputTitle");
const addMovieInListNode = document.getElementById("addMovieInList");
const moviesOutputNode = document.getElementById("moviesOutput");
const errorTitleNode = document.getElementById("errorTitle");

const VALIDATION_MIN_LENGTH = 1;
const VALIDATION_MAX_LENGTH = 50;

const ERROR_TITLE_NOT_LENGTH = "Напиши заголовок";
const ERROR_TITLE_MIN_LENGTH = `Введите более ${VALIDATION_MIN_LENGTH} символа`;
const ERROR_TITLE_MAX_LENGTH = `Вы ввели максимальное количество символов ${VALIDATION_MAX_LENGTH}`;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPzGoR_K_eVZU2METzdu6JVYT5xJN0fEM",
  authDomain: "movies-df9ea.firebaseapp.com",
  projectId: "movies-df9ea",
  storageBucket: "movies-df9ea.appspot.com",
  messagingSenderId: "126483647700",
  appId: "1:126483647700:web:809b26715e9c8f4d4abf41",
};

const movies = JSON.parse(localStorage.getItem("movies")) || [];

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// хранит в себе базу данных и возможности базы данных
const db = getFirestore(app);

// добавление данных в firestore
async function addDocFunction(title) {
  if (!title) {
    console.error("Title is required");
    return; // Не добавляем документ, если title не задан
  }

  try {
    const docRef = await addDoc(collection(db, "movies"), {
      title,
      done: false,
      createdAt: serverTimestamp(),
    });

    localStorage.setItem("movies", JSON.stringify(movies)); // Обновляем localStorage

    console.log("Document written with ID: не удаляется ", docRef.id);
    await getDocsFunction(); // Обновляем список фильмов после добавления
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// получение данных из firestore
async function getDocsFunction() {
  // Очищаем массив перед загрузкой новых данных
  movies.length = 0;
  const ref = collection(db, "movies");
  const q = query(ref, orderBy("createdAt"));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    movies.push({
      id: doc.id, // Сохраняем ID документа
      title: doc.data().title,
      checked: doc.data().checked,
    });
    console.log(`${doc.id} => ${doc.data().title}`);
  });

  // Обновляем localStorage после загрузки данных
  localStorage.setItem("movies", JSON.stringify(movies));

  renderMovies(); // Вызываем функцию рендеринга после загрузки данных
}

// функция для удаления фильма
async function deleteFunction(index) {
  if (index < 0 || index >= movies.length) {
    console.error("invalid index");
    return; // Проверка на валидность индекса
  }

  const movieToDelete = movies[index]; // Получаем фильм по индексу

  try {
    // Удаляем документ из Firestore
    await deleteDoc(doc(db, "movies", movieToDelete.id));

    // Удаляем фильм из локального массива
    movies.splice(index, 1); // Удаляем элемент по индексу

    // Обновляем localStorage
    localStorage.setItem("movies", JSON.stringify(movies));
    console.log("Movie deleted successfully");

    renderMovies(); // Перерисовываем список фильмов после удаления
  } catch (e) {
    console.error("Error deleting movie: ", e);
  }
}

//очистка инпута
function clearInput() {
  inputTitleNode.value = "";
}

//валидация инпута
function validationTitle() {
  inputTitleNode.style.borderBottom = "1px solid black";
  errorTitleNode.classList.remove("errorTitle_red");
  errorTitleNode.innerText = "";

  if (!inputTitleNode.value) {
    inputTitleNode.style.borderBottom = "1px solid red";
    errorTitleNode.classList.add("errorTitle_red");
    errorTitleNode.innerText = ERROR_TITLE_NOT_LENGTH;
    return false;
  }
  if (inputTitleNode.value.length <= VALIDATION_MIN_LENGTH) {
    inputTitleNode.style.borderBottom = "1px solid red";
    errorTitleNode.classList.add("errorTitle_red");
    errorTitleNode.innerText = ERROR_TITLE_MIN_LENGTH;
    return false;
  }
  if (inputTitleNode.value.length > VALIDATION_MAX_LENGTH) {
    inputTitleNode.style.borderBottom = "1px solid red";
    errorTitleNode.classList.add("errorTitle_red");
    errorTitleNode.innerText = ERROR_TITLE_MAX_LENGTH;
    return false;
  }

  return true;
}
//функциы возврата значения из заголовка
function getTitleFromUser() {
  const trimmedValue = inputTitleNode.value.trim();

  if (!validationTitle(trimmedValue)) {
    return; // Если валидация не пройдена, возвращаем undefined
  }

  return trimmedValue; // Возвращаем очищенное значение
}

//создание HTML элемента - movie
function renderMovies() {
  moviesOutputNode.innerHTML = "";

  const moviesList = document.createElement("ul");
  moviesList.className = "movies__list";

  movies.forEach((movie, index) => {
    const moviesItem = document.createElement("li");
    moviesItem.className = "movies__item-inner";
    // moviesItem.setAttribute("id", index);
    moviesItem.id = index;

    const movieLabel = document.createElement("label");
    movieLabel.className = "label";

    const realCheckbox = document.createElement("input");
    realCheckbox.className = "checkbox";
    realCheckbox.type = "checkbox";
    realCheckbox.checked = movie.checked; // Устанавливаем состояние чекбокса

    const spanFakeCheckbox = document.createElement("span");
    spanFakeCheckbox.className = "fake";

    const spanTitleMovie = document.createElement("span");
    spanTitleMovie.className = "movie-title";
    spanTitleMovie.innerText = movie.title;

    const movieCloseBtn = document.createElement("button");
    movieCloseBtn.className = "movie-close";
    // movieCloseBtn.setAttribute("id", index);
    movieCloseBtn.id = index;

    movieLabel.appendChild(realCheckbox);
    movieLabel.appendChild(spanFakeCheckbox);
    movieLabel.appendChild(spanTitleMovie);
    moviesItem.appendChild(movieLabel);
    moviesItem.appendChild(movieCloseBtn);
    moviesList.appendChild(moviesItem);

    // Устанавливаем класс 'checked' в зависимости от состояния чекбокса
    if (movie.checked) {
      moviesItem.classList.add("checked");
      spanTitleMovie.style.textDecoration = "line-through";
    }

    // Обработчик для чекбокса
    realCheckbox.addEventListener("click", () => {
      movie.checked = realCheckbox.checked; // Сохраняем состояние чекбокса
      localStorage.setItem("movies", JSON.stringify(movies));

      // console.log(e.target.checked);
      if (realCheckbox.checked) {
        moviesItem.classList.add("checked");
        spanTitleMovie.style.textDecoration = "line-through";
        moviesItem.classList.remove("error");
      } else {
        moviesItem.classList.remove("checked");
        spanTitleMovie.style.textDecoration = "none";
      }
    });

    // Обработчик для кнопки закрытия
    movieCloseBtn.addEventListener("click", function () {
      if (!realCheckbox.checked) {
        moviesItem.classList.add("error");
        return;
      }

      deleteFunction(index);

      renderMovies(); // Перерисовываем фильмы
      localStorage.setItem("movies", JSON.stringify(movies)); // Обновляем локальное хранилище
    });
  });

  moviesOutputNode.appendChild(moviesList);
}

function newMovieHandler() {
  const movieName = getTitleFromUser();

  if (!validationTitle(movieName)) {
    return;
  }

  addDocFunction(movieName); // Добавляем фильм в Firestore
  localStorage.setItem("movies", JSON.stringify(movies));

  renderMovies();
  clearInput();
}

function clickToEnter(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    newMovieHandler();
  }
}

//функция обработчика по нажатию на Enter
inputTitleNode.addEventListener("keydown", clickToEnter);
//функция обработчика по клику
addMovieInListNode.addEventListener("click", newMovieHandler);

const init = async () => {
  await getDocsFunction(); // Загрузка фильмов из Firestore
  // renderMovies(movies, moviesOutputNode);
};
init();
