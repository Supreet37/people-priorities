import React from 'react';
import { Link } from 'react-router-dom';
import LedgerStat from '../components/ui/LedgerStat';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* --- NEW SECTION: Navbar --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-marigold rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-fraunces text-xl font-bold text-ink-navy tracking-tight">People's Priorities</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#how-it-works" className="hover:text-marigold transition-colors">How it Works</a>
            <a href="#features" className="hover:text-marigold transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-marigold transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login/citizen" className="text-sm font-bold text-ink-navy hover:text-marigold transition-colors">Sign In</Link>
            <Link to="/login/citizen" className="bg-marigold text-white px-5 py-2 rounded-md font-bold text-sm hover:bg-opacity-90 transition-all shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Existing Code) */}
      <div 
        className="relative h-[100vh] bg-cover bg-center pt-16"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1647184223407-ef8273a6822c?fm=jpg&q=80&w=1600&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-ink-navy bg-opacity-60 flex items-center">
          <div className="container mx-auto px-6 flex items-center justify-center flex-col text-center">
            <h1 className="font-fraunces text-5xl md:text-7xl text-white font-bold max-w-3xl leading-tight">
              Your Voice, <br />Your MP's Priority.
            </h1>
            <p className="text-white text-xl mt-6 max-w-xl font-sans">
              Directly contribute to your constituency's development by sharing your concerns and suggestions.
            </p>
            <div className="mt-10 flex gap-4">
              <Link to="/login/citizen" className="bg-marigold text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-opacity-90 transition-all">
                Citizen Portal
              </Link>
              <Link to="/login/mp" className="bg-white text-ink-navy px-8 py-4 rounded-md font-bold text-lg hover:bg-gray-100 transition-all">
                MP Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section (Existing Code) */}
      <div className="bg-white py-16 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <LedgerStat label="Total Complaints" value="1,248" subtext="Across all wards" />
            <LedgerStat label="Resolved" value="842" subtext="In last 6 months" />
            <LedgerStat label="Active Projects" value="24" subtext="Under implementation" />
            <LedgerStat label="Wards Covered" value="10" subtext="Full constituency" />
          </div>
        </div>
      </div>

      {/* How it works (Existing Code) */}
      <div id="how-it-works" className="py-20 bg-paper">
        <div className="container mx-auto px-6">
          <h2 className="font-fraunces text-4xl text-ink-navy font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-marigold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-4">Submit</h3>
              <p className="text-gray-600">Share your concern via text, voice, or photo. Our AI categorizes it instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-marigold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-4">Analyze</h3>
              <p className="text-gray-600">Complaints are clustered to identify major gaps in infrastructure and services.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-marigold text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-4">Action</h3>
              <p className="text-gray-600">The MP reviews priority projects and allocates funds where they are needed most.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW SECTION: Core Features --- */}
      <div id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" 
                alt="Community Development" 
                className="rounded-2xl shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
            <div className="flex-1 space-y-8">
              <h2 className="font-fraunces text-4xl text-ink-navy font-bold leading-tight">
                Empowering Communities Through Transparent Governance
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We bridge the gap between citizens and elected representatives using modern technology. Our platform ensures every voice is heard and every concern is tracked to resolution.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time tracking of constituency projects",
                  "AI-powered categorization of citizen grievances",
                  "Transparent fund allocation and progress reports",
                  "Direct feedback loop with the MP's office"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 bg-marigold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-marigold rounded-full" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW SECTION: Testimonials --- */}
      <div id="testimonials" className="py-24 bg-paper/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-fraunces text-4xl text-ink-navy font-bold mb-4">Voices of the Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">See how citizens and representatives are working together to transform our wards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "Resident, Ward 4",
                text: "The new street lighting project in our area was completed in record time after we collectively raised it on the portal.",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
              },
              {
                name: "Rajesh Kumar",
                role: "Community Leader",
                text: "Finally, a platform that gives us data-driven evidence of where our infrastructure needs urgent attention.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
              },
              {
                name: "Hon. Michael Chen",
                role: "Member of Parliament",
                text: "This dashboard allows my office to prioritize high-impact projects based on actual citizen feedback, not just guesswork.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-ink-navy">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- NEW SECTION: Call to Action --- */}
      <div className="py-20 bg-ink-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-marigold/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-marigold/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="font-fraunces text-4xl text-white font-bold mb-6">Ready to Shape Your Future?</h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of citizens who are already contributing to a better, more transparent constituency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login/citizen" className="bg-marigold text-white px-10 py-4 rounded-md font-bold text-lg hover:bg-opacity-90 transition-all">
              Register as Citizen
            </Link>
            <Link to="/contact" className="border border-white/30 text-white px-10 py-4 rounded-md font-bold text-lg hover:bg-white/10 transition-all">
              Contact MP Office
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer (Existing Code Enhanced) */}
      <footer className="mt-auto py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-marigold rounded-lg flex items-center justify-center text-white font-bold">P</div>
                <span className="font-fraunces text-xl font-bold text-ink-navy">People's Priorities</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                A digital bridge between the people and their representatives, fostering transparency and accelerated development.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-ink-navy mb-6 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-marigold transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-marigold transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-marigold transition-colors">Constituency Map</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-ink-navy mb-6 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-4 text-gray-500 text-sm">
                <li>support@peoplespriorities.gov</li>
                <li>MP Office, City Hall</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-sm italic">© 2026 People's Priorities. Building a better constituency together.</p>
          </div>
        </div>
        </footer>
    </div>
  );
};

export default Landing;
