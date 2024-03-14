import api from "../utils/api"
import { SEARCH_QURAN_REQUEST, SEARCH_QURAN_SUCCESS, SEARCH_QURAN_FAILURE, GENERATE_QUIZ_REQUEST,GENERATE_QUIZ_SUCCESS,GENERATE_QUIZ_FAILURE } from "../const"

// actions.js


export const searchQuranRequest = () => ({
    type: SEARCH_QURAN_REQUEST,
});

export const searchQuranSuccess = (data) => ({
    type: SEARCH_QURAN_SUCCESS,
    payload: data,
});

export const searchQuranFailure = (error) => ({
    type: SEARCH_QURAN_FAILURE,
    payload: error,
});

export const generateQuizRequest = () => ({
  type: GENERATE_QUIZ_REQUEST,
});

export const generateQuizSuccess = (data) => ({
  type: GENERATE_QUIZ_SUCCESS,
  payload: data,
});

export const generateQuizFailure = (error) => ({
  type: GENERATE_QUIZ_FAILURE,
  payload: error,
});



// actionCreators.js

export const searchQuran = (query, author, translation) => {
    const arabicText = query;
    const encodedArabicText = encodeURIComponent(arabicText);
    return (dispatch) => {
      dispatch(searchQuranRequest());
  
      api.get(`/quran/search?author=${author}&translation=${translation}&query=${encodedArabicText}`)
        .then((response) => {
          const quizData = response.data;
          dispatch(searchQuranSuccess(quizData));
          console.log(quizData);
        })
        .catch((error) => {
          dispatch(searchQuranFailure(error.message));
        });
    };
  };

  export const generateQuiz = (query) => {
    const arabicText = query;
    const encodedArabicText = encodeURIComponent(arabicText);
    return (dispatch) => {
      dispatch(generateQuizRequest());
  
      api.get(`/quran/search/quiz?query=${encodedArabicText}`)
        .then((response) => {
          const quizData = response.data;
          dispatch(generateQuizSuccess(quizData));
          // console.log(quizData);
        })
        .catch((error) => {
          dispatch(generateQuizFailure(error.message));
        });
    };
  };
  

