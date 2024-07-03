import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pagination, Spin } from 'antd';

import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import Button from '../button/Button';
import Dropdowns from '../Dropdown/Dropdowns';
import Dropdown from '../Dropdown/Dropdown';
import '../../constants/fonts.css';

const Reading = () => {
    const [surahRea, setSurahRea] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('english_saheeh');
    const [selectedSurahNumber, setSelectedSurahNumber] = useState("");
    const [selectedSurahName, setSelectedSurahName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // Number of verses per page
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const surahNumber = queryParams.get('surahNumber');
        setSelectedSurahNumber(Number(surahNumber));
    }, [location]);

    useEffect(() => {
        if (selectedSurahNumber) {
            setIsLoading(true);
            fetch(`https://quranenc.com/api/v1/translation/sura/${selectedAuthor}/${selectedSurahNumber}`)
                .then((res) => res.json())
                .then((data) => {
                    setSurahRea(data.result);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [selectedSurahNumber, selectedAuthor]);

    const handlePreviousSurah = () => {
        if (selectedSurahNumber > 1) {
            navigate(`?surahNumber=${selectedSurahNumber - 1}`);
        }
    };
    
    const handleNextSurah = () => {
        if (selectedSurahNumber < 114) { // Assuming there are 114 surahs
            navigate(`?surahNumber=${selectedSurahNumber + 1}`);
        }
    };
    
    const handleAuthorSelect = (authorName) => {
        setSelectedAuthor(authorName);
    };

    const handleSurahSelect = (surahNumber, surahName) => {
        setSelectedSurahNumber(surahNumber);
        setSelectedSurahName(surahName);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedVerses = surahRea.slice(startIndex, startIndex + pageSize);

    return (
        <>
            <Navbar />
            <Header />
            <div className='flex justify-center'>
                <div className='flex hidden md:block w-1/6 sticky top-0 h-screen bg-white shadow-lg mr-44'>
                    <Dropdown onSurahSelect={handleSurahSelect} />
                </div>

                <div className='flex flex-col w-4/6 mt-10'>
                    <Dropdowns onAuthorSelect={handleAuthorSelect} />

                    <div className='flex justify-center items-center mt-6'>
                        <span className="font-[CustomFontName] text-4xl">{selectedSurahName}</span>
                    </div>
                    <div className='flex w-full bg-white mt-10'>
                        <div className='flex flex-col w-full bg-white mt-10 md:flex-row md:items-center md:justify-between'>
                            <div className='mb-4 md:mb-0 md:mr-4'>
                                <span className='text-base md:text-lg'>{`Translation By ${selectedAuthor}`}</span>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center w-full h-40">
                            <Spin size="large" />
                        </div>
                    ) : (
                        paginatedVerses.map((verse) => (
                            <div key={verse.id} className='flex flex-col justify-center items-center w-full bg-white shadow-md mt-10 border border-gray-200'>
                                <p className='m-8 leading-[3rem] font-[CustomFontName] text-3xl tracking-wide'>
                                    {verse.arabic_text}
                                </p>
                                <p className='m-8 leading-[3rem] font-[CustomFontName] text-3xl tracking-wide'>
                                    {verse.translation}
                                </p>

                                {verse.footnotes && (
                                    <p className='m-8 leading-[3rem] font-[CustomFontName] text-3xl tracking-wide'>
                                        Explanation
                                        {verse.footnotes}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                    <div className='flex justify-center w-full mt-10'>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={surahRea.length}
                            onChange={handlePageChange}
                        />
                    </div>
                    <div className='flex justify-between items-center w-full mt-20'>
                        <Button name="Previous" onClick={handlePreviousSurah} />
                        <Button name="Next Surah" onClick={handleNextSurah} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reading;
