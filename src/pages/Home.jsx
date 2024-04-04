import React from 'react';
import Lottie from "lottie-react";
import awanLp3i from "../assets/img/awan-lp3i.json";
import backgroundImage from "../assets/img/bg1.png";
import preloader from "../assets/img/load.json";

function Home() {
    return (
        <div className='relative'>
            <div className='bg-white h-screen relative flex flex-col justify-center items-center' style={{
                backgroundImage: `url(${backgroundImage})`,
            }}>
                <div className='flex justify-between gap-5 mb-10'>
                    <img src="src/assets/img/logo-lp3i.png" alt='logo lp3i' className='h-20' />
                    <img src="src/assets/img/tagline-warna.png" alt='logo lp3i' className='h-16' />
                </div>
                <div className=''>
                    <Lottie animationData={awanLp3i} loop={true} className='h-52' />
                </div>
                <div id="tes-text" className='prose font-bold font-arial text-[60px] transition ease-out duration-300 -mt-10'>
                    TES KECERDASAN GANDA
                </div>
                <div className='text-[18px] px-[100px] text-center'>
                    Kita akan menjadi paling bahagia dan sukses ketika belajar, berkembang, dan bekerja dengan cara yang paling baik memanfaatkan kecerdasan alami kita (dengan kata lain, kekuatan, gaya, dan jenis otak kita masing-masing). Dengan demikian, indikator ini membantu Anda menetapkan fokus pada jenis pembelajaran dan pekerjaan yang paling membahagiakan dan paling bermanfaat bagi Anda sendiri.
                </div>
                <a href="/question">
                    <div className='font-bold px-5 py-2 rounded-sm mt-6 w-[100px] justify-items-center border-gray-950 border-2 hover:bg-gray-950 hover:text-white'>
                        MULAI
                    </div>
                </a>
            </div>

        </div>
    )
}

export default Home
