import React from 'react';
import { Recipe } from '../types';
import { Clock, Flame, ChefHat, ArrowRight } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  featured?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, featured = false }) => {
  const tags = recipe?.tags || [];

  return (
    <div 
      onClick={() => onClick(recipe)}
      className={`group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex ${featured ? 'flex-col md:flex-row md:col-span-2 md:h-96' : 'flex-col h-full'}`}
    >
      <div className={`relative overflow-hidden ${featured ? 'w-full md:w-1/2 h-64 md:h-full' : 'w-full h-56'}`}>
        <img 
          src={`https://picsum.photos/id/${recipe.imageSeed || 100}/600/600`} 
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="bg-white/90 backdrop-blur text-stone-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                {recipe.cuisine}
            </span>
             {tags.includes("Quick") && (
                 <span className="bg-cook-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                 Fast
                </span>
             )}
        </div>
      </div>

      <div className={`p-5 flex flex-col justify-between ${featured ? 'w-full md:w-1/2 md:p-8' : 'flex-1'}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                 <ChefHat className="w-3.5 h-3.5" />
             </div>
             <span className="text-xs font-medium text-stone-500">{recipe.chefName}</span>
          </div>

          <h3 className={`font-serif font-bold text-stone-900 group-hover:text-cook-500 transition-colors ${featured ? 'text-3xl mb-4' : 'text-xl mb-2 line-clamp-2'}`}>
            {recipe.title}
          </h3>

          <p className={`text-stone-500 text-sm leading-relaxed mb-4 ${featured ? 'line-clamp-4' : 'line-clamp-2'}`}>
            {recipe.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
           <div className="flex items-center gap-4 text-stone-500 text-xs font-medium">
               <span className="flex items-center gap-1">
                   <Clock className="w-3.5 h-3.5" /> {recipe.prepTime}
               </span>
               <span className="flex items-center gap-1">
                   <Flame className="w-3.5 h-3.5" /> {recipe.calories} kcal
               </span>
           </div>
           
           {featured && (
               <button className="hidden md:flex items-center gap-2 text-cook-500 font-bold text-sm group-hover:gap-3 transition-all">
                   View Recipe <ArrowRight className="w-4 h-4" />
               </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;