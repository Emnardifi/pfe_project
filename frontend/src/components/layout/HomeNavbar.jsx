import { Link } from "react-router-dom"

const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            SM
          </div>
          <span className="text-xl font-bold text-gray-800">
            Smart Medical
          </span>
        </Link>

        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#features" className="hover:text-blue-600">Fonctionnalités</a>
          <a href="#innovation" className="hover:text-blue-600">Innovation</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default HomeNavbar