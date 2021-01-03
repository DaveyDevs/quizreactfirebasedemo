export const loadQuestions = async (
  amount = 10,
  category = 9,
  difficulty = "easy",
  type = "multiple"
) => {
  try {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;

    const res = await fetch(url);
    const { results } = await res.json();
    return convertQuestionsFromAPI(results);
  } catch (err) {
    console.error(err);
  }
};

const convertQuestionsFromAPI = (rawQuestions) => {
  return rawQuestions.map((loadedQuestion) => {
    const formattedQuestion = {
      question: loadedQuestion.question,
      answerChoices: [...loadedQuestion.incorrect_answers],
    };

    formattedQuestion.answer = Math.floor(Math.random() * 4);

    formattedQuestion.answerChoices.splice(
      formattedQuestion.answer,
      0,
      loadedQuestion.correct_answer
    );

    return formattedQuestion;
  });
};
