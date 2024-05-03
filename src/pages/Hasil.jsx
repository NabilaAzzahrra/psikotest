import React, { useState, useEffect } from 'react';
import Lottie, { LottiePlayer } from "lottie-react";
import elephantLP3I from "../assets/animations/elephant.json";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../middlewares/middleware';

const Hasil = ({ userId }) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({});
  const [result, setResult] = useState(null);

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
        const data = response.data;
        if (!data) {
          return navigate('/home')
        }
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
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
    <section className='bg-sky-500 h-screen flex flex-col justify-center items-center'>
      <main className='flex flex-col justify-center items-center gap-5'>
        <Lottie animationData={elephantLP3I} loop={true} className='h-52' />
        {
          result ? (
            <header className='text-center space-y-4'>
              <div className='space-y-3'>
                <div className='inline-block text-center bg-sky-600 rounded-2xl px-10 py-4 space-y-2'>
                  <h2 className='text-2xl text-white uppercase font-bold'>{result.jenis_kecerdasan}</h2>
                  <p className='text-sm text-white'>{result.keterangan}</p>
                  <hr />
                  <p className='text-sm text-white'>Selamat kepada saudara/i <span className='underline'>{user.name}</span></p>
                </div>
              </div>
              <button type="button" onClick={logoutFunc} className='bg-sky-700 hover:bg-sky-800 text-white px-5 py-2 rounded-xl text-sm'><i className="fa-solid fa-right-from-bracket"></i> Keluar</button>
            </header>
          ) : (
            <p className='text-sm text-white'>Loading..</p>
          )
        }
      </main>
    </section>
  );
};

export default Hasil;
