import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
	query
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPzGoR_K_eVZU2METzdu6JVYT5xJN0fEM",
  authDomain: "movies-df9ea.firebaseapp.com",
  projectId: "movies-df9ea",
  storageBucket: "movies-df9ea.appspot.com",
  messagingSenderId: "126483647700",
  appId: "1:126483647700:web:809b26715e9c8f4d4abf41",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// хранит в себе базу данных и возможности базы данных
const db = getFirestore(app);

// добавление данных в firebase
async function addDocFunction() {
  try {
    // создание нового документа (2 колонка)
    // используется метод addDoc(добавление) - это и есть апишка, которая дает право на добавление нового элемента в коллекцию
    // (в коллекцию(db, в movies))
    const docRef = await addDoc(collection(db, "movies"), {
      // передаем что нужно записать
      title: "film1",
      checked: "false",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// получение данных из firebase
async function getDocsFunction() {
  const querySnapshot = await getDocs(collection(db, "movies"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().title}`);
  });
}

async function deleteFunction(movieId) {
  const ref = doc(db, "movies", movieId); // Получаем ссылку на документ по ID
  try {
    await deleteDoc(ref); // Удаляем документ
    console.log(`Document with ID ${movieId} deleted.`);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}

addDocFunction();
getDocsFunction();
deleteFunction();
