import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from "react-select/creatable";
import axios from 'axios';
import { checkTokenExpiration, forbiddenAccess } from '../../middlewares/middleware';
import backgroundImage from "../../assets/img/bg1.png";
import  "../../assets/css/select-react.css";

function Registers() {
    const [nameReg, setNameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [schoolReg, setSchoolReg] = useState('');
    const [phoneReg, setPhoneReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [passwordConfReg, setPasswordConfReg] = useState('');

    const [selectedSchool, setSelectedSchool] = useState(null);

    const [schoolsAPI, setSchoolsAPI] = useState([]);

    const navigate = useNavigate();

    const handlePhoneChange = (e) => {
        let inputValue = e.target.value;

        const numericInput = inputValue.replace(/\D/g, '');

        const maxLength = 14;
        const truncatedInput = numericInput.slice(0, maxLength);

        let formattedValue = '';
        if (truncatedInput.length > 0) {
            formattedValue = '62';

            for (let i = 2; i < truncatedInput.length; i++) {
                if (i === 2 && truncatedInput[i] !== '8') {
                    formattedValue += '8';
                } else {
                    formattedValue += truncatedInput[i];
                }
            }
        }

        setPhoneReg(formattedValue);
    };

    const getSchools = async () => {
        await axios
          .get(
            `https://database.politekniklp3i-tasikmalaya.ac.id/api/school/getall`
          )
          .then((res) => {
            let bucket = [];
            let dataSchools = res.data.schools;
            dataSchools.forEach((data) => {
              bucket.push({
                value: data.id,
                label: data.name,
              });
            });
            setSchoolsAPI(bucket);
          })
          .catch((err) => {
            console.log(err.message);
          });
      };
    
      const schoolHandle = (selectedOption) => {
        if (selectedOption) {
            setSchoolReg(selectedOption.value);
          setSelectedSchool(selectedOption);
        }
      };

    const registerFunc = async (e) => {
        e.preventDefault();
        await axios.post(`https://database.politekniklp3i-tasikmalaya.ac.id/api/auth/psikotest/register`, {
            name: nameReg,
            school: schoolReg,
            email: emailReg,
            phone: phoneReg,
            password: passwordReg,
            password_confirmation: passwordConfReg
        })
            .then((response) => {
                alert(response.data.message)
                navigate('/')
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        checkTokenExpiration();
        forbiddenAccess();
        getSchools();
    }, []);

    return (
        <div className='relative'>
            <div className='bg-white h-screen relative flex flex-col justify-center items-center' style={{
                backgroundImage: `url(${backgroundImage})`,
            }}>
                <div className='bg-white p-6 shadow-xl rounded-t-xl w-[800px] border-b-2 border-gray-400'>
                    <div className='flex justify-between gap-5'>
                        <img src="src/assets/img/logo-lp3i.png" alt='logo lp3i' className='h-10' />
                        <img src="src/assets/img/tagline-warna.png" alt='logo lp3i' className='h-10' />
                    </div>
                </div>
                <div className='bg-white py-2 px-6 pb-6 shadow-xl rounded-b-xl w-[800px]'>
                    <form class="w-full mx-auto" onSubmit={registerFunc}>
                        <div className="flex gap-5">
                            <div class="mb-2 w-full">
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Lengkap</label>
                                <input type="text" id="name" style={{ fontFamily: 'Poppins' }} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={nameReg} onChange={(e) => setNameReg(e.target.value)} placeholder='Masukkan nama lengkap di sini...' required />
                            </div>
                            <div class="mb-5 w-full">
                                <label for="school" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sekolah</label>
                                <CreatableSelect type="text" id="school" style={{ fontFamily: 'Poppins'}} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" options={schoolsAPI} value={selectedSchool} onChange={schoolHandle} placeholder='Masukkan sekolah di sini...' required />
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div class="mb-2 w-full">
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" id="email" style={{ fontFamily: 'Poppins' }} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={emailReg} onChange={(e) => setEmailReg(e.target.value)} placeholder='Masukkan email di sini...' required />
                            </div>
                            <div class="mb-5 w-full">
                                <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                                <input type="number" id="phone" style={{ fontFamily: 'Poppins' }} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={phoneReg} onChange={handlePhoneChange} placeholder='Masukkan phone di sini...' required />
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div class="mb-2 w-full">
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" id="password" style={{ fontFamily: 'Poppins' }} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={passwordReg} onChange={(e) => setPasswordReg(e.target.value)} placeholder='Masukkan password di sini...' required />
                            </div>
                            <div class="mb-5 w-full">
                                <label for="konfirmasi" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Konfirmasi Password</label>
                                <input type="password" id="konfirmasi" style={{ fontFamily: 'Poppins' }} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={passwordConfReg} onChange={(e) => setPasswordConfReg(e.target.value)} placeholder='Masukkan Konfirmasi password di sini...' required />
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button type="submit" class="bg-yellow-300 hover:bg-black text-black hover:text-white border-white border-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">DAFTAR</button>
                        </div>
                    </form>
                </div>

            </div>

        </div >
    )
}

export default Registers
