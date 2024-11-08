import React from "react"

export default function Score(props) {
    return (
        <div className="score-container">
            <h2 className="score">You got {props.score}/{props.questions.length} correct</h2>
            <button onClick={props.resetGame} className="play-again-btn">Play Again</button>
        </div>
    )
}