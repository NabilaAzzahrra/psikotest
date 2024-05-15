import React from 'react'
import ReactDOM from 'react-dom/client'
import './output.css'
import './assets/css/custom.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Halaman from './pages/Halaman.jsx'
import Hasil from './pages/Hasil.jsx'
import Question from './pages/Question.jsx'
import Criteria from './pages/admin/Criteria.jsx'
import Upque from './pages/admin/Upque.jsx'
import Answer from './pages/admin/Answer.jsx'
import Registers from './pages/auth/Registers.jsx'
import Logins from './pages/auth/Logins.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Logins />
  },
  {
    path: "/register",
    element: <Registers />
  },
  // {
  //   path: "/home",
  //   element: <Home />
  // },
  {
    path: "/home",
    element: < Halaman />
  },
  {
    path: "/question",
    element: <Question />
  },
  {
    path: "/criteria",
    element: <Criteria />
  },
  {
    path: "/upque",
    element: <Upque />
  },
  {
    path: "/answer",
    element: <Answer />
  },
  {
    path: "/result",
    element: <Hasil />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
