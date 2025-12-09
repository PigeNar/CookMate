import React from 'react';
import { ShoppingItem } from '../types';
import { X, Trash2, Check, ShoppingBag } from './Icons';

interface ShoppingListProps {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ 
  isOpen, onClose, items, toggleItem, removeItem, clearAll 
}) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-cook-500 text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-xl font-serif font-bold">Shopping List</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-4">
                <ShoppingBag className="w-16 h-16 opacity-20" />
                <p className="text-center font-medium">Your basket is empty.<br/>Start adding ingredients!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li 
                    key={item.id} 
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ${item.checked ? 'bg-stone-50 border-stone-100' : 'bg-white border-stone-200 shadow-sm'}`}
                  >
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300 text-transparent hover:border-green-500'}`}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <span className={`flex-1 text-sm leading-relaxed ${item.checked ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                      {item.text}
                    </span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50">
              <button 
                onClick={clearAll}
                className="w-full py-3 px-4 bg-white border border-stone-200 text-stone-600 font-medium rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Items
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingList;