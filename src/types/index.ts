export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'snack' | 'powder';
    slug: string;
}
