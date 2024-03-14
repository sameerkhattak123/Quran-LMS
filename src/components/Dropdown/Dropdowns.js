import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Dropdown = ({ onAuthorSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef(null);

  const fetchTranslations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://quranenc.com/api/v1/translations/list');
      setTranslations((prevTranslations) => [...prevTranslations, ...response.data.translations]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTranslations();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTranslations([]); // Clear translations when dropdown is opened
    }
  };

  const handleAuthorSelection = (authorName) => {
    setSelected(authorName);
    setIsOpen(false);
    onAuthorSelect(authorName);
  };

  const handleScroll = () => {
    const element = listRef.current;
    if (
      element.scrollTop + element.clientHeight >= element.scrollHeight &&
      !isLoading
    ) {
      fetchTranslations();
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTranslations = translations.filter((translation) =>
  translation.title && typeof translation.title === 'string' &&
  translation.title.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="relative inline-block text-left">
      <div>
        <h1>Translation</h1>
        <button
          type="button"
          className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={toggleDropdown}
        >
          {selected || 'Select Translation'}
        </button>
      </div>
      {isOpen && (
        <div
          className="absolute mt-2 w-56 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-y-auto max-h-56"
          ref={listRef}
          onScroll={handleScroll}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <input
              type="text"
              placeholder="Search translations"
              className="px-4 py-2 border border-gray-300 rounded-md mb-2"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            {filteredTranslations.map((translation) => (
              <li
                key={translation.key}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                role="menuitem"
                onClick={() => handleAuthorSelection(translation.key)}
              >
                {translation.title}
              </li>
            ))}
            {isLoading && <p>Loading...</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

