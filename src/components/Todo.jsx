import React, { useState, useEffect, useRef } from 'react';
import Webcam from "react-webcam"; 
import Popup from "reactjs-popup"; 
import "reactjs-popup/dist/index.css"; 
import MapView from "./MapView.jsx";
import { addPhoto, GetPhotoSrc } from "../db.jsx";

function Todo({ id, name, completed, location, toggleTaskCompleted, deleteTask, editTask, photoedTask }) {
  const [wasEditing, setWasEditing] = useState(false);      
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const editFieldRef = useRef(null); // Ref for the edit field

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    editTask(newName);
    setNewName("");
    setEditing(false);
  }

  const handleMapLinkClick = (location) => {
    openMapWithLocation(location.latitude, location.longitude);
  }
  
  const openMapWithLocation = (latitude, longitude) => {
    window.open(`https://maps.google.com/maps?q=${latitude},${longitude}`, '_blank');
  }

  useEffect(() => {
    if (!wasEditing && isEditing && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [wasEditing, isEditing]);
      
  return (
    <li className="todo">
{/*Renders different content depending on the editing state*/}
      {isEditing ? (
        // Forms in Edit State
        <form className="stack-small" onSubmit={handleSubmit} noValidate>
          {/* input box */}
          <div className="form-group">
            <input
              id={id}
              className="todo-text"
              type="text"
              value={newName}
              onChange={handleChange}
              autoFocus
              ref={editFieldRef}
            />
            <label className="todo-label" htmlFor={id}>
              {name}
            </label>
          </div>
            {/* Buttons in edit state */}
          <div className="btn-group">
            <button
              type="button"
              className="btn todo-cancel"
              onClick={() => setEditing(false)}>
              Cancel
              <span className="visually-hidden">renaming {name}</span>
            </button>
            <button 
              type="submit" 
              className="btn btn__primary todo-edit">
              Save
              <span className="visually-hidden">new name for {name}</span>
            </button>
          </div>
        </form>
      ) : (
        // Task display in non-editing state
        <div className="stack-small">
          <div className="c-cb">
             {/* Checkboxes */}
            <input
              id={id}
              type="checkbox"
              defaultChecked={completed}
              onChange={() => toggleTaskCompleted(id)}
            />
            <label className="todo-label" htmlFor={id}>
            {name}
              &nbsp; | &nbsp;
            {/* View map link */}
            <a href={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`} target="_blank" rel="noopener noreferrer" className="map-link">View</a>
            </label>
          </div>
          {/* Display map based on availability of location information */}
          {location.latitude && location.longitude && (
            <div>
              <MapView latitude={location.latitude} longitude={location.longitude} />
            </div>
          )}
          
          <div className="btn-group">
            {/* Edit button */}
            <button
              type="button"
              className="btn"
              onClick={() => {
                setEditing(true);
              }}>
              Edit <span className="visually-hidden">{name}</span>
            </button>
            {/* Photo button */}
            <Popup 
              trigger={
                <button type="button" className="btn"  onClick={() => photoedTask(id)}>
                  {" "}
                  Take Photo{" "}
                </button>
              }
              modal
            >
              <div>
                 <WebcamCapture id={id} />
              </div>
            </Popup>
           {/* View Photo Button */}
            <Popup 
              trigger={
                <button type="button" className="btn">
                  {" "}
                  View Photo{" "}
                </button>
              }
              modal
            >
              <div>
                <ViewPhoto id={id} alt={name} />
              </div>
            </Popup>
            {/* Delete Button */}
            <button
              type="button"
              className="btn btn__danger"
              onClick={() => deleteTask(id)}>
              Delete <span className="visually-hidden">{name}</span>
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

const WebcamCapture = ({ id }) => {
  const webcamRef = useRef(null);
  const [captured, setCaptured] = useState(false); // State to track if photo is captured
  const [capturedImage, setCapturedImage] = useState(null); // State to hold captured image data

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc); // Set captured image data
    setCaptured(true); // Set captured to true after capturing
  };

  const retake = () => {
    setCaptured(false); // Reset captured to false for retaking photo
  };

  return (
    <>
      {!captured && ( 
        <>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          <div className="btn-group">
            <button
              type="button"
              className="btn"
              onClick={capture}
            >
              Capture photo
            </button>
          </div>
        </>
      )}
      {captured && (
        <>
          <img src={capturedImage} alt="Captured" />
          <div className="btn-group">
            <button
              type="button"
              className="btn"
              onClick={retake}
            >
              Retake photo
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                addPhoto(id, capturedImage); // Save captured photo
                setCaptured(false);
              }}
            >
              Save photo
            </button>
          </div>
        </>
      )}
    </>
  );
};


const ViewPhoto = ({ id, alt }) => {
  const photoSrc = GetPhotoSrc(id);

  return (
    <>
     <div>
       <img src={photoSrc} alt={alt} />
     </div>
  </>
  );
};

export default Todo;
