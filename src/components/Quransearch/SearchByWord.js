import React, { useState } from 'react';
import { connect } from 'react-redux';
import { searchQuran } from '../../redux/actions/search';
import Draggable from 'react-draggable';
import VirtualKeyboard from '../VR keyboard/VirtualKeyboard';
import { BsFillKeyboardFill } from 'react-icons/bs';
import '../../constants/fonts.css';

const SearchByWord = ({ searchQuran, ayatData }) => {
  const [query, setQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [toggle, setToggle] = useState(false);
  const [ayatDataVisible, setAyatDataVisible] = useState(true);
  const [selectedTranslation, setSelectedTranslation] = useState('');

  const handleInputChange = (value) => {
    if (value === 'Backspace') {
      setQuery(query.slice(0, -1));
    } else {
      setQuery(query + value);
    }
  };

  const handleSearchClick = () => {
    searchQuran(query, selectedAuthor, selectedTranslation);
  };

  const handleTranslationChange = (e) => {
    setSelectedTranslation(e.target.value);
  };

  const toggleAyatDataVisibility = () => {
    setAyatDataVisible(!ayatDataVisible);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
  };

  const authors = ['MuftiTaqiUsmani', 'MehmoodUlHassan', 'DrMohsinKhan', 'FatehMuhammadJalandhri'];

  return (
    <div className="p-4 relative">
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <BsFillKeyboardFill className='w-10 h-6 cursor-pointer mb-2 sm:mb-0 mr-4' onClick={() => { setToggle(!toggle) }} />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onClick={toggleAyatDataVisibility}
          placeholder="Enter search term"
          className="p-2 border rounded mb-2 sm:mb-0 mr-4"
        />
        <div className='flex flex-col sm:flex-row gap-2'>
          <select
            value={selectedAuthor}
            onChange={handleAuthorChange}
            className="p-2 border rounded mb-2 sm:mb-0"
          >
            <option value="">Select Author</option>
            {authors.map((author, index) => (
              <option key={index} value={author}>
                {author}
              </option>
            ))}
          </select>
          <select
            value={selectedTranslation}
            onChange={handleTranslationChange}
            className="p-2 border rounded mb-2 sm:mb-0"
          >
            <option value="">Translation</option>
            <option value="TarjumaLafziFahmulQuran">TarjumaLafzi</option>
            {/* Add more translation options if needed */}
          </select>
        </div>
        <button className="p-2 bg-blue-500 text-white rounded ml-2" onClick={handleSearchClick}>Search</button>
      </div>

      {ayatDataVisible && ayatData && ayatData.length > 0 ? (
        <Draggable>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg w-80 max-h-80 overflow-y-auto">
            <button className="absolute top-0 right-0 p-2 cursor-pointer" onClick={toggleAyatDataVisibility}>
              X
            </button>
            {ayatData.map((ayat, index) => (
              <div key={index} className="flex flex-col items-center justify-center border p-2 mb-2 rounded font-[CustomFontName]">
                <p className="w-1/5 bg-orange-100 text-orange-500 text-sm font-bold p-1 rounded-lg">{ayat.SurahNo}:{ayat.AyatNo}</p>
                {/* <p className="text-lg">{ayat.AyatNew}</p> */}
                <p className="text-gray-600">{ayat.MuftiTaqiUsmani}</p>
                <p className="text-gray-600">{ayat.AyatNoAraab}</p>
                {/* <p className="text-gray-600">{ayat.TarjumaLafziDrFarhatHashmi}</p>
                <p className="text-gray-600">{ayat.TarjumaLafziFahmulQuran}</p>
                <p className="text-gray-600">{ayat.TarjumaLafziNazarAhmad}</p> */}
              </div>
            ))}
          </div>
        </Draggable>
      ) : (
        <Draggable>
          <div className="text-center text-red-500 absolute top-0 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg w-80 max-h-80 overflow-y-auto">
            No result found
          </div>
        </Draggable>
      )}

      {toggle && <VirtualKeyboard onKeyPress={handleInputChange} />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ayatData: state.search.results,
});

const mapDispatchToProps = (dispatch) => ({
  searchQuran: (query, author) => dispatch(searchQuran(query, author)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchByWord);
