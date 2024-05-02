import React, { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import awanLp3i from "../assets/img/awan-lp3i.json";
import logoLp3i from '../assets/img/logo-lp3i.png'
import logoTagline from '../assets/img/tagline-warna.png'
import { checkTokenExpiration } from '../middlewares/middleware';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Home() {
    const [user, setUser] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
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
                setUser(response.data.user);
                getResult(response.data.user.id);
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    return navigate('/');
                } else {
                    console.log(error.response.data.message);
                }
            });
    }

    const getResult = async (id) => {
        await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/kecerdasan/hasils/${id}`)
            .then((response) => {
                setResult(response.data);
                setError(false);
                setLoading(false);
            })
            .catch((error) => {
                if (error.code == 'ERR_NETWORK') {
                    setError(true);
                    setLoading(false);
                }
            });
    }

    const logoutFunc = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('bucket');
        navigate('/');
    }

    useEffect(() => {
        getUser();
        checkTokenExpiration();
    }, []);

    return (
        <section className='bg-white h-screen relative bg-cover'>
            <main className='container mx-auto flex flex-col justify-center items-center h-screen px-5 gap-5'>
                <div className='flex justify-between gap-5 mb-10'>
                    <img src={logoLp3i} alt='logo lp3i' className='h-14' />
                    <img src={logoTagline} alt='logo lp3i' className='h-12' />
                </div>
                <div className=''>
                    <Lottie animationData={awanLp3i} loop={true} className='h-52' />
                </div>
                <div className='text-center space-y-5'>
                    <h2 className='uppercase font-bold text-5xl'>
                        Tes Kecerdasan Ganda
                    </h2>
                    <p className='text-base'>Kita akan menjadi paling bahagia dan sukses ketika belajar, berkembang, dan bekerja dengan cara yang paling baik memanfaatkan kecerdasan alami kita (dengan kata lain, kekuatan, gaya, dan jenis otak kita masing-masing). Dengan demikian, indikator ini membantu Anda menetapkan fokus pada jenis pembelajaran dan pekerjaan yang paling membahagiakan dan paling bermanfaat bagi Anda sendiri.</p>
                </div>
                {
                    loading ? (
                        <p className='text-gray-900 text-sm'>Loading...</p>
                    ) : (
                        error ? (
                            <div className='text-center space-y-3'>
                                <div className='border-2 border-red-500 text-base bg-red-500 rounded-xl text-white px-5 py-3'>
                                    <p>Mohon maaf, server sedang tidak tersedia.</p>
                                </div>
                                <button type="button" onClick={logoutFunc} className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm'><i className="fa-solid fa-right-from-bracket"></i> Keluar</button>
                            </div>
                        ) : (
                            result ? (
                                <div className='text-center space-y-3'>
                                    <div className='border-2 border-gray-900 text-base hover:bg-gray-900 hover:text-white px-5 py-3'>
                                        <p>
                                            <span>Nama Lengkap: </span>
                                            <span className='font-bold underline'>{user.name}</span>
                                        </p>
                                        <p>
                                            <span>Jenis Kecerdasan Anda: </span>
                                            <span className='font-bold underline'>{result.jenis_kecerdasan}</span>
                                        </p>
                                    </div>
                                    <button type="button" onClick={logoutFunc} className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm'><i className="fa-solid fa-right-from-bracket"></i> Keluar</button>
                                </div>
                            ) : (
                                <a href={`/question`} className='border-2 border-gray-900 text-base uppercase font-bold hover:bg-gray-900 hover:text-white px-5 py-2'>
                                    <span>Mulai</span>
                                </a>
                            )
                        )
                    )
                }
            </main>
        </section>
    )
}

export default Home
