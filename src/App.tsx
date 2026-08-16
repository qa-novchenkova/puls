import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Glossary from './pages/Glossary'

// при переходе на новую страницу — прокрутка наверх
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/glossary" element={<Glossary />} />
      </Routes>
      <Footer />
    </>
  )
}
