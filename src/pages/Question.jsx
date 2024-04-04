import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import Loader from './components/Loader';
import backgroundImage from "../assets/img/bg1.png";
import questionImage from "../assets/img/question.json";

function Question() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [answer, setAnswer] = useState('');
    const [jenisKecerdasan, setJenisKecerdasan] = useState(null);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoader(true)
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:3000/questions");
                setQuestions(response.data);

                const hasilResponse = await axios.get("http://localhost:3000/hasils/201702102");
                setJenisKecerdasan(hasilResponse.data.jenis_kecerdasan);
                setTimeout(() => {
                    setLoader(false);
                }, 6000);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
            setLoading(false);
        };

        fetchData();
        bucketQuestion();
    }, []);

    useEffect(() => {
        const bucket = localStorage.getItem('bucket');
        if (bucket) {
            const parsedData = JSON.parse(bucket);
            if (parsedData.length > 0) {
                const lastData = parsedData[parsedData.length - 1];
                setCurrentQuestion(lastData.question);
            }
        }
    }, [questions]);

    const bucketQuestion = () => {
        let bucket = localStorage.getItem('bucket') || '[]';
        bucket = JSON.parse(bucket);
        if (bucket.length > 0) {
            const lastData = bucket[bucket.length - 1];
            setSelectedOption(lastData.answer);
        }
    };

    const handleNextQuestion = () => {
        if (selectedOption !== null) {
            let bucket = localStorage.getItem('bucket') || '[]';
            bucket = JSON.parse(bucket);
            let data = {
                question: currentQuestion + 1,
                id_question: questions[currentQuestion].id,
                answer: answer,
                user: 201702102
            };
            bucket.push(data);
            localStorage.setItem('bucket', JSON.stringify(bucket));
            setAnswer('');
            setSelectedOption(null);
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleOptionSelect = (event) => {
        setSelectedOption(event.target.value);
        setAnswer(event.target.value);
    };

    const handleFinish = async () => {
        if (selectedOption !== null) {
            let bucket = localStorage.getItem('bucket') || '[]';
            bucket = JSON.parse(bucket);
            let data = {
                question: currentQuestion + 1,
                id_question: questions[currentQuestion].id,
                answer: answer,
                user: 201702102
            };
            bucket.push(data);
            localStorage.setItem('bucket', JSON.stringify(bucket));
            setAnswer('');
            setSelectedOption(null);
        }

        setLoading(true);

        try {
            const bucket = localStorage.getItem('bucket');
            const bucketParse = JSON.parse(bucket);

            console.log(bucketParse);
            const response = await axios.post("http://localhost:3000/tests", {
                answers: bucketParse,
            });
            console.log('Response from backend:', response.data);

            setLoading(false);
            const hasilResponse = await axios.get("http://localhost:3000/hasils/201702102");
            setJenisKecerdasan(hasilResponse.data.jenis_kecerdasan);
            setFinished(true);
        } catch (error) {
            console.error('Error submitting answers:', error);
            setLoading(false);
        }
    };

    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
        }}>
            <div className='bg-black font-bold font-arial text-[40px] justify-center items-center text-white p-6 text-center -mb-[110px]'>
                TES KECERDASAN GANDA
            </div>
            <div className='relative flex flex-col justify-center items-center min-h-screen'>
                {
                    loader && <Loader />
                }
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">Loading...</div>
                    </div>
                )}
                {finished ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                            Selamat! Kecerdasan Kamu Adalah "{jenisKecerdasan}".
                        </div>
                    </div>
                ) : (
                    <div>

                        <div className='text-xl font-bold p-4 rounded-3xl m-4'>
                            <div className="flex items-center">
                                <Lottie animationData={questionImage} loop={true} className='h-40' />
                                QUESTION {currentQuestion + 1}
                            </div>
                        </div>
                        <div className='bg-red-500 w-[1000px] text-center p-4 rounded-xl'>
                            <div className="mb-4">
                                <p className="text-white">{questions[currentQuestion]?.question}</p>
                            </div>
                        </div>
                        <div className='flex justify-between w-[1000px] p-4'>
                            <label>
                                <input type="radio" name="option" value="1" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 1} />
                                <div className='bg-gray-500 p-2 cursor-pointer'>Gue Banget</div>
                            </label>
                            <label>
                                <input type="radio" name="option" value="2" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 2} />
                                <div className='bg-gray-500 p-2 cursor-pointer'>Pas di Gue Sih</div>
                            </label>
                            <label>
                                <input type="radio" name="option" value="3" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 3} />
                                <div className='bg-gray-500 p-2 cursor-pointer'>Bukan Gue</div>
                            </label>
                            <label>
                                <input type="radio" name="option" value="4" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 4} />
                                <div className='bg-gray-500 p-2 cursor-pointer'>Bukan Gue Banget</div>
                            </label>
                        </div>

                    </div>
                )}

                {selectedOption !== null && (
                    <div className='flex justify-between w-[1000px]'>
                        {isLastQuestion ? (
                            loading ? (
                                <div className="bg-emerald-400 m-4 p-2 rounded-xl opacity-0 cursor-not-allowed">
                                    Selesai
                                </div>
                            ) : (
                                <div className='bg-emerald-400 m-4 p-2 rounded-xl' onClick={handleFinish}>
                                    Selesai
                                </div>
                            )
                        ) : (
                            <div className='bg-emerald-400 m-4 p-2 rounded-xl' onClick={handleNextQuestion}>
                                Next
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className='bg-[#f5f4f2] p-6 -mt-[80px] text-center font-bold text-[20px]'>
                <marquee>Tidak ada jawaban ‘benar’ atau ‘salah’ disini, jadilah dirimu sendiri ketika mengisi jawaban</marquee>
            </div>
        </div>
    )
}

export default Question;
