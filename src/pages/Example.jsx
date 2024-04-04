import React from 'react'

function Home() {
    return (
        <div className='bg-sky-400 h-screen relative flex flex-col justify-center items-center'>
            <div className='font-bold text-[40px]'>
                TES KECERDASAN GANDA
            </div>
            <div className='text-[18px]'>
                Test ini dilakukan untuk mengetahui jenis kecerdasan dari seseorang dan dapat dijadikan sebagai acuan dalam mendalami atau mempelajari sesuatu
            </div>
            <a href="#">
                <div className='bg-sky-700 px-4 py-2 rounded-xl mt-4'>
                    MULAI
                </div>
            </a>
            <div className="grid grid-cols-7 px-4 absolute bottom-0">
                <div className='bg-red-500 w-[250px] h-[400px] p-4 rounded-xl '>Linguistik</div>
                <div className='bg-red-300 w-[250px] h-[300px] p-4 rounded-xl '>Logis-Matematis</div>
                <div className='bg-red-500 w-[250px] h-[300px] p-4 rounded-xl '>Musikal</div>
                <div className='bg-red-300 w-[250px] h-[300px] p-4 rounded-xl'>Fisik-Kinestetik</div>
                <div className='bg-red-500 w-[250px] h-[300px] p-4 rounded-xl '>Spasial-Visual</div>
                <div className='bg-red-300 w-[250px] h-[300px] p-4 rounded-xl '>Interpersonal</div>
                <div className='bg-red-500 w-[250px] h-[300px] p-4 rounded-xl '>Intrapersonal</div>
            </div>
        </div>
    )
}

export default Home