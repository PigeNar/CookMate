import React from 'react';
import { Recipe, Ingredient } from '../types';
import { X, Clock, Flame, ChefHat, Plus } from './Icons';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  addToShoppingList: (ingredients: Ingredient[]) => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, addToShoppingList }) => {
  if (!recipe) return null;

  const handleAddAll = () => {
    addToShoppingList(recipe.ingredients || []);
    // Visual feedback handled by parent or toast ideally, but keeping simple here
  };

  const tags = recipe.tags || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
        
        {/* Image Side (Mobile: Top, Desktop: Left) */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative group">
          <img 
            src={`https://picsum.photos/id/${recipe.imageSeed || 100}/800/1200`} 
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden p-2 bg-white/20 backdrop-blur-md text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-6 text-white md:hidden">
            <h2 className="text-3xl font-serif font-bold leading-tight shadow-sm">{recipe.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
                {tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-medium">
                        {tag}
                    </span>
                ))}
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-3/5 flex flex-col h-full bg-white overflow-hidden">
            {/* Header (Desktop) */}
            <div className="hidden md:flex justify-between items-start p-8 pb-4">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-stone-900 mb-2">{recipe.title}</h2>
                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                        <ChefHat className="w-4 h-4" />
                        <span>by <span className="text-cook-500 font-semibold">{recipe.chefName}</span></span>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-0 space-y-8 custom-scrollbar">
                
                {/* Stats Bar */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Prep</span>
                        <span className="font-semibold text-stone-800 flex items-center gap-1">
                           <Clock className="w-4 h-4 text-cook-500"/> {recipe.prepTime}
                        </span>
                    </div>
                    <div className="w-px h-8 bg-stone-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Cook</span>
                        <span className="font-semibold text-stone-800 flex items-center gap-1">
                            <Flame className="w-4 h-4 text-cook-500"/> {recipe.cookTime}
                        </span>
                    </div>
                    <div className="w-px h-8 bg-stone-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Cals</span>
                        <span className="font-semibold text-stone-800">{recipe.calories}</span>
                    </div>
                     <div className="w-px h-8 bg-stone-200" />
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Level</span>
                        <span className={`font-semibold ${recipe.difficulty === 'Easy' ? 'text-green-600' : recipe.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {recipe.difficulty}
                        </span>
                    </div>
                </div>

                <p className="text-stone-600 leading-relaxed italic border-l-4 border-cook-500 pl-4">
                    "{recipe.description}"
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Ingredients */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-serif font-bold text-stone-900">Ingredients</h3>
                            <button 
                                onClick={handleAddAll}
                                className="text-xs flex items-center gap-1 bg-cook-500 hover:bg-cook-600 text-white px-3 py-1.5 rounded-full transition-colors shadow-sm"
                            >
                                <Plus className="w-3 h-3" /> Add to List
                            </button>
                        </div>
                        <ul className="space-y-3">
                            {(recipe.ingredients || []).map((ing, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-stone-700 text-sm border-b border-stone-50 pb-2 last:border-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cook-200 mt-2 flex-shrink-0" />
                                    <span>
                                        <span className="font-semibold text-stone-900">{ing.amount}</span> {ing.item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">Instructions</h3>
                        <ol className="space-y-6">
                            {(recipe.instructions || []).map((step, idx) => (
                                <li key={idx} className="relative pl-6">
                                    <span className="absolute left-0 top-0 font-serif font-bold text-stone-300 text-2xl -translate-x-1 -translate-y-1">
                                        {idx + 1}
                                    </span>
                                    <p className="text-stone-700 text-sm leading-relaxed relative z-10">
                                        {step}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className="pt-4 pb-8 flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium border border-stone-200">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;