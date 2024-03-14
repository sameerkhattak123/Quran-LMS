import React, { useState, useContext } from 'react'
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header'
import Navbar from '../Navbar/Navbar'
// import SIdebar from '../Sidebar/SIdebar'
// import Dropdown from '../Dropdown/Dropdown'
import { useEffect } from 'react'
import Button from '../button/Button'
import '../../constants/fonts.css'
// import { BsDatabaseExclamation } from 'react-icons/bs'
import Dropdowns from '../Dropdown/Dropdowns'
import Dropdown from '../Dropdown/Dropdown'

const Reading = () => {

    const [surahRea, setSurahRea] = useState([]);

    const [selectedAuthor, setSelectedAuthor] = useState('english_saheeh');
    const [selectedSurahNumber, setSelectedSurahNumber] = useState("");
    const [selectedSurahName, setSelectedSurahName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const surahNumber = queryParams.get('surahNumber');
        // const surahName = queryParams.get('surahName');
        setSelectedSurahNumber(Number(surahNumber));
        // setSelectedSurahName(`سُورَةُ ${surahName}`);
    }, [location]);

    useEffect(() => {
        if (selectedSurahNumber) { // Check if selectedSurahNumber is not empty
            setIsLoading(true); // Start loading
            fetch(`https://quranenc.com/api/v1/translation/sura/${selectedAuthor}/${selectedSurahNumber}`)
                .then((res) => res.json())
                .then((data) => {
                    setSurahRea(data.result);
                    console.log('Testing 1', data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setIsLoading(false); // Stop loading regardless of success or error
                });
        }
    }, [selectedSurahNumber,selectedAuthor]);

    const handleAuthorSelect = (authorName) => {
        setSelectedAuthor(authorName);


    };

    const handleSurahSelect = (surahNumber, surahName) => {
        setSelectedSurahNumber(surahNumber);
        setSelectedSurahName(surahName);
    };

    return (

        <>
            <Navbar />
            <Header />
            <div className='flex justify-center'>
                {/* <SIdebar /> */}
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
        <span className="text-gray-500">Loading...</span>
    </div>
) : (
    surahRea &&  surahRea.map((verse) => (
        <div key={verse.id} className='flex flex-col justify-center items-center w-fullS bg-white shadow-md mt-10 border border-gray-200'>
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
                    <div className='flex justify-between items-center w-full mt-20 '>
                        <Button name="Previous" />
                        <Button name="Next Surah" />
                    </div>


                </div>

            </div>
        </>
    )
}

export default Reading