import React, { useEffect, useState } from 'react';
import Lottie from "lottie-react";
import awanLp3i from "../assets/img/awan-lp3i.json";
import logoLp3i from '../assets/img/logo-lp3i.png'
import logoTagline from '../assets/img/tagline-warna.png'
import { checkTokenExpiration } from '../middlewares/middleware';
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Home() {
    const [user, setUser] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [jurusan, setJurusan] = useState('belum ada');
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
                const userSchool = decoded.school ?? 'Tidak diketahui';
                const userClasses = decoded.classes ?? 'Tidak diketahui';
                const userStatus = decoded.status;

                const data = {
                    id: userId,
                    name: userName,
                    email: userEmail,
                    phone: userPhone,
                    school: userSchool,
                    classes: userClasses,
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
                setResult(data);

                if (data.length == 0) {
                    setLoading(false);
                    setError(false);
                } else {
                    const resultOne = response.data[0];
                    const resultTwo = response.data[1];

                    const jurusanOne = resultOne.jurusan.split(',');
                    const jurusanTwo = resultTwo.jurusan.split(',');

                    if (jurusanOne.length == 1 && jurusanTwo.length == 1) {
                        setJurusan(resultOne.jurusan);
                    } else if (jurusanOne.length == 1 || jurusanTwo.length == 1) {
                        if (jurusanOne.length == 1) {
                            setJurusan(jurusanOne[0]);
                        }
                        if (jurusanTwo.length == 1) {
                            setJurusan(jurusanTwo[0]);
                        }
                    } else {
                        let hasil = [];
                        for (const jurusan of jurusanOne) {
                            if (jurusanTwo.includes(jurusan)) {
                                hasil.push(jurusan);
                            }
                        }
                        setJurusan(hasil[0]);
                    }
                    setLoading(false);
                    setError(false);
                }
            })
            .catch((error) => {
                setError(false);
                setLoading(false);
            });
    }

    const logoutFunc = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('bucket');
        navigate('/');
    }

    const startTest = async () => {
        try {
            const responseUserExist = await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/kecerdasan/users/${user.id}`);
            console.log(responseUserExist);
            if (responseUserExist.data) {
                navigate('/question')
            } else {
                const data = {
                    id_user: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    school: user.school,
                    classes: user.classes,
                }
                await axios.post(`https://api.politekniklp3i-tasikmalaya.ac.id/kecerdasan/users`, data)
                    .then((response) => {
                        navigate('/question');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getUser();
        checkTokenExpiration()
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                navigate('/')
            });
    }, []);

    return (
        <section className='bg-white h-screen relative bg-cover'>
            HALAMAN TIDAK TERSEDIA
        </section>
    )
}

export default Home
