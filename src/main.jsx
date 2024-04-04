import React from 'react'
import ReactDOM from 'react-dom/client'
import './output.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Question from './pages/Question.jsx'
import Criteria from './pages/admin/Criteria.jsx'
import Upque from './pages/admin/Upque.jsx'
import Answer from './pages/admin/Answer.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
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
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
