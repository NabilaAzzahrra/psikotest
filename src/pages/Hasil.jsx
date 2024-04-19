import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../assets/img/bg1.png";

const Hasil = ({ userId }) => {
  const [jenisKecerdasan, setJenisKecerdasan] = useState(null);
  const [keterangan, setKeterangan] = useState(null);
  const [userIds, setIds] = useState(null);
  const [name, setName] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHasil = async () => {
      try {
        if (!userId) return;

        console.log('Fetching hasil for userId:', userId);
        const response = await axios.get(`http://localhost:3000/hasils/${userId}`);
        console.log('Response:', response.data);
        const { jenis_kecerdasan } = response.data;
        const { keterangan } = response.data;
        setJenisKecerdasan(jenis_kecerdasan);
        setKeterangan(keterangan);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching result:', error.response);
        setLoading(false);
      }
    };

    if (userId) {
      fetchHasil();
    }
  }, [userId]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await axios.get('https://database.politekniklp3i-tasikmalaya.ac.id/api/auth/psikotest/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('User data:', response.data.user);
        const user = response.data.user;
        const { name } = response.data.user;
        setName(name);

        const userId = user.id;

        const hasilResponse = await axios.get(`http://localhost:3000/hasils/${userId}`);
        console.log('Hasil data:', hasilResponse.data);

        const { jenis_kecerdasan } = hasilResponse.data;
        const { keterangan } = hasilResponse.data;
        const { id_user } = hasilResponse.data;
        setJenisKecerdasan(jenis_kecerdasan);
        setKeterangan(keterangan);
        setIds(id_user);
        setLoading(false);
        // window.print();
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <div>
      <h1 className='bg-black font-bold font-arial text-[40px] justify-center items-center text-white p-6 text-center -mb-[120px]' style={{
        fontFamily: 'Poppins',
      }}>Tes Kecerdasan</h1>
      <div className=' p-10 justify-center flex items-center h-screen' style={{
        backgroundImage: `url(${backgroundImage})`,
      }}>
        <div className='flex flex-col'>
          <div className='flex justify-center items-center gap-5'>
            <div className=' font-bold font-arial text-[30px] justify-center items-center text-black p-6 text-center mb-[10px]' style={{
              fontFamily: 'Poppins',
            }}>Selamat ya {name}</div>
            <div className='w-40 h-40 bg-red-500'>
              FOTO KARAKTER
            </div>
          </div>
          {loading ? (
            <p>Mengambil hasil...</p>
          ) : jenisKecerdasan !== null ? (
            <div style={{
              fontFamily: 'Poppins',
            }} className='flex-col flex items-center'>
              <div className='mt-5 text-[20px]'>Kecerdasan Kamu Adalah...</div>
              <div className='text-[30px]'>"<span className='font-bold'>{jenisKecerdasan}</span>"</div>
              <div className='text-[20px] px-10 text-center'>"{keterangan}"</div>
              <div className=' p-6  w-[500px] '>
                <div className='flex justify-between gap-5'>
                  <img src="src/assets/img/logo-lp3i.png" alt='logo lp3i' className='h-10' />
                  <img src="src/assets/img/tagline-warna.png" alt='logo lp3i' className='h-10' />
                </div>
              </div>
            </div>
          ) : (
            <p>Data tidak tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hasil;
