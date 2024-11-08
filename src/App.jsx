import React, { useEffect, useState } from "react"
import Questions from "./Questions"
import Intro from "./Intro"

export default function App() {
    const [quizStarted, setQuizStarted] = useState(false)
    
    function handleStartClick() {
        setQuizStarted(true) 
    }

    function resetGame() {
        setQuizStarted(false)
    }

    function handleSelect(answer) {
        console.log(answer.id)
    }
    
    if (!quizStarted) {
        return (
            <Intro 
                handleStartClick={handleStartClick} 
            />
        )
    } else {
        return (
            <div className="main-container">
                <Questions 
                    resetGame={resetGame}
                />
            </div>
        )
    }
}