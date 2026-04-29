import { useState } from 'react';
import { Search, Sparkles, Moon, ArrowRight, ShieldCheck, Scale, X, AlertCircle, Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  safety_score: number;
  price: string;
}

const FILTERS = [
  "Cruelty-Free",
  "Vegan",
  "Paraben-Free",
  "Fragrance-Free",
  "Alcohol-Free"
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'about' | 'favorites'>('home');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["Cruelty-Free"]);
  const [error, setError] = useState<string | null>(null);

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const toggleFavorite = (p: Product) => {
    if (favorites.find(f => f.id === p.id)) {
      setFavorites(favorites.filter(f => f.id !== p.id));
    } else {
      setFavorites([...favorites, p]);
    }
  };

  const toggleCompare = (p: Product) => {
    if (compareList.find(i => i.id === p.id)) {
      setCompareList(compareList.filter(i => i.id !== p.id));
    } else if (compareList.length < 2) {
      setCompareList([...compareList, p]);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setProducts([]);
    
    try {
      // Join selected filters into a comma-separated string, plus the mandatory 'Non-Toxic'
      const filterString = selectedFilters.length > 0 
        ? selectedFilters.join(', ') + ', Non-Toxic' 
        : 'Non-Toxic';

      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters: filterString }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error("Invalid response format from server");
      }
      
    } catch (err: any) {
      console.error("Search failed:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ p }: { p: Product }) => (
    <div key={p.id} className="bg-white border border-slate-200 p-6 rounded-3xl hover:border-emerald-500/50 hover:shadow-xl transition-all group flex flex-col relative">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200">
          Score: {p.safety_score}/10
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => toggleFavorite(p)}
            title="Favorite"
            className={`p-2 rounded-full border transition-all ${favorites.find(f => f.id === p.id) ? 'bg-red-50 text-red-500 border-red-200' : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-red-400'}`}
          >
            <Heart size={18} fill={favorites.find(f => f.id === p.id) ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => toggleCompare(p)}
            title="Compare"
            className={`p-2 rounded-full border transition-all ${compareList.find(i => i.id === p.id) ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <Scale size={18} />
          </button>
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1">{p.name}</h3>
      <p className="text-emerald-600 font-medium text-sm mb-4">{p.brand}</p>
      <p className="text-slate-600 text-sm leading-relaxed flex-1">{p.description}</p>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
        <span className="text-xl font-bold text-slate-900">{p.price}</span>
        <ShieldCheck className="text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-slate-800 flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div 
          className="flex items-center gap-2 font-bold text-xl text-slate-800 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
            <Sparkles size={20} />
          </div>
          Alterra
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'home' ? 'bg-emerald-50 text-emerald-600' : 'hover:text-slate-900'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab('discover')} 
            className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'discover' ? 'bg-emerald-50 text-emerald-600' : 'hover:text-slate-900'}`}
          >
            Discover
          </button>
          <button 
            onClick={() => setActiveTab('favorites')} 
            className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'favorites' ? 'bg-emerald-50 text-emerald-600' : 'hover:text-slate-900'}`}
          >
            Favorites {favorites.length > 0 && <span className="ml-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">{favorites.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('about')} 
            className={`px-4 py-2 rounded-full transition-colors ${activeTab === 'about' ? 'bg-emerald-50 text-emerald-600' : 'hover:text-slate-900'}`}
          >
            About
          </button>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <Moon size={20} />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 mt-8 mb-24">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-100 bg-white text-emerald-600 text-sm font-medium mb-8 shadow-sm">
              <Sparkles size={16} />
              Trusted ingredient intelligence
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Find Safer Product<br />Alternatives <span className="text-emerald-500">Instantly</span>
            </h1>
            
            <p className="text-lg text-slate-500 mb-12 max-w-2xl mx-auto">
              Search products and filter based on ingredients — cruelty-free, vegan, and more.
            </p>

            {/* Search Interface */}
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full border border-slate-200 shadow-lg p-2 mb-8 transition-shadow focus-within:shadow-xl focus-within:border-emerald-300">
                <div className="pl-4 text-slate-400">
                  <Search size={24} />
                </div>
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-lg text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Search a product, brand, or ingredient..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search Alternatives'}
                </button>
              </div>

              {/* Multi-Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {FILTERS.map(f => {
                  const isSelected = selectedFilters.includes(f);
                  return (
                    <button
                      key={f}
                      onClick={() => toggleFilter(f)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                        isSelected 
                          ? 'border-emerald-500 text-emerald-600 bg-emerald-50' 
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white bg-white'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-emerald-500' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                      </div>
                      {f}
                    </button>
                  );
                })}
              </div>
              
              <p className="text-sm text-slate-400">
                Try "MAC Lipstick", "Nivea Lotion", or "Lakme Sunscreen"
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="mt-12 p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center max-w-2xl mx-auto text-red-600">
                <AlertCircle size={32} className="mb-2" />
                <h3 className="text-lg font-bold">Search Failed</h3>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            )}

            {/* Results Section */}
            {products.length > 0 && (
              <div className="mt-20 text-left">
                <h2 className="text-2xl font-bold mb-8 text-slate-800 text-center">Top Safer Alternatives</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {products.map(p => <ProductCard key={p.id} p={p} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DISCOVER TAB */}
        {activeTab === 'discover' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Discover Clean Brands</h2>
            <p className="text-lg text-slate-500 mb-12 max-w-2xl">Explore some of the most trusted, non-toxic, and cruelty-free brands available in the Indian market right now.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Plum Goodness", desc: "100% vegan, cruelty-free brand known for green tea toners and serums." },
                { name: "Minimalist", desc: "Science-backed, highly effective skincare without unnecessary fragrances." },
                { name: "Earth Rhythm", desc: "Ecocert certified solid shampoo bars and zero-waste packaging." },
                { name: "Juicy Chemistry", desc: "Certified organic, freshly made products with transparent ingredient lists." },
                { name: "Kiro Beauty", desc: "High-performance color cosmetics infused with skincare ingredients." },
                { name: "Forest Essentials", desc: "Luxurious Ayurvedic formulations using pure essential oils." },
              ].map((brand, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{brand.name}</h3>
                  <p className="text-slate-600">{brand.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Your Saved Alternatives</h2>
            <p className="text-lg text-slate-500 mb-12">Products you've saved for later comparison and shopping.</p>
            
            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No favorites yet</h3>
                <p className="text-slate-500">Click the heart icon on any product to save it here.</p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="mt-6 px-6 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-full hover:bg-emerald-100 transition-colors"
                >
                  Start Searching
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {favorites.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto bg-white p-12 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-white">
              <Sparkles size={32} />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">About Alterra</h2>
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6">
              <p>
                Alterra was built with a simple mission: to make finding safe, clean, and ethical personal care products effortless. 
              </p>
              <p>
                Navigating the world of cosmetics and skincare can be overwhelming. Ingredients lists are long and complicated, and "greenwashing" is prevalent. Our AI-powered engine acts as your personal product toxicologist, instantly analyzing your current favorite products and finding superior alternatives that meet your strict standards.
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How it works</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Search for any product you currently use.</li>
                <li>Select your required preferences (Vegan, Cruelty-Free, Paraben-Free, etc.).</li>
                <li>Our AI immediately finds 3 highly-rated alternatives available in your local market.</li>
                <li>Compare safety scores, ingredients, and prices side-by-side.</li>
              </ul>
              <p className="mt-8 pt-8 border-t border-slate-100 italic text-sm">
                Powered by Google Gemini and advanced real-time chemical analysis.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Comparison Overlay */}
      {compareList.length === 2 && (
        <div className="fixed inset-x-0 bottom-8 flex justify-center z-50 px-4 animate-in slide-in-from-bottom-8">
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)] max-w-3xl w-full relative">
            <button onClick={() => setCompareList([])} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Comparing Alternatives</h3>
            </div>
            <div className="grid grid-cols-2 gap-8 divide-x divide-slate-100">
              {compareList.map((item, index) => (
                <div key={item.id} className={`px-4 text-center ${index === 1 ? 'pl-8' : 'pr-8'}`}>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h4>
                  <p className="text-emerald-600 text-sm font-medium mb-4">{item.brand}</p>
                  
                  <div className="bg-emerald-50 rounded-2xl p-4 mb-4">
                    <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-1">Safety Score</p>
                    <div className="text-4xl font-black text-emerald-500">{item.safety_score}</div>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.description}</p>
                  <div className="font-bold text-lg text-slate-900">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
