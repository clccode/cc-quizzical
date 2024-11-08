import React from "react"
import goldBlob from "./images/gold-blob.png"

export default function Intro(props) {
    return (
        <div className="intro-container">
            <img src={goldBlob} className="intro-img" />
            <h1>Quizzical</h1>
            <button 
                className="start-btn" 
                id="start-btn"
                onClick={props.handleStartClick}
            >Start quiz</button>
        </div>
    )
}