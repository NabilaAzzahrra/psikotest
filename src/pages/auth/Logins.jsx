import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkTokenExpiration, forbiddenAccess } from '../../middlewares/middleware';
import backgroundImage from "../../assets/img/bg1.png";

function Logins() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const loginFunc = async (e) => {
        e.preventDefault();
        await axios.post(`https://database.politekniklp3i-tasikmalaya.ac.id/api/auth/psikotest/login`, {
            email: email,
            password: password
        })
            .then((response) => {
                localStorage.setItem('token', response.data.access_token)
                alert(response.data.message)
                navigate('/home')
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    return alert(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
    }

    useEffect(() => {
        checkTokenExpiration();
        forbiddenAccess();
    }, []);

    const handleRegisterClick = () => {
        navigate('/register'); // Mengarahkan ke halaman registrasi saat tombol "REGISTER" diklik
    }

    return (
        <div className='relative'>
            <div className='bg-white h-screen relative flex flex-col justify-center items-center' style={{
                backgroundImage: `url(${backgroundImage})`,
            }}>
                <div className='bg-white p-6 shadow-xl rounded-t-xl w-[500px] border-b-2 border-gray-400'>
                    <div className='flex justify-between gap-5'>
                        <img src="src/assets/img/logo-lp3i.png" alt='logo lp3i' className='h-10' />
                        <img src="src/assets/img/tagline-warna.png" alt='logo lp3i' className='h-10' />
                    </div>
                </div>
                <div className='bg-white py-2 px-6 pb-6 shadow-xl rounded-b-xl w-[500px]'>
                    <form class="w-full mx-auto" onSubmit={loginFunc}>
                        <div class="mb-2">
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Masukkan email di sini...' required />
                        </div>
                        <div class="mb-5">
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Masukkan password di sini...' required />
                        </div>
                        <div className="flex justify-between">
                            <button type="submit" class=" bg-sky-400 hover:bg-black text-white hover:text-white border-white hover:border-gray-950 border-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">MASUK</button>
                            <button onClick={handleRegisterClick} type="submit" class="bg-yellow-300 hover:bg-black text-black hover:text-white border-white border-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">DAFTAR</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Logins
