'use client'

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, User, Phone } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/forms/Button'
import { Badge } from '../feedback/Badge';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import AccountModal from '../display/AccountModa';

import { categories } from '@/data/category';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    type Company = { name: string; phone: string; tagline: string };
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { getTotalItems } = useCart();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchQuery('');
            redirect(`/productos?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleCategoryClick = (categoryName: string) => {
        setIsMenuOpen(false);
        redirect(`/productos?category=${encodeURIComponent(categoryName)}`);
    };

    if (loading) {
        return (
            <header className="bg-white shadow-sm border-b">
                <div className="bg-blue-600 text-white text-sm py-2">
                    <div className="container mx-auto px-4 flex justify-center">
                        <div className="animate-pulse">Cargando...</div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <>
            <header className="bg-white shadow-sm border-b">
                {/* Top bar */}
                <div className="bg-blue-600 text-white text-sm py-2">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{company?.phone || '+52 55 1234 5678'}</span>
                            </div>
                            <span>|</span>
                            <span>Envío gratis en compras mayores a $500</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/blog" className="hover:text-blue-200 transition-colors">
                                Blog
                            </Link>
                            <span>|</span>
                            <Link href="/contacto" className="hover:text-blue-200 transition-colors">
                                Contacto
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main header */}
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">{company?.name || 'ElectroMart'}</h1>
                                <p className="text-xs text-gray-500">{company?.tagline || 'Tu hogar, nuestra pasión'}</p>
                            </div>
                        </Link>

                        {/* Search bar */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </form>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hidden md:flex"
                                onClick={() => setIsAccountOpen(true)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Mi Cuenta
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="relative"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Carrito
                                {getTotalItems() > 0 && (
                                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">
                                        {getTotalItems()}
                                    </Badge>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile search */}
                    <form onSubmit={handleSearch} className="md:hidden mt-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Navigation */}
                <nav className="bg-gray-50 border-t">
                    <div className="container mx-auto px-4">
                        <div className="hidden md:flex space-x-8 py-3">
                            <Link
                                href="/productos"
                                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                            >
                                Todos los Productos
                            </Link>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.name)}
                                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium cursor-pointer"
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Mobile menu */}
                        {isMenuOpen && (
                            <div className="md:hidden py-4 space-y-2">
                                <Link
                                    href="/productos"
                                    className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Todos los Productos
                                </Link>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.name)}
                                        className="block py-2 text-gray-700 hover:text-blue-600 transition-colors text-left w-full"
                                    >
                                        {category.name}
                                    </button>
                                ))}
                                <div className="border-t pt-4 mt-4">
                                    <Link
                                        href="/blog"
                                        className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Blog
                                    </Link>
                                    <Link
                                        href="/contacto"
                                        className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Contacto
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start mt-2"
                                        onClick={() => {
                                            setIsAccountOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Mi Cuenta
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Account Modal */}
            <AccountModal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
        </>
    );
};

export default Header;