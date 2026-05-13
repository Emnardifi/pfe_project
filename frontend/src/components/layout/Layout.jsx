import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import Footer from "./Footerpage"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main zone */}
      <div className="flex flex-col flex-1 lg:pl-72 min-h-screen">
        
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Layout