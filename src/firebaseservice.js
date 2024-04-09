import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyCmYS5L8qdyK9Ie3q6Ns391j5MSB08WpN8",
    authDomain: "my-todo-app-yin.firebaseapp.com",
    projectId: "my-todo-app-yin",
    databaseURL: "https://my-todo-app-yin-default-rtdb.firebaseio.com/",
    storageBucket: "my-todo-app-yin.appspot.com",
    messagingSenderId: "745954655939",
    appId: "1:745954655939:web:5fc8e0bc0c4aafbcf0ac76",
    measurementId: "G-35TQ1YLP71"
  };

// 初始化 Firebase 应用
const firebaseApp = initializeApp(firebaseConfig);

// 获取数据库实例
const database = getDatabase(firebaseApp);

export default database;