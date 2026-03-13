import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ArrowRight, 
  Instagram, 
  Twitter, 
  Facebook,
  Heart,
  ChevronRight,
  ChevronLeft,
  Star,
  Eye
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  tag: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Cyber-Punk Hoodie",
    price: 7387,
    category: "Streetwear",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
    tag: "New Drop"
  },
  {
    id: 2,
    name: "Oversized Acid Wash Tee",
    price: 3735,
    category: "Essentials",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    tag: "Best Seller"
  },
  {
    id: 3,
    name: "Cargo Tech Pants",
    price: 9960,
    category: "Techwear",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
    tag: "Limited"
  },
  {
    id: 4,
    name: "Distressed Knit Sweater",
    price: 7885,
    category: "Knitwear",
    image: "https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?q=80&w=800&auto=format&fit=crop",
    tag: "New"
  }
];

const CATEGORIES = [
  { name: "Outerwear", count: 24, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop" },
  { name: "Streetwear", count: 42, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" },
  { name: "Knitwear", count: 18, image: "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=800&auto=format&fit=crop" },
  { name: "Denim", count: 15, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop" }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [subscribed, setSubscribed] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (productId: number) => {
    setCart(prev => [...prev, productId]);
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      setShowToast(`${product.name} added to cart!`);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 5000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const cartTotal = cart.reduce((total, id) => {
    const product = PRODUCTS.find(p => p.id === id);
    return total + (product?.price || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-brand-bg selection:bg-brand-primary selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] bg-brand-primary text-white px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3"
          >
            <ShoppingBag className="w-4 h-4" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-xl p-8 flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-4xl">
              <input 
                autoFocus
                type="text" 
                placeholder="SEARCH FOR DROPS..." 
                className="w-full bg-transparent border-b-4 border-brand-primary text-4xl md:text-7xl font-display uppercase p-4 focus:outline-none placeholder:text-zinc-800"
              />
              <div className="mt-12 flex flex-wrap gap-4">
                <span className="text-zinc-500 uppercase text-xs tracking-widest">Trending:</span>
                {['Hoodies', 'Cargo', 'Cyber', 'Denim'].map(tag => (
                  <button key={tag} className="px-4 py-1 bg-white/5 rounded-full text-xs uppercase hover:bg-brand-primary hover:text-white transition-all">{tag}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[101] bg-brand-bg border-l border-white/10 flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-display uppercase">Your Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingBag className="w-16 h-16 text-zinc-800 mb-4" />
                    <p className="text-zinc-500 uppercase tracking-widest text-sm">Your bag is empty</p>
                    <button 
                      onClick={() => { setIsCartOpen(false); scrollToSection('products-section'); }}
                      className="mt-8 text-brand-primary font-bold uppercase text-xs tracking-[0.2em] border-b border-brand-primary pb-1"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((id, index) => {
                    const product = PRODUCTS.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={`${id}-${index}`} className="flex gap-6 group">
                        <div className="w-24 aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="font-bold uppercase text-sm">{product.name}</h3>
                            <button onClick={() => removeFromCart(index)} className="text-zinc-600 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-zinc-500 text-[10px] uppercase mt-1">{product.category}</p>
                          <p className="mt-auto font-mono text-brand-primary">₹{product.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-white/10 space-y-6 bg-zinc-900/20">
                  <div className="flex justify-between items-end">
                    <span className="text-zinc-500 uppercase text-xs tracking-widest">Subtotal</span>
                    <span className="text-3xl font-display text-brand-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-brand-primary text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                  >
                    Checkout Now
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-bg/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <a href="/" className="text-2xl font-display tracking-tighter text-brand-primary">Driphop.</a>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <button onClick={() => scrollToSection('products-section')} className="hover:text-brand-primary transition-colors">New Drops</button>
            <button onClick={() => scrollToSection('categories-section')} className="hover:text-brand-primary transition-colors">Collections</button>
            <button onClick={() => setShowToast("Journal coming soon!")} className="hover:text-brand-primary transition-colors">Journal</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative group"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-brand-primary fill-current' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative group"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[60] bg-brand-bg p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-2xl font-display text-brand-primary">Driphop.</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/10 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-8 text-5xl font-display uppercase">
              <motion.button whileHover={{ x: 20 }} onClick={() => setIsMenuOpen(false)} className="text-left hover:text-brand-primary transition-colors">Home</motion.button>
              <motion.button whileHover={{ x: 20 }} onClick={() => scrollToSection('products-section')} className="text-left hover:text-brand-primary transition-colors">Shop All</motion.button>
              <motion.button whileHover={{ x: 20 }} onClick={() => scrollToSection('categories-section')} className="text-left hover:text-brand-primary transition-colors">Collections</motion.button>
              <motion.button whileHover={{ x: 20 }} onClick={() => setIsMenuOpen(false)} className="text-left hover:text-brand-primary transition-colors">About</motion.button>
              <motion.button whileHover={{ x: 20 }} onClick={() => setIsMenuOpen(false)} className="text-left hover:text-brand-primary transition-colors">Contact</motion.button>
            </div>
            <div className="mt-auto flex gap-6">
              <Instagram className="w-6 h-6 text-zinc-500 hover:text-white cursor-pointer" />
              <Twitter className="w-6 h-6 text-zinc-500 hover:text-white cursor-pointer" />
              <Facebook className="w-6 h-6 text-zinc-500 hover:text-white cursor-pointer" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-[15vw] md:text-[12vw] font-display leading-[0.85] uppercase tracking-tighter mb-8 overflow-hidden">
              <motion.span 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block text-white"
              >
                Future
              </motion.span>
              <motion.span 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="block text-brand-primary"
              >
                Street
              </motion.span>
            </h1>
            <div className="flex flex-col md:flex-row md:items-end gap-8">
              <p className="max-w-md text-zinc-400 text-lg leading-relaxed">
                Redefining the urban landscape with sustainable, high-performance streetwear designed for the next generation.
              </p>
              <button 
                onClick={() => scrollToSection('products-section')}
                className="group flex items-center gap-4 bg-brand-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Vertical Rail Text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <p className="writing-mode-vertical rotate-180 text-[10px] uppercase tracking-[1em] text-zinc-500">
            EST. 2024 / TOKYO / LONDON / NYC
          </p>
        </div>
      </header>

      {/* Brand Marquee */}
      <div className="py-12 border-y border-white/5 overflow-hidden bg-zinc-900/50">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-4xl md:text-6xl font-display uppercase mx-12 text-zinc-800 hover:text-brand-primary transition-all cursor-default">
              Driphop CLOTHING CO.
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section id="products-section" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-brand-primary font-mono text-xs uppercase tracking-widest mb-2 block">Curated Selection</span>
            <h2 className="text-5xl font-display uppercase">New Drops</h2>
          </div>
          <button onClick={() => scrollToSection('products-section')} className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-brand-primary transition-colors">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ rotate: [0, -1, 1, -1, 0], transition: { duration: 0.5 } }}
              className="group relative bg-zinc-900/40 border border-white/10 rounded-lg overflow-hidden flex flex-col"
            >
              {/* Diagonal Ribbon */}
              <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden z-20 pointer-events-none">
                <div className="absolute top-4 -left-8 w-32 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-tighter text-center -rotate-45 shadow-lg">
                  {product.tag}
                </div>
              </div>

              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-bg/50 m-2 rounded-md">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-3 right-3 p-2 backdrop-blur-md rounded-full transition-all z-10 ${wishlist.includes(product.id) ? 'bg-brand-primary text-white' : 'bg-black/40 text-white hover:bg-brand-primary hover:text-white'}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
                
                {/* Quick View Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                  <button 
                    onClick={() => setQuickViewProduct(product)}
                    className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                  >
                    <Eye className="w-4 h-4" />
                    Quick View
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1 relative">
                <div className="absolute -top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-brand-primary text-[8px] text-white px-2 py-0.5 rounded-sm font-mono">AUTHENTIC</div>
                </div>
                <p className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] mb-1 font-mono">{product.category}</p>
                <h3 className="font-bold text-sm uppercase tracking-tight mb-2 line-clamp-1">{product.name}</h3>
                <div className="mt-auto">
                  <p className="font-mono text-brand-primary text-lg mb-4">₹{product.price.toLocaleString('en-IN')}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => addToCart(product.id)}
                      className="flex-1 bg-brand-primary text-white py-3 rounded-md font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3 rounded-md border border-white/10 transition-all ${wishlist.includes(product.id) ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/5 hover:bg-white/10'}`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section id="categories-section" className="py-24 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
            <div className="md:col-span-8 relative overflow-hidden rounded-3xl group">
              <img src={CATEGORIES[1].image} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" alt="" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-6xl font-display uppercase mb-2">{CATEGORIES[1].name}</h3>
                <p className="text-zinc-400 mb-6">{CATEGORIES[1].count} Items Available</p>
                <button onClick={() => scrollToSection('products-section')} className="px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs font-bold">Explore</button>
              </div>
            </div>
            <div className="md:col-span-4 relative overflow-hidden rounded-3xl group">
              <img src={CATEGORIES[0].image} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-1000" alt="" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl font-display uppercase mb-2">{CATEGORIES[0].name}</h3>
                <button onClick={() => scrollToSection('products-section')} className="text-brand-primary flex items-center gap-2 text-xs font-bold uppercase tracking-widest">Shop Now <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="md:col-span-4 relative overflow-hidden rounded-3xl group">
              <img src={CATEGORIES[2].image} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-1000" alt="" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl font-display uppercase mb-2">{CATEGORIES[2].name}</h3>
                <button onClick={() => scrollToSection('products-section')} className="text-brand-primary flex items-center gap-2 text-xs font-bold uppercase tracking-widest">Shop Now <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="md:col-span-8 relative overflow-hidden rounded-3xl group">
              <img src={CATEGORIES[3].image} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" alt="" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-6xl font-display uppercase mb-2">{CATEGORIES[3].name}</h3>
                <button onClick={() => scrollToSection('products-section')} className="px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all uppercase text-xs font-bold">Explore</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-display uppercase mb-8 leading-none">Join the <br /> <span className="text-brand-primary">Underground</span></h2>
            <p className="text-zinc-400 text-lg mb-12">Get early access to drops, exclusive discounts, and the latest streetwear news.</p>
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe} 
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <input 
                    required
                    type="email" 
                    placeholder="YOUR EMAIL ADDRESS" 
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-8 py-4 focus:outline-none focus:border-brand-primary transition-colors uppercase text-xs tracking-widest"
                  />
                  <button type="submit" className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all">
                    Subscribe
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-primary text-white p-6 rounded-3xl font-bold uppercase tracking-widest"
                >
                  Welcome to the Driphop crew. Check your inbox.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900/50 pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <a href="/" className="text-4xl font-display tracking-tighter text-brand-primary mb-8 block">Driphop.</a>
            <p className="text-zinc-400 max-w-sm mb-8">
              We are a community-driven streetwear brand focused on quality, sustainability, and the future of urban fashion.
            </p>
            <div className="flex gap-6">
              <Instagram className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-8 text-sm">Shop</h4>
            <ul className="flex flex-col gap-4 text-zinc-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Knitwear</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-8 text-sm">Help</h4>
            <ul className="flex flex-col gap-4 text-zinc-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sizing Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          <p>© 2024 Driphop CLOTHING CO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md z-[101] bg-brand-bg border-l border-white/10 flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-2xl font-display uppercase">Your Wishlist ({wishlist.length})</h2>
                <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Heart className="w-16 h-16 text-zinc-800 mb-4" />
                    <p className="text-zinc-500 uppercase tracking-widest text-sm">Your wishlist is empty</p>
                    <button 
                      onClick={() => { setIsWishlistOpen(false); scrollToSection('products-section'); }}
                      className="mt-8 text-brand-primary font-bold uppercase text-xs tracking-[0.2em] border-b border-brand-primary pb-1"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  wishlist.map((id) => {
                    const product = PRODUCTS.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={id} className="flex gap-6 group">
                        <div className="w-24 aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between">
                            <h3 className="font-bold uppercase text-sm">{product.name}</h3>
                            <button onClick={() => toggleWishlist(id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-zinc-500 text-[10px] uppercase mt-1">{product.category}</p>
                          <p className="mt-2 font-mono text-brand-primary">₹{product.price.toLocaleString('en-IN')}</p>
                          <button 
                            onClick={() => {
                              addToCart(id);
                              toggleWishlist(id);
                            }}
                            className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white bg-white/5 py-2 rounded hover:bg-brand-primary transition-colors"
                          >
                            Move to Bag
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-[111] bg-brand-bg border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-6 right-6 z-20 p-2 bg-black/40 hover:bg-white hover:text-black rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-zinc-900 overflow-hidden">
                <img 
                  src={quickViewProduct.image} 
                  className="w-full h-full object-cover" 
                  alt={quickViewProduct.name} 
                />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                <div className="mb-8">
                  <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
                    {quickViewProduct.category}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display uppercase mb-4 leading-tight">
                    {quickViewProduct.name}
                  </h2>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-mono text-brand-primary">₹{quickViewProduct.price.toLocaleString('en-IN')}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="text-zinc-500 text-xs ml-2">(12 Reviews)</span>
                    </div>
                  </div>
                  <p className="text-zinc-400 leading-relaxed mb-8">
                    Premium quality {quickViewProduct.category.toLowerCase()} piece featuring our signature futuristic aesthetic. Crafted with sustainable materials and designed for maximum comfort and style in the urban landscape.
                  </p>
                </div>

                <div className="space-y-6 mt-auto">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        addToCart(quickViewProduct.id);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 bg-brand-primary text-white py-5 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Bag
                    </button>
                    <button 
                      onClick={() => toggleWishlist(quickViewProduct.id)}
                      className={`p-5 rounded-xl border border-white/10 transition-all ${wishlist.includes(quickViewProduct.id) ? 'bg-brand-primary border-brand-primary text-white' : 'hover:bg-white/5'}`}
                    >
                      <Heart className={`w-6 h-6 ${wishlist.includes(quickViewProduct.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center">
                    Free shipping on orders over ₹12,450 / 30-day returns
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckoutOpen(false)}
              className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed inset-0 md:inset-12 z-[121] bg-brand-bg md:rounded-3xl border border-white/10 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Side: Form */}
              <div className="flex-1 overflow-y-auto p-8 md:p-16">
                <div className="max-w-xl mx-auto">
                  <div className="flex items-center gap-4 mb-12">
                    <button onClick={() => setIsCheckoutOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-4xl font-display uppercase">Shipping Details</h2>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); setShowToast("Order placed successfully!"); setIsCheckoutOpen(false); setCart([]); }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Full Name</label>
                        <input required type="text" placeholder="John Doe" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-6 py-4 focus:border-brand-primary outline-none transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email Address</label>
                        <input required type="email" placeholder="john@gmail.com" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-6 py-4 focus:border-brand-primary outline-none transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Phone Number</label>
                        <input required type="tel" placeholder="+91 98765 43210" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-6 py-4 focus:border-brand-primary outline-none transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Pincode</label>
                        <input required type="text" placeholder="400001" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-6 py-4 focus:border-brand-primary outline-none transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Shipping Address</label>
                      <textarea required rows={3} placeholder="Apartment, Street, City, State" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-6 py-4 focus:border-brand-primary outline-none transition-colors resize-none"></textarea>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block">Payment Method</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['UPI', 'Card', 'COD'].map((method) => (
                          <label key={method} className="relative group cursor-pointer">
                            <input type="radio" name="payment" className="peer sr-only" defaultChecked={method === 'UPI'} />
                            <div className="p-4 bg-zinc-900 border border-white/10 rounded-xl text-center peer-checked:border-brand-primary peer-checked:bg-brand-primary/10 transition-all group-hover:border-white/30">
                              <span className="text-xs font-bold uppercase tracking-widest">{method}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-brand-primary text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-xl shadow-brand-primary/20 mt-8">
                      Complete Purchase
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Side: Order Summary */}
              <div className="w-full md:w-[400px] bg-zinc-900/50 p-8 md:p-12 border-l border-white/10 flex flex-col">
                <h3 className="text-xl font-display uppercase mb-8">Order Summary</h3>
                <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2">
                  {cart.map((id, index) => {
                    const product = PRODUCTS.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={product.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase">{product.category}</p>
                        </div>
                        <p className="font-mono text-sm">₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 pt-8 border-t border-white/10">
                  <div className="flex justify-between text-zinc-500 text-xs uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-xs uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-brand-primary">FREE</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-sm uppercase font-bold tracking-widest">Total</span>
                    <span className="text-4xl font-display text-brand-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
