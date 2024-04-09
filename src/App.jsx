import React, { useState, useEffect } from 'react';
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import Form from "./components/Form";
import { nanoid } from "nanoid";
import { getMessaging } from "firebase/messaging";
import firebaseService from './firebaseservice'; 
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp, getApp } from 'firebase/app';

const existingApp = getApp('[DEFAULT]');
const app = existingApp || initializeApp(firebaseService);
const messaging = getMessaging();
const database = getDatabase(app);

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);

    storedTasks.forEach(task => {
      if (!task.location.latitude || !task.location.longitude) {
        geoFindMe(task.id);
      }
    });

    window.Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
  }, []);

  function addTask(name) {
    // Generate a unique ID for the task
    const id = "todo-" + nanoid();
    // Create a new task object
    const newTask = {
      id: id,
      name: name,
      completed: false,
      location: { latitude: "", longitude: "", error: "" },
    };

    // Update task list status
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    // Save new tasks to local storage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    //  Saving new tasks to the Firebase real-time database
    const taskRef = ref(database, `tasks/${id}`);
    set(taskRef, newTask).catch(error => {
      console.error("Error adding task to database:", error);
    });

    // Request browser notification permissions and send the notification
    window.Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        new window.Notification('New List Add!', { body: `Title: ${name}` });
      }
    });


    // Get geolocation
    geoFindMe(id);
  }

  const geoFindMe = (taskId) => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(
        position => {
          // Get the latitude and longitude information of the user's current location
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude, longitude);

          console.log(`Latitude: ${latitude}°, Longitude: ${longitude}°`);
          console.log(
            `Try here: https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
          );

          // Updating the location information of tasks
          locateTask(taskId, {
            latitude: latitude,
            longitude: longitude,
            error: "",
          });
        },
        error => {
          console.error("Error getting user location:", error);
          // If the user's location cannot be obtained, update the task's location information with an error message
          locateTask(taskId, { error: "Unable to retrieve your location" });
        }
      );
    }
  };

  function locateTask(id, location) {
    setTasks(prevTasks => {
      if (Array.isArray(prevTasks)) {
        return prevTasks.map(task => {
          if (id === task.id) {
            return { ...task, location: { ...task.location, ...location } };
          }
          return task;
        });
      } else {
       
        console.error('prevTasks 不是一个数组:', prevTasks);
        return prevTasks; 
      }
    });
  }

  function toggleTaskCompleted(id) {
    const updatedTask = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    setTasks(updatedTask);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });

    setTasks(editedTaskList);
  }

  function photoedTask(id) {
    console.log("photoedTask", id);
    const photoedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, photo: true };
      }
      return task;
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList);
  }

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(FILTER_MAP[filter]) : [];

  const taskList = filteredTasks.map(task => (
    <Todo
      key={task.id}
      id={task.id}
      name={task.name}
      completed={task.completed}
      location={task.location}
      toggleTaskCompleted={toggleTaskCompleted}
      photoedTask={photoedTask}
      deleteTask={deleteTask}
      editTask={(newName) => editTask(task.id, newName)}
    />
  ));


  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>PLANIST</h1>
      <Form addTask={addTask} geoFindMe={geoFindMe} />
      <div className="filters btn-group stack-exception">
        {FILTER_NAMES.map(name => (
          <FilterButton
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}
          />
        ))}
      </div>
      {/*task number view*/}
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;



