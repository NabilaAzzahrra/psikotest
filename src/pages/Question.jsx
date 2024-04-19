import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkTokenExpiration } from '../middlewares/middleware';
import Lottie from "lottie-react";
import Loader from './components/Loader';
import backgroundImage from "../assets/img/bg1.png";
import questionImage from "../assets/img/question.json";
import nextImage from "../assets/img/naxt.json";
import doneImage from "../assets/img/done.json";
import { useNavigate } from 'react-router-dom';

function Question() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [answer, setAnswer] = useState('');
    const [jenisKecerdasan, setJenisKecerdasan] = useState(null);
    const [loader, setLoader] = useState(false);
    const [user, setUser] = useState({});

    const navigate = useNavigate();

    const getUser = async () => {
        checkTokenExpiration();
        const token = localStorage.getItem('token');
        await axios.get(`https://database.politekniklp3i-tasikmalaya.ac.id/api/auth/psikotest/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response.data)
                setUser(response.data.user);
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    return navigate('/');
                } else {
                    console.log(error.response.data.message);
                }
            });
    }

    const getQuestions = async () => {
        checkTokenExpiration();
        await axios.get("http://localhost:3000/questions")
        .then((response) => {
            setQuestions(response.data);
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const getResult = async () => {
        await axios.get(`http://localhost:3000/hasils/${user.id}`)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    const fetchData = async (identity) => {
        setLoader(true)
        setLoading(true);
        
        try {
            const response = await axios.get("http://localhost:3000/questions");
            console.log(user.id);
            // const hasilResponse = await axios.get(`http://localhost:3000/hasils/${identity}`);
            // setJenisKecerdasan(hasilResponse.data.jenis_kecerdasan);
            // setTimeout(() => {
            //     setLoader(false);
            // }, 1000);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getUser();
        getQuestions();
        bucketQuestion();
        checkTokenExpiration();
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
                user: user.id
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
                user: user.id
            };
            bucket.push(data);
            localStorage.setItem('bucket', JSON.stringify(bucket));
            setAnswer('');
            setSelectedOption(null);

            await axios.post("http://localhost:3000/tests", {
                answers: bucket,
            })
            .then((response) => {
                console.log(response);
                console.log('asup');
                getResult();
            })
            .catch((error) => {
                console.log(error);
            });
        }

        setLoading(true);

        try {
            

            setLoading(false);
            const hasilResponse = await axios.get(`http://localhost:3000/hasils/${user.id}`);
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
                        <div className="p-6 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                            Selamat! Kecerdasan Kamu Adalah "{jenisKecerdasan}". <a href='/hasil'>Ketuk untuk melihat lebih banyak..</a>
                        </div>
                    </div>
                ) : (
                    <div>

                        <div className='text-xl font-bold p-4 rounded-3xl m-4 flex justify-center'>
                            <div className="flex items-center">
                                <Lottie animationData={questionImage} loop={true} className='h-40' />
                                QUESTION {currentQuestion + 1}
                            </div>
                        </div>
                        <div className='bg-orange-100 bg-opacity-50 w-[1000px] text-center p-4 rounded-xl shadow-lg -mt-10'>
                            <div className="">
                                <p className="text-black items-center" style={{ fontFamily: 'Poppins' }}>{questions[currentQuestion]?.question}</p>
                            </div>
                        </div>
                        <div className='flex justify-between w-[1000px] p-4 mt-4'>
                            <label>
                                <input type="radio" name="option" value="4" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 1} />
                                <div className='bg-white p-4 cursor-pointer flex items-center gap-5 rounded-full border-2 hover:bg-black hover:text-white border-black' style={{ fontFamily: 'Poppins' }}>
                                    Gue Banget
                                    <div className='text-xl rounded-full'>🤙</div>
                                </div>
                            </label>
                            <label>
                                <input type="radio" name="option" value="3" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 2} />
                                <div className='bg-white p-4 cursor-pointer flex items-center gap-5 rounded-full border-2 hover:bg-black hover:text-white border-black' style={{ fontFamily: 'Poppins' }}>
                                    Pas di Gue Sih
                                    <div className='text-xl rounded-full'>👌</div>
                                </div>
                            </label>
                            <label>
                                <input type="radio" name="option" value="2" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 3} />
                                <div className='bg-white p-4 cursor-pointer flex items-center gap-5 rounded-full border-2 hover:bg-black hover:text-white border-black' style={{ fontFamily: 'Poppins' }}>
                                    Bukan Gue
                                    <div className='text-xl rounded-full'>👋</div>
                                </div>
                            </label>
                            <label>
                                <input type="radio" name="option" value="1" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 4} />
                                <div className='bg-white p-4 cursor-pointer flex items-center gap-5 rounded-full border-2 hover:bg-black hover:text-white border-black' style={{ fontFamily: 'Poppins' }}>
                                    Bukan Gue Banget
                                    <div className='text-xl rounded-full'>👎</div>
                                </div>
                            </label>
                        </div>

                    </div>
                )}

                {selectedOption !== null && (
                    <div className='flex justify-center w-[1000px]'>
                        {isLastQuestion ? (
                            loading ? (
                                <div className="bg-emerald-400 m-4 px-4 py-2 rounded-xl opacity-0 cursor-not-allowed flex items-center gap-3" style={{ fontFamily: 'Poppins' }}>
                                    Selesai
                                    <Lottie animationData={doneImage} loop={true} className='h-7' />
                                </div>
                            ) : (
                                <div className='bg-emerald-400 m-4 px-4 py-2 rounded-xl flex items-center gap-3' onClick={handleFinish} style={{ fontFamily: 'Poppins' }}>
                                    Selesai
                                    <Lottie animationData={doneImage} loop={true} className='h-7' />
                                </div>
                            )
                        ) : (
                            <a href="#">
                                <div className='bg-yellow-400 m-4 px-4 py-2 flex items-center gap-3 rounded-full hover:bg-yellow-500' style={{ fontFamily: 'Poppins' }} onClick={handleNextQuestion}>
                                    Next
                                    <Lottie animationData={nextImage} loop={true} className='h-7' />
                                </div>
                            </a>
                        )}
                    </div>
                )}
            </div>
            <div className='bg-[#f5f4f2] p-6 -mt-[80px] text-center font-bold text-[18px]' style={{ fontFamily: 'Poppins' }}>
                <marquee>Tidak ada jawaban ‘benar’ atau ‘salah’ disini, jadilah dirimu sendiri ketika mengisi jawaban</marquee>
            </div>
        </div>
    )
}

export default Question;
