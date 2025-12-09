import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, ShoppingBag, UtensilsCrossed, ChefHat, 
  Heart, Filter, ChevronRight, Menu, Star
} from './components/Icons';
import { Recipe, ShoppingItem, Ingredient } from './types';
import { generateRecipes, searchRecipesByIngredientsOrDiet } from './services/geminiService';
import { INITIAL_FILTERS, CUISINES, MOCK_RECIPES } from './constants';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import ShoppingList from './components/ShoppingList';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'home' | 'search'>('home');
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [momRecipes, setMomRecipes] = useState<Recipe[]>([]);
  const [chefRecipes, setChefRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('cookmate_shopping_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSection, setLoadingSection] = useState<'mom' | 'chef' | null>(null);

  // Persist Shopping List
  useEffect(() => {
    localStorage.setItem('cookmate_shopping_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Initial Data Load (Simulated)
  useEffect(() => {
    const loadInitialSections = async () => {
      // We load Mom's Kitchen and Chef's Corner on first load if empty
      // Using a small delay to simulate network and let the UI paint first
      if (momRecipes.length === 0) {
        setLoadingSection('mom');
        const moms = await generateRecipes("Comfort food, home cooking, family recipes", 3);
        setMomRecipes(moms);
        setLoadingSection(null);
      }
      if (chefRecipes.length === 0) {
        setLoadingSection('chef');
        const chefs = await generateRecipes("Michelin star style, gourmet, complex flavors", 3);
        setChefRecipes(chefs);
        setLoadingSection(null);
      }
    };
    
    // In a real app we might wait for user interaction to save costs, 
    // but for "Vibe" we want content. 
    // Optimization: Only load if user scrolls or clicks? 
    // Let's load on mount for the "Complete App" feel.
    loadInitialSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery && activeFilters.length === 0) return;

    setIsLoading(true);
    setActiveTab('search');
    const results = await searchRecipesByIngredientsOrDiet(searchQuery, activeFilters);
    setRecipes(results);
    setIsLoading(false);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const addToShoppingList = (ingredients: Ingredient[]) => {
    const newItems: ShoppingItem[] = ingredients.map(ing => ({
      id: Math.random().toString(36).substr(2, 9),
      text: `${ing.amount} ${ing.item}`,
      checked: false
    }));
    setShoppingList(prev => [...prev, ...newItems]);
    setIsShoppingListOpen(true);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const handleCuisineClick = async (cuisine: string) => {
      setSearchQuery(cuisine);
      setIsLoading(true);
      setActiveTab('search');
      const results = await generateRecipes(`${cuisine} cuisine`, 6);
      setRecipes(results);
      setIsLoading(false);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setActiveTab('home')}
            >
              <div className="w-8 h-8 bg-cook-500 rounded-lg flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-serif font-bold text-stone-900 tracking-tight">Cookmate.</span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
                <form onSubmit={handleSearch} className="w-full relative">
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ingredients, cravings, chefs..."
                        className="w-full bg-stone-100 border-none rounded-full py-2.5 pl-10 pr-4 text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-cook-500/20 focus:bg-white transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-stone-400 group-focus-within:text-cook-500 transition-colors" />
                </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsShoppingListOpen(true)}
                className="relative p-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {shoppingList.filter(i => !i.checked).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cook-500 rounded-full ring-2 ring-white" />
                )}
              </button>
              <button className="md:hidden p-2 text-stone-500 hover:bg-stone-100 rounded-full">
                  <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
            <form onSubmit={handleSearch} className="relative">
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="w-full bg-stone-100 border-none rounded-xl py-3 pl-10 text-stone-800 focus:ring-2 focus:ring-cook-500/20"
                />
                <Search className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
            </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Filters & Tags */}
        <div className="flex flex-col gap-6 mb-10">
            {/* Quick Cuisine Filters */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {CUISINES.map(cuisine => (
                    <button 
                        key={cuisine}
                        onClick={() => handleCuisineClick(cuisine)}
                        className="flex-shrink-0 px-4 py-2 bg-white border border-stone-200 rounded-full text-stone-600 font-medium text-sm hover:border-cook-500 hover:text-cook-500 transition-colors shadow-sm"
                    >
                        {cuisine}
                    </button>
                ))}
            </div>

            {/* Diet/Time Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-2 text-stone-400">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
                </div>
                {INITIAL_FILTERS.map(filter => (
                    <button
                        key={filter}
                        onClick={() => toggleFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            activeFilters.includes(filter)
                            ? 'bg-cook-500 text-white shadow-md shadow-cook-500/20'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'search' && (
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-bold text-stone-900">
                        {isLoading ? 'Asking the chef...' : `Results for "${searchQuery || 'Filters'}"`}
                    </h2>
                    <button onClick={() => setActiveTab('home')} className="text-sm text-stone-500 hover:text-cook-500 underline">
                        Clear Search
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3].map(i => (
                            <div key={i} className="h-64 bg-stone-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map(recipe => (
                            <RecipeCard 
                                key={recipe.id} 
                                recipe={recipe} 
                                onClick={setSelectedRecipe} 
                            />
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'home' && (
            <div className="space-y-16 pb-20">
                {/* Hero / Featured */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Star className="w-5 h-5 text-cook-500 fill-cook-500" />
                        <h2 className="text-2xl font-serif font-bold text-stone-900">Editor's Choice</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <RecipeCard recipe={MOCK_RECIPES[0]} onClick={setSelectedRecipe} featured />
                        <div className="flex flex-col gap-6">
                             {/* Mini cards or promos could go here */}
                             <RecipeCard recipe={MOCK_RECIPES[1]} onClick={setSelectedRecipe} />
                        </div>
                    </div>
                </section>

                {/* Mom's Kitchen */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                            <h2 className="text-2xl font-serif font-bold text-stone-900">Mummy's Kitchen</h2>
                        </div>
                        {loadingSection === 'mom' && <span className="text-xs text-stone-400 animate-pulse">Cooking...</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {momRecipes.length > 0 ? momRecipes.map(recipe => (
                             <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} />
                         )) : (
                             // Skeleton
                             [1,2,3,4].map(i => <div key={i} className="h-64 bg-stone-100 rounded-2xl animate-pulse" />)
                         )}
                    </div>
                </section>

                 {/* Chef's Corner */}
                 <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <ChefHat className="w-5 h-5 text-stone-800" />
                            <h2 className="text-2xl font-serif font-bold text-stone-900">Top Chef's Corner</h2>
                        </div>
                        {loadingSection === 'chef' && <span className="text-xs text-stone-400 animate-pulse">Plating...</span>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {chefRecipes.length > 0 ? chefRecipes.map(recipe => (
                             <RecipeCard key={recipe.id} recipe={recipe} onClick={setSelectedRecipe} />
                         )) : (
                             // Skeleton
                             [1,2,3].map(i => <div key={i} className="h-64 bg-stone-100 rounded-2xl animate-pulse" />)
                         )}
                    </div>
                </section>
            </div>
        )}
      </main>

      {/* Modals & Overlays */}
      <ShoppingList 
        isOpen={isShoppingListOpen} 
        onClose={() => setIsShoppingListOpen(false)}
        items={shoppingList}
        toggleItem={toggleShoppingItem}
        removeItem={removeShoppingItem}
        clearAll={() => setShoppingList([])}
      />

      <RecipeModal 
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        addToShoppingList={addToShoppingList}
      />
    </div>
  );
};

export default App;