import React, { useEffect, useState } from "react"
import Score from "./Score"
import he from "he"
import { nanoid } from "nanoid"
import blueBlob from "./images/blue-blob.png"
import smallGoldBlob from "./images/small-gold-blob.png"

export default function Questions(props) {
    const url = "https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple"
    const [questions, setQuestions] = useState([])
    const [selectedAnswers, setSelectedAnswers] = useState({}) // track selected answers per question
    const [score, setScore] = useState(0)
    const [checkAnswers, setCheckAnswers] = useState(false)
    
    // function to shuffle answers
    function shuffleAnswers(answers) {
        return answers.sort(() => Math.random() - 0.5);
    }
    
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const formattedQuestions = data.results.map((question) => ({
                    id: nanoid(), // Assign a unique ID for each question
                    ...question,
                    correctAnswerId: nanoid(), // Unique ID for correct answer
                    shuffledAnswers: shuffleAnswers([
                        ...question.incorrect_answers.map(answer => ({
                            id: nanoid(), // unique ID for each incorrect answer
                            text: answer,
                            isCorrect: false
                        })),
                        {
                            id: nanoid(),
                            text: question.correct_answer,
                            isCorrect: true
                        }
                    ])
                }))
                setQuestions(formattedQuestions)
            })
            .catch((error) => console.error("Error fetching questions: ", error))
    }, [])

    function handleAnswerClick(e, questionId, answerId, isCorrect) {
        e.preventDefault()
        // update the selected answer for the specific question
        setSelectedAnswers(prevSelected => ({
            ...prevSelected,
            [questionId]: { answerId, isCorrect }
        }))
        
        // Only increase the score if the selected answer is correct and it’s the first correct selection for this question
        if (isCorrect && (!selectedAnswers[questionId] || !selectedAnswers[questionId].isCorrect)) {
            setScore(prevScore => prevScore + 1)
        }
        
    }
    
    const scoreElement = !checkAnswers ? 
        <button className="check-btn" id="check-btn" onClick={handleCheck}>Check Answers</button> 
        : 
        <Score 
            score={score}
            questions={questions}
            resetGame={props.resetGame}
        />

    function handleCheck() {
        setCheckAnswers(true)
    }
    
    return (
        <div className="questions-container">
            <img src={smallGoldBlob} className="small-gold-blob" />
            {questions.map((question) => (
                <div key={question.id}>
                    <h2>{he.decode(question.question || "")}</h2> {/* Safely decode question */}
                    <form>
                        {question.shuffledAnswers.map((answer) => {
                            // Check if there is a selected answer for this question, then check if it matches the current answer ID
                            const isSelected = selectedAnswers[question.id] && selectedAnswers[question.id].answerId === answer.id;

                            // Check if there is a selected answer for this question and if that answer is marked as correct
                            const isCorrect = selectedAnswers[question.id] && selectedAnswers[question.id].isCorrect;
                            
                            // if checkAnswers is true and the response is correct 
                            const isCorrectAnswer = checkAnswers && answer.isCorrect
                            
                            // if checkAnswers is true and the response is incorrect
                            const isIncorrectAnswer = checkAnswers && !answer.isCorrect
                                
                            return (
                                <ul key={answer.id} className="answers-list">
                                    <li className="answer-item">
                                        <button
                                            style={{
                                                backgroundColor: isSelected && !checkAnswers ? "#D6DBF5" : 
                                                isCorrectAnswer && isSelected || isCorrectAnswer && !isSelected ? "#94D7A2" : 
                                                isIncorrectAnswer && isSelected ? "#F8BCBC" :
                                                "transparent",
                                                border: isSelected && "none" || !isSelected && isCorrectAnswer && "none"
                                            }}
                                            onClick={(e) => handleAnswerClick(e, question.id, answer.id, answer.isCorrect)}
                                            id={answer.id}
                                        >
                                            {he.decode(answer.text || "")} {/* Safely decode answer text */}
                                        </button>
                                    </li>
                                </ul>
                            )
                        })}
                    </form>
                    <hr />
                </div>
            ))}
            <div className="check-btn-container" id="check-score">
                {scoreElement}
            </div>
        </div>
    )
}