import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkTokenExpiration } from '../middlewares/middleware';
import { jwtDecode } from "jwt-decode";
import Lottie from "lottie-react";
import questionImage from "../assets/img/question.json";
import { useNavigate } from 'react-router-dom';

function Question() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});

    const navigate = useNavigate();

    const getUser = async () => {
        checkTokenExpiration()
            .then(async (response) => {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);

                const userId = decoded.id;
                const userName = decoded.name;
                const userEmail = decoded.email;
                const userPhone = decoded.phone;
                const userStatus = decoded.status;

                const data = {
                    id: userId,
                    name: userName,
                    email: userEmail,
                    phone: userPhone,
                    status: userStatus
                }

                setUser(data);
                getResult(data);
            })
            .catch((error) => {
                navigate('/')
            });
    }

    const getQuestions = async () => {
        checkTokenExpiration()
            .then(async (response) => {
                console.log(response);
                await axios.get("https://api.politekniklp3i-tasikmalaya.ac.id/kecerdasan/questions")
                    .then((response) => {
                        setQuestions(response.data);
                    })
                    .catch((error) => {
                        navigate('/');
                    });
            })
            .catch((error) => {
                navigate('/')
            });

    }

    const getResult = async (data) => {
        await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/kecerdasan/hasils/${data.id}`)
            .then((response) => {
                const data = response.data;
                if (data.length > 0) {
                    navigate('/result');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        checkTokenExpiration()
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                navigate('/')
            });
        getUser();
        getQuestions();
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

    const handleNextQuestion = (answer) => {
        setLoading(true);
        let bucket = localStorage.getItem('bucket') || '[]';
        const questionLength = questions.length;
        bucket = JSON.parse(bucket);
        if (currentQuestion + 1 === questionLength) {
            handleFinish(answer);
        } else {
            console.log(questions);
            let data = {
                question: currentQuestion + 1,
                id_question: questions[currentQuestion].id,
                answer: answer,
                user: user.id
            };
            bucket.push(data);
            localStorage.setItem('bucket', JSON.stringify(bucket));
            setSelectedOption(null);
            setCurrentQuestion(currentQuestion + 1);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const handleOptionSelect = (event) => {
        handleNextQuestion(event.target.value);
    };

    const handleFinish = async (answer) => {
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
        await axios.post("https://api.politekniklp3i-tasikmalaya.ac.id/kecerdasan/tests", {
            answers: bucket,
        })
            .then((response) => {
                localStorage.removeItem('bucket');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/result')
                }, 1000);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    return (
        <main className='flex flex-col justify-between md:h-screen'>
            <header className='bg-black p-3'>
                <h2 className='text-md md:text-2xl font-bold text-white text-center'>TES KECERDASAN GANDA</h2>
            </header>
            <section className='flex flex-col justify-center items-center gap-5'>
                {loading &&
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="px-5 py-2 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse">Menyimpan jawaban...</div>
                    </div>
                }
                <div className='max-w-5xl space-y-1 md:space-y-5'>
                    <div className='text-md font-bold rounded-3xl flex justify-center'>
                        <div className="flex items-center">
                            <Lottie animationData={questionImage} loop={true} className='h-40' />
                            QUESTION {currentQuestion + 1} / {questions.length}
                        </div>
                    </div>
                    <div className='bg-gray-100 p-4 mx-5 rounded-xl'>
                        <p className='text-center text-gray-900'>{questions[currentQuestion]?.question}</p>
                    </div>
                    <div className='flex flex-col md:flex-row md:items-center justify-center gap-5 md:gap-10 p-4'>
                        <label>
                            <input type="radio" name="option" value="4" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 1} />
                            <div className='flex text-[15px] justify-center bg-white px-4 py-2 cursor-pointer flex items-center gap-2 rounded-full border-2 sm:hover:bg-black sm:hover:text-white border-black'>
                                Gue Banget
                                <div className='text-xl rounded-full'>👍</div>
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="option" value="3" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 2} />
                            <div className='flex text-[15px] justify-center bg-white px-4 py-2 cursor-pointer flex items-center gap-2 rounded-full border-2 sm:hover:bg-black sm:hover:text-white border-black'>
                                Pas di Gue Sih
                                <div className='text-xl rounded-full'>👌</div>
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="option" value="2" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 3} />
                            <div className='flex text-[15px] justify-center bg-white px-4 py-2 cursor-pointer flex items-center gap-2 rounded-full border-2 sm:hover:bg-black sm:hover:text-white border-black'>
                                Bukan Gue
                                <div className='text-xl rounded-full'>👋</div>
                            </div>
                        </label>
                        <label>
                            <input type="radio" name="option" value="1" onClick={handleOptionSelect} className='hidden' checked={selectedOption === 4} />
                            <div className='flex text-[15px] justify-center bg-white px-4 py-2 cursor-pointer flex items-center gap-2 rounded-full border-2 sm:hover:bg-black sm:hover:text-white border-black'>
                                Bukan Gue Banget
                                <div className='text-xl rounded-full'>👎</div>
                            </div>
                        </label>
                    </div>
                    <div>
                        <p className='text-xs text-center px-6 xl:text-md'>© A Chapman and V Chislett MSc 2005, diambil dari <span className='italic'>Gardner's Multiple Intelligences Model</span>. From <span className='italic'>www.businessballs.com</span> dengan item yang telah dimodifikasis. Tidak untuk dijual dan dicetak. Penulis tidak bertanggung-jawab atas pelanggaran hal-hal tersebut.</p>
                    </div>
                </div>
            </section>
            <footer className='hidden md:block'>
                <marquee className="text-sm">Tidak ada jawaban 'benar' atau 'salah' disini, jadilah dirimu sendiri ketika mengisi jawaban</marquee>
            </footer>
        </main>
    )
}

export default Question;