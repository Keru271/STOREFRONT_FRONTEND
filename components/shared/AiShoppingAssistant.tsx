'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  Star,
  Check,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/components/shared/ThemeProvider';
import { processCustomerAiShopping, AiShoppingMessage } from '@/lib/api/aiShopping';
import type { Product } from '@/lib/api/types';
import Link from 'next/link';

export function AiShoppingAssistant() {
  const { theme } = useTheme();
  const { addToCart, openCart } = useCart();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const currency = theme?.currency || 'INR';
  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const [messages, setMessages] = useState<AiShoppingMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 **Welcome to ${theme?.storeName || 'our store'}!**\n\nI'm your personal shopping concierge. Tell me what style, item, or budget you're looking for, and I'll find the best match in our catalog!`,
      timestamp: 'Just now',
      suggestedPrompts: [
        `I need something under ${currencySymbol}2,000`,
        'What are your best sellers?',
        'Looking for premium gift ideas',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    setInputValue('');

    const userMsg: AiShoppingMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await processCustomerAiShopping(query, messages, currency);
      
      const assistantMsg: AiShoppingMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: 'Just now',
        products: response.products,
        suggestedPrompts: response.suggestedPrompts,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I apologize, I encountered a brief hiccup while searching the catalog. Please try again!',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddedProductId(product.id);
      await addToCart({
        productId: product.id,
        quantity: 1,
      });

      toast.success(`Added "${product.name}" to your bag!`);
      setTimeout(() => setAddedProductId(null), 2000);
      openCart();
    } catch (err) {
      toast.error('Failed to add product to cart.');
      setAddedProductId(null);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-950 text-white shadow-2xl hover:shadow-indigo-500/25 border border-white/10 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            style={{
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 20px 0 rgba(99, 102, 241, 0.25)',
            }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              Ask AI Concierge
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        )}
      </div>

      {/* Slide-out / Popover Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[80vh] h-[580px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-white">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-tight">
                    {theme?.storeName || 'Store'} AI Concierge
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-400">Personalized catalog recommendations</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                </div>

                {/* Embedded Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="w-full mt-3 space-y-2">
                    {msg.products.map((prod) => {
                      const image =
                        Array.isArray(prod.images) && prod.images[0]
                          ? prod.images[0]
                          : typeof prod.images === 'string'
                          ? prod.images
                          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';

                      const isAdded = addedProductId === prod.id;

                      return (
                        <div
                          key={prod.id}
                          className="group p-2.5 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl flex items-center gap-3 transition-all shadow-sm"
                        >
                          <img
                            src={image}
                            alt={prod.name}
                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-slate-800 border border-slate-700/50"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-extrabold text-amber-400">
                                {currencySymbol}
                                {prod.price.toLocaleString()}
                              </span>
                              {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                                <span className="text-[10px] text-slate-500 line-through">
                                  {currencySymbol}
                                  {prod.compareAtPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              <span>{prod.rating || 4.9}</span>
                              <span className="text-slate-500">• In Stock</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(prod, e)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-emerald-500 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3 h-3" />
                                Added
                              </>
                            ) : (
                              <>
                                <Zap className="w-3 h-3" />
                                Add
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Suggested Prompt Chips */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {msg.suggestedPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-medium border border-slate-700/60 transition-colors flex items-center gap-1"
                      >
                        <span>{prompt}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-slate-800/50 p-2.5 rounded-xl max-w-[200px]">
                <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                <span>Searching catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Black wallet under ₹2,000..."
              className="flex-1 bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
