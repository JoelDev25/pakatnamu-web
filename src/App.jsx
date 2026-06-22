import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import CartDrawer from './components/CartDrawer'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Tiendas from './pages/Tiendas'
import Contacto from './pages/Contacto'

function PageTransition({ children }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/tiendas" element={<Tiendas />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </PageTransition>
  )
}

export default function App() {
  const [authMode, setAuthMode] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar onOpenAuth={setAuthMode} onOpenCart={() => setCartOpen(true)} />
          <main>
            <AppRoutes />
          </main>
          <Footer />
          <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            onRequireLogin={() => setAuthMode('login')}
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
