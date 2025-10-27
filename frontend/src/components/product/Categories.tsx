
import { Card, CardContent } from '../ui/display/Card';
import { Badge } from '../ui';

import { categories as categories_data } from '@/data/category';
import Image from 'next/image';
import Link from 'next/link';

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
                        Explora nuestra amplia selección de refacciones para electrodomésticos organizados por categorías
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 ">
                    {categories.map((category) => (
                        <Card
                            key={category.id}
                            className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                        >
                            <Link href={`/categorias/${category.key}`}>
                                <CardContent className="p-4 text-center">
                                    <div className="relative mb-4 h-32 w-full overflow-hidden rounded-lg">
                                        <Image
                                            src={category.image}
                                            alt={category.description}
                                            fill
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                            loading="lazy"
                                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                                        {category.label}
                                    </h3>
                                    <Badge variant="outline" className="text-xs">
                                        {10} productos
                                    </Badge>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;