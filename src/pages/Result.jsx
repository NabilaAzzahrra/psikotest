/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import elephantLP3I from "../assets/animations/elephant.json";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkTokenExpiration } from "../middlewares/middleware";

const Result = () => {
  const [user, setUser] = useState({});
  const [jurusan, setJurusan] = useState("belum ada");
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const getUser = async () => {
    checkTokenExpiration()
      .then(() => {
        const token = localStorage.getItem("token");
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
          status: userStatus,
        };

        setUser(data);
        getResult(data);
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  };

  const getResult = async (data) => {
    await axios
      .get(
        `https://elearning.politekniklp3i-tasikmalaya.ac.id:8444/kecerdasan/hasils/${data.id}`
      )
      .then((response) => {
        const data = response.data;

        if (data.length == 0) {
          return navigate("/home");
        }
        const resultOne = response.data[0];
        const resultTwo = response.data[1];

        // const jurusanOne = resultOne.jurusan.split(",");
        // const jurusanTwo = resultTwo.jurusan.split(",");

        // if (jurusanOne.length == 1 ) {
        //   setJurusan(resultOne.jurusan);
        // } else if (jurusanOne.length == 1 || jurusanTwo.length == 1) {
        //   if (jurusanOne.length == 1) {
        //     setJurusan(jurusanOne[0]);
        //   }
        //   if (jurusanTwo.length == 1) {
        //     setJurusan(jurusanTwo[0]);
        //   }
        // } else {
        //   let hasil = [];
        //   for (const jurusan of jurusanOne) {
        //     if (jurusanTwo.includes(jurusan)) {
        //       hasil.push(jurusan);
        //     }
        //   }
        //   setJurusan(hasil[0]);
        // }
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logoutFunc = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("bucket");
    navigate("/");
  };

  useEffect(() => {
    checkTokenExpiration()
      .then(() => {
        getUser();
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  }, []);

  return (
    <main className="bg-sky-500 flex justify-center items-center md:h-screen py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-5">
        <section className="flex flex-col items-center gap-3">
          <Lottie animationData={elephantLP3I} loop={true} className="h-52" />
          <div className="inline-block text-center bg-sky-600 rounded-2xl px-10 py-4 space-y-2">
            <h3 className="text-white font-bold text-lg">{user.name}</h3>
            <hr />
            <p className="text-sm text-white">
              {/* Jurusan yang dapat diambil adalah */}
              Jenis Kecerdasan Kamu adalah
            </p>
            {result ? (
              <h2
                className="text-2xl text-white uppercase font-bold"
                id="result"
              >
                {result[0].jenis_kecerdasan}
              </h2>
            ) : (
              <p className="text-sm text-white">Loading..</p>
            )}
          </div>
          <button
            type="button"
            onClick={logoutFunc}
            className="bg-sky-700 hover:bg-sky-800 text-white px-5 py-2 rounded-xl text-sm"
          >
            <i className="fa-solid fa-right-from-bracket"></i> Keluar
          </button>
        </section>
        {result ? (
          <section className="max-w-7xl grid grid-cols-1 gap-5 overflow-y-auto p-5 h-screen">
            <div className="flex flex-col items-center justify-center text-center bg-sky-600 rounded-3xl px-10 py-5 space-y-2">
              <h2 className="text-2xl text-white uppercase font-bold">
                {result[0].jenis_kecerdasan}
              </h2>
              <div className="text-white space-y-1">
                {result[0].keterangan.split(/([:.])/).map((sentence, index) => (
                  <div key={index}>
                    {index % 4 === 0 ? (
                      <h3 className="text-amber-400 text-base font-medium">
                        {sentence.trim()}
                      </h3>
                    ) : sentence.trim() !== ":" ? (
                      <p className="text-[13px] font-reguler">
                        {sentence.trim()}...
                      </p>
                    ) : null}
                    {(index + 1) % 2 === 0 || null}
                  </div>
                ))}
              </div>
            </div>
            {/* <div className='flex flex-col items-center justify-center text-center bg-sky-600 rounded-3xl px-10 py-5 space-y-2'>
                <h2 className='text-2xl text-white uppercase font-bold'>{result[1].jenis_kecerdasan}</h2>
                <div className='text-white space-y-1'>
                  {result[1].keterangan.split(/([:.])/).map((sentence, index) => (
                    <div key={index}>
                      {index % 4 === 0 ? (
                        <h3 className='text-amber-400 text-base font-medium'>{sentence.trim()}</h3>
                      ) : (
                        sentence.trim() !== ':' ? (
                          <p className='text-[13px] font-reguler'>{sentence.trim()}...</p>
                        ) : null
                      )}
                      <span>{(index + 1) % 2 === 0 || null}</span>
                    </div>
                  ))}
                </div>
              </div> */}
          </section>
        ) : (
          <p className="text-sm text-white">Loading..</p>
        )}
      </div>
    </main>
  );
};

export default Result;
