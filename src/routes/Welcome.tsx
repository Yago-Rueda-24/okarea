import Navbar from '../components/Navbar';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-surface font-sans text-text-main">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
            <div className="w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
            <div className="w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-main mb-8 animate-fade-in-up">
            Welcome to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Okarea</span>
          </h1>
          <p className="mt-4 text-xl text-text-muted max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover a new way to work. Experience modern design, seamless integration, and a focus on what truly matters. Your next big idea starts here.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-text-main hover:bg-black text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              Start Free Trial
            </button>
            <button className="bg-white hover:bg-surface text-text-main px-8 py-3.5 rounded-full font-semibold transition-all shadow-md border border-gray-200 hover:border-gray-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">Inspiring Workspaces</h2>
            <p className="text-lg text-text-muted">Designed to boost your creativity and productivity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group overflow-hidden rounded-2xl shadow-lg cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img src={img1} alt="Modern Workspace 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-semibold text-xl">Luminous Spaces</h3>
                </div>
              </div>
            </div>
            
            <div className="group overflow-hidden rounded-2xl shadow-lg cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img src={img2} alt="Modern Workspace 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-semibold text-xl">Modern Architecture</h3>
                </div>
              </div>
            </div>
            
            <div className="group overflow-hidden rounded-2xl shadow-lg cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img src={img3} alt="Modern Workspace 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-semibold text-xl">Minimalist Setup</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
