import React from 'react'
import backgroundImage from "../assets/img/bg1.png";

function Dashboard() {
    return (
        <div>
            <h1 className='bg-black font-bold font-arial text-[40px] justify-center items-center text-white p-6 text-center -mb-[120px]' style={{
                fontFamily: 'Poppins',
            }}>Administrator Tes Kecerdasan</h1>
            <div className=' p-10 justify-center flex items-center h-screen' style={{
                backgroundImage: `url(${backgroundImage})`, fontFamily: 'Poppins',
            }}>
                <div className="flex gap-5">
                    <div className='flex items-center'>
                        <div className='bg-red-500 w-20 h-20 p-4 rounded-l-xl text-white'>
                            Kriteria
                        </div>
                        <div className='bg-emerald-300 w-10 h-20 rounded-r-xl p-4 text-white'>
                            39
                        </div>
                    </div>
                    <div className='bg-red-500 w-10 h-10'></div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard