import React, { useState, useEffect, useCallback } from "react";
import Question from "./Question";
import { loadQuestions } from "../helpers/QuestionsHelper";
import HUD from "./HUD";
import SaveScoreForm from "./SaveScoreForm";

export default function Game({ history }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [done, setDone] = useState(false);

  // Retrieve question set from API using the fetch API
  // Convert that response to the format we want
  // Choose the first question of that array and pass it to the question component

  useEffect(() => {
    loadQuestions()
      .then((questions) => setQuestions(questions))
      .catch((err) => console.error(err));
  }, []);

  const scoreSaved = () => {
    history.push("/");
  };

  const changeQuestion = useCallback(
    (bonus = 0) => {
      if (questions.length === 0) {
        setDone(true);
        return setScore(score + bonus);
      }

      // get a random index of a question
      const randomQuestionIndex = Math.floor(Math.random() * questions.length);
      // set the current question to the question at that random index
      const currentQuestion = questions[randomQuestionIndex];
      // remove that question from the questions going forward
      const remainingQuestions = [...questions];
      remainingQuestions.splice(randomQuestionIndex, 1);
      // update the state to reflect these changes

      setQuestions(remainingQuestions);
      setCurrentQuestion(currentQuestion);
      setLoading(false);
      setScore(score + bonus);
      setQuestionNumber(questionNumber + 1);
    },
    [
      score,
      questionNumber,
      questions,
      setQuestions,
      setLoading,
      setCurrentQuestion,
      setQuestionNumber,
    ]
  );

  useEffect(() => {
    if (!currentQuestion && questions.length) {
      changeQuestion();
    }
  }, [currentQuestion, questions, changeQuestion]);

  return (
    <>
      {loading && !done && <div id="loader" />}
      {!done && !loading && currentQuestion && (
        <div>
          <HUD score={score} questionNumber={questionNumber} />
          <Question
            question={currentQuestion}
            changeQuestion={changeQuestion}
          />
        </div>
      )}

      {done && <SaveScoreForm score={score} scoreSaved={scoreSaved} />}
    </>
  );
}
