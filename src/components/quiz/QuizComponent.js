import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateQuiz } from '../../redux/actions/search';

const QuizComponent = () => {
  const dispatch = useDispatch();
//   const quizData = useSelector((state) => state.search.results);
//   console.log(quizData);

  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    setLoading(true);

    try {
      await dispatch(generateQuiz(userInput));
    } catch (error) {
      console.error('Error generating quiz:', error);
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Generate Quiz</h1>

      <input
        type="text"
        placeholder="Enter a word"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="border p-2 mb-4"
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleGenerateQuiz}
        disabled={loading}
      >
        Generate Quiz
      </button>

      {loading && <p className="mt-4">Loading...</p>}

      {/* {quizData && (
        <div className="mt-4">
          <p className="text-xl font-bold mb-2">Quiz Options</p>
          <p>{quizData.AyatNew}</p>

          {quizData.WordsAndMeanings.map((word, index) => (
            <div key={index} className="mb-2">
              <p className="font-bold">{word.word}</p>
              <p>{word.meaning}</p>
            </div>
          ))}

          <p className="text-xl font-bold mb-2">Choose the correct meaning:</p>

          {quizData.QuizOptions.map((option, index) => (
            <div key={index} className="mb-2">
              <input type="radio" name="quizOption" disabled={loading} className="mr-2" />
              <label>{option.meaning}</label>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default QuizComponent;
