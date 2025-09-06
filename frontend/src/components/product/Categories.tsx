
import { Card, CardContent } from '../ui/display/Card';
import { Badge } from '../ui';

import { categories as categories_data } from '@/data/category';
import Image from 'next/image';

const Categories = () => {
    const categories = categories_data.slice(0, 5);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Categorías Populares
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explora nuestra amplia selección de electrodomésticos organizados por categorías
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 ">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                        >
                            <CardContent className="p-4 text-center">
                                <div className="relative mb-4">
                                    <Image
                                        src={category.image}
                                        alt={category.description}
                                        width={600} 
                                        height={240}
                                        quality={100}
                                        className="object-contain w-full h-60 rounded-lg group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                                    {category.label}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                    {10} productos
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;