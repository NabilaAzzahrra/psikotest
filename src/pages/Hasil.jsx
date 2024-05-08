import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import elephantLP3I from "../assets/animations/elephant.json";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../middlewares/middleware';

const Hasil = () => {
  const [user, setUser] = useState({});
  const [jurusan, setjurusan] = useState('belum ada');
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const getUser = async () => {
    checkTokenExpiration()
      .then((response) => {
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
        navigate('/');
      });
  }

  const getResult = async (data) => {
    await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/kecerdasan/hasils/${data.id}`)
      .then((response) => {
        const data = response.data;
        if (data.length == 0) {
          return navigate('/home')
        }
        const resultOne = response.data[0];
        const resultTwo = response.data[1];

        const jurusanOne = resultOne.jurusan.split(',');
        const jurusanTwo = resultTwo.jurusan.split(',');

        if (jurusanOne.length == 1 || jurusanTwo.length == 1) {
          if (jurusanOne.length == 1) {
            setjurusan(jurusanOne[0]);
          }
          if (jurusanTwo.length == 1) {
            setjurusan(jurusanTwo[0]);
          }
        } else {
          let hasil = [];
          for (const jurusan of jurusanOne) {
            if (jurusanTwo.includes(jurusan)) {
              hasil.push(jurusan);
            }
          }
          setjurusan(hasil[0]);
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
    checkTokenExpiration()
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        navigate('/');
      });
  }, []);

  return (
    <section className='bg-sky-500 flex flex-col justify-center items-center md:h-screen py-10'>
      <main className='flex flex-col justify-center items-center gap-5'>
        <Lottie animationData={elephantLP3I} loop={true} className='h-52' />
        {
          result ? (
            <header className='text-center space-y-4 mx-5'>
              <div className='space-y-3'>
                <section className='max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div className='inline-block text-center bg-sky-600 rounded-2xl px-10 py-4 space-y-2'>
                    <h2 className='text-2xl text-white uppercase font-bold'>{result[0].jenis_kecerdasan}</h2>
                    <p className='text-sm text-white'>
                      {result[0].keterangan.split(/([:.])/).map((sentence, index, array) => (
                        <span key={index}>
                          {index % 4 === 0 ? (
                            <b className='text-amber-400 text-[15px]'>{sentence.trim()}</b>
                          ) : (
                            sentence.trim() !== ':' ? (
                              <span>{sentence.trim()}</span>
                            ) : null
                          )}
                          {(index + 1) % 2 === 0 ? <br /> : null}
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className='inline-block text-center bg-sky-600 rounded-2xl px-10 py-4 space-y-2'>
                    <h2 className='text-2xl text-white uppercase font-bold'>{result[1].jenis_kecerdasan}</h2>
                    <p className='text-sm text-white'>
                      {result[1].keterangan.split(/([:.])/).map((sentence, index, array) => (
                        <span key={index}>
                          {index % 4 === 0 ? (
                            <b className='text-amber-400 text-[15px]'>{sentence.trim()}</b>
                          ) : (
                            sentence.trim() !== ':' ? (
                              <span>{sentence.trim()}</span>
                            ) : null
                          )}
                          {(index + 1) % 2 === 0 ? <br /> : null}
                        </span>
                      ))}
                    </p>
                  </div>

                </section>
                <div className='inline-block text-center bg-sky-600 rounded-2xl px-10 py-4 space-y-2'>
                  <p className='text-sm text-white'>
                    Jurusan yang dapat diambil adalah {jurusan}
                  </p>
                  <h2 className='text-2xl text-white uppercase font-bold' id='result'></h2>
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
