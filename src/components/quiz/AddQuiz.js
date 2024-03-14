import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postQuiz } from '../../redux/actions/quizActions';
import { useParams } from 'react-router-dom';
import SearchByWord from '../Quransearch/SearchByWord';
import { generateQuiz } from '../../redux/actions/search';
import QuizComponent from './QuizComponent';

const QuizForm = () => {

  const dispatch = useDispatch();
  const generatedquizData = useSelector((state) => state.search.results);
  // console.log(generatedquizData.QuizOptions);
  const addedQuiz = useSelector((state) => state.addedQuiz);
  const { courseid } = useParams();
  const [totalMarks, setTotalMarks] = useState(0);
  useEffect(() => {
    // Reset form fields when addedQuiz is successful
    if (addedQuiz) {
      setTimeout(() => {
        setQuizData({
          title: '',
          timeLimit: 0,
          passingScore: 0,
          questions: [],
        });
        setTotalMarks(0);
      }, 0);
    }
  }, [addedQuiz]);


  const initialQuestionState = {
    text: '',
    options: ['', '', '', ''],
    correctOption: 0,
    marks: 5,
  };

  const [quizData, setQuizData] = useState({
    title: '',
    timeLimit: 0,
    passingScore: 0,
    questions: [],
  });

  const [question, setQuestion] = useState({ ...initialQuestionState });

  const handleQuestionChange = (event) => {
    const { name, value } = event.target;
    setQuestion({
      ...question,
      [name]: value,
    });
    if (name === 'marks') {
      const updatedTotalMarks = quizData.questions.reduce((total, q) => total + q.marks, 0);
      setTotalMarks(updatedTotalMarks);
    }
  };

  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const toggleQuestion = (index) => {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter((item) => item !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  };

  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  // Function to handle editing a question
  const handleEditQuestion = (index) => {
    setEditingQuestionIndex(index);
    const editedQuestion = quizData.questions[index];
    setQuestion({
      text: editedQuestion.text,
      options: editedQuestion.options.map(option => option.option),
      correctOption: editedQuestion.correctOption,
      marks: editedQuestion.marks,
    });

    // Remove the edited question from quizData.questions
    const updatedQuestions = [...quizData.questions];
    updatedQuestions.splice(index, 1);
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };


  // Function to handle removing a question
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({
      ...quizData,
      questions: updatedQuestions,
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    setQuestion({
      ...question,
      options: updatedOptions,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setQuizData({
      ...quizData,
      [name]: name === 'passingScore' || name === 'timeLimit' ? parseInt(value) : value,
    });
  };

  const handleAddQuestion = () => {
    if (question.text.trim() === '' || question.options.some((option) => option.trim() === '')) {
      // Do not add the question if any of the fields are empty
      return;
    }

    // Create formatted options array
    const optionsArray = question.options.slice(0, 4).map((option) => ({ option }));

    if (generatedquizData.QuizOptions && generatedquizData.QuizOptions.length > 0) {
      // Add QuizOptions to the optionsArray, taking only the first four
      generatedquizData.QuizOptions.slice(0, 4).forEach((option) => {
        optionsArray.push({ option: option.meaning });
      });
    }

    // const optionsArray = generatedquizData.QuizOptions.map((option, index) => option.meaning);
    // console.log(optionsArray.option);

    // Create new question object in the correct format
    const newQuestion = {
      text: question.text,
      options: optionsArray,
      correctOption: question.correctOption,
      marks: parseInt(question.marks), // Ensure marks is treated as a number
    };

    // Calculate total marks for all questions, including the new question
    // const newTotalMarks = quizData.questions.reduce((total, q) => total + q.marks, 0) + newQuestion.marks;

    // Use the functional form of setQuizData to ensure the latest state
    setQuizData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, newQuestion],
    }));

    // Reset the question input fields for the next question
    setQuestion({ ...initialQuestionState });
    const newTotalMarks = quizData.questions.reduce((total, q) => total + q.marks, 0) + newQuestion.marks;

    // Update the total marks
    setTotalMarks(newTotalMarks);
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if there are any questions before submitting the quiz
    if (quizData.questions.length === 0) {
      alert('Please add at least one question before submitting the quiz.');
      return;
    }

    await dispatch(postQuiz(courseid, quizData));

    // Reset form fields when addedQuiz is successful
    setQuizData({
      title: '',
      timeLimit: 0,
      passingScore: 0,
      questions: [],
    });
    setTotalMarks(0);
  };


  if (addedQuiz) {
    // Handle successful quiz addition, e.g., redirect to a success page.
    return <div>Quiz added successfully!</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl p-4">
      <QuizComponent />
      <div className="mb-4">
        <label className="block font-medium mb-1">Title:</label>
        <input
          type="text"
          name="title"
          value={quizData.title}
          onChange={handleInputChange}
          required
          className="w-full border rounded py-2 px-3"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Time Limit (minutes):</label>
        <input
          type="number"
          name="timeLimit"
          value={quizData.timeLimit}
          onChange={handleInputChange}
          required
          className="w-full border rounded py-2 px-3"
          min="0"
        />

      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Total Marks: {totalMarks}</h3>
        <h3 className="text-lg font-medium mb-2">Add Questions:</h3>
        {quizData.questions.map((q, index) => (
          <div key={index} className="border rounded p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-medium">
                Question {index + 1}{' '}
                <span className="text-lg ml-2" onClick={() => toggleQuestion(index)}>
                  {expandedQuestions.includes(index) ? '▼' : '▶'}
                </span>
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                  onClick={() => handleEditQuestion(index)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove
                </button>
              </div>
            </div>
            {expandedQuestions.includes(index) && (
              <div className="ml-8">
                <p className="text-gray-800 mb-2">{q.text}</p>
                <ul className="list-disc pl-6 mb-2">
                  {q.options.map((option, optionIndex) => (
                    <li key={optionIndex} className="text-gray-600">
                      {option.option}
                    </li>
                  ))}
                </ul>
                <p className="text-green-500 font-medium">
                  Correct Option: {q.options[q.correctOption].option}
                </p>
                <p className="text-blue-500 font-medium">Marks: {q.marks}</p>
              </div>
            )}
          </div>
        ))}

        <label className="block font-medium mb-1">Question Title:</label>
        <input
          type="text"
          name="text"
          placeholder="Enter question text"
          value={question.text}
          onChange={handleQuestionChange}
          className="w-full border rounded py-2 px-3 mb-2"
        />
        <label className="block font-medium mb-1">Options:</label>


        {generatedquizData.QuizOptions && generatedquizData.QuizOptions.length > 0 ? (
          <>
            {/* <label className="block font-medium mb-1">Options:</label> */}
            {generatedquizData.QuizOptions.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.meaning}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full border rounded py-2 px-3 mb-2"
              />
            ))}
          </>
        ) : (
          <>
            <label className="block font-medium mb-1">Options:</label>
            {question.options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full border rounded py-2 px-3 mb-2"
              />
            ))}
          </>
        )}

      <label className="block font-medium mb-1">Correct Option:</label>
<select
  name="correctOption"
  value={generatedquizData.correctOption}
  onChange={handleQuestionChange}
  className="w-full border rounded py-2 px-3 mb-2"
>
  {generatedquizData?.QuizOptions?.length > 0 ? (
    generatedquizData?.QuizOptions?.map((option, index) => (
      <option key={index} value={index}>
        {option.meaning}
      </option>
    ))
  ) : (
    question.options.map((option, index) => (
      <option key={index} value={index}>
        {option}
      </option>
    ))
  )}
</select>

        <label className="block font-medium mb-1">Question Marks:</label>
        <input
          type="number"
          name="marks"
          placeholder="Marks for this question"
          value={question.marks}
          onChange={handleQuestionChange}
          className="w-full border rounded py-2 px-3 mb-2"
          min="0"
        />
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Add Question
        </button>
        <div className="mb-4">
          <label className="block font-medium mb-1">Passing Score:</label>
          <input
            type="number"
            name="passingScore"
            value={quizData.passingScore}
            onChange={handleInputChange}
            required
            className="w-full border rounded py-2 px-3"
            min="0"
          />
        </div>




      </div>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4"
      >
        Submit Quiz
      </button>
    </form>
  );
};

export default QuizForm;
