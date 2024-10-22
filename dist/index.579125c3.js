const inputTitleNode = document.getElementById("inputTitle");
const addMovieInListNode = document.getElementById("addMovieInList");
const moviesOutputNode = document.getElementById("moviesOutput");
const errorTitleNode = document.getElementById("errorTitle");
const VALIDATION_MIN_LENGTH = 1;
const VALIDATION_MAX_LENGTH = 50;
const ERROR_TITLE_NOT_LENGTH = "\u041D\u0430\u043F\u0438\u0448\u0438 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A";
const ERROR_TITLE_MIN_LENGTH = `\u{412}\u{432}\u{435}\u{434}\u{438}\u{442}\u{435} \u{431}\u{43E}\u{43B}\u{435}\u{435} ${VALIDATION_MIN_LENGTH} \u{441}\u{438}\u{43C}\u{432}\u{43E}\u{43B}\u{430}`;
const ERROR_TITLE_MAX_LENGTH = `\u{412}\u{44B} \u{432}\u{432}\u{435}\u{43B}\u{438} \u{43C}\u{430}\u{43A}\u{441}\u{438}\u{43C}\u{430}\u{43B}\u{44C}\u{43D}\u{43E}\u{435} \u{43A}\u{43E}\u{43B}\u{438}\u{447}\u{435}\u{441}\u{442}\u{432}\u{43E} \u{441}\u{438}\u{43C}\u{432}\u{43E}\u{43B}\u{43E}\u{432} ${VALIDATION_MAX_LENGTH}`;
const movies = JSON.parse(localStorage.getItem("movies")) || [];
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
    if (!validationTitle(inputTitleNode.value.trim())) return; // Если валидация не пройдена, возвращаем undefined
    // Если валидация пройдена, возвращаем значение
    return inputTitleNode.value.trim();
}
//создание HTML элемента - movie
function renderMovies() {
    moviesOutputNode.innerHTML = "";
    const moviesList = document.createElement("ul");
    moviesList.className = "movies__list";
    movies.forEach((movie, index)=>{
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
        realCheckbox.addEventListener("click", ()=>{
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
        movieCloseBtn.addEventListener("click", function() {
            if (!realCheckbox.checked) {
                moviesItem.classList.add("error");
                return;
            }
            movies.splice(index, 1); // Удаляем фильм из локального массива
            renderMovies(); // Перерисовываем фильмы
            localStorage.setItem("movies", JSON.stringify(movies));
        });
    });
    moviesOutputNode.appendChild(moviesList);
}
function newMovieHandler() {
    const movieName = getTitleFromUser();
    if (!validationTitle(movieName)) return;
    const newMovie = {
        title: movieName
    };
    movies.push(newMovie);
    // записываем фильмы в локалсторадж
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
const init = ()=>{
    return renderMovies(movies, moviesOutputNode);
};
init();

//# sourceMappingURL=index.579125c3.js.map
