export type ProductFormat = "Físico" | "E-book" | "Kit";
export type ProductCategory = "Inteligência Artificial" | "Blockchain" | "Cibersegurança" | "Machine Learning" | "Data Science";

export interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  format: ProductFormat;
  category: ProductCategory;
  image: string;
  inStock: boolean;
  stockCount: number;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Fundamentos de Inteligência Artificial",
    author: "Dr. Carlos Mendes",
    price: 89.90,
    originalPrice: 129.90,
    format: "Físico",
    category: "Inteligência Artificial",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=560&fit=crop",
    inStock: true,
    stockCount: 45,
    description: "Uma introdução completa aos conceitos fundamentais de IA.",
  },
  {
    id: "2",
    title: "Deep Learning na Prática",
    author: "Ana Paula Silva",
    price: 64.90,
    format: "E-book",
    category: "Machine Learning",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=560&fit=crop",
    inStock: true,
    stockCount: 999,
    description: "Guia prático para implementação de redes neurais profundas.",
  },
  {
    id: "3",
    title: "Blockchain: Do Zero ao Avançado",
    author: "Ricardo Oliveira",
    price: 149.90,
    originalPrice: 199.90,
    format: "Kit",
    category: "Blockchain",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=560&fit=crop",
    inStock: true,
    stockCount: 12,
    description: "Kit completo com livro físico + e-book + exercícios.",
  },
  {
    id: "4",
    title: "Cibersegurança Moderna",
    author: "Fernanda Costa",
    price: 79.90,
    format: "Físico",
    category: "Cibersegurança",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=560&fit=crop",
    inStock: false,
    stockCount: 0,
    description: "Técnicas avançadas de proteção digital.",
  },
  {
    id: "5",
    title: "Python para Data Science",
    author: "Marcos Almeida",
    price: 54.90,
    format: "E-book",
    category: "Data Science",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=560&fit=crop",
    inStock: true,
    stockCount: 999,
    description: "Aprenda Python aplicado à ciência de dados.",
  },
  {
    id: "6",
    title: "Redes Neurais e NLP",
    author: "Juliana Torres",
    price: 94.90,
    originalPrice: 119.90,
    format: "Físico",
    category: "Inteligência Artificial",
    image: "https://images.unsplash.com/photo-1655720828018-edd71de0b5ce?w=400&h=560&fit=crop",
    inStock: true,
    stockCount: 28,
    description: "Processamento de linguagem natural com redes neurais.",
  },
  {
    id: "7",
    title: "Smart Contracts com Solidity",
    author: "Pedro Henrique",
    price: 69.90,
    format: "E-book",
    category: "Blockchain",
    image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&h=560&fit=crop",
    inStock: true,
    stockCount: 999,
    description: "Desenvolvimento de contratos inteligentes na Ethereum.",
  },
  {
    id: "8",
    title: "Kit Machine Learning Completo",
    author: "COMPIA Editora",
    price: 189.90,
    originalPrice: 249.90,
    format: "Kit",
    category: "Machine Learning",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=400&h=560&fit=crop",
    inStock: true,
    stockCount: 8,
    description: "3 livros + materiais exclusivos sobre ML.",
  },
];

export const categories: ProductCategory[] = [
  "Inteligência Artificial",
  "Machine Learning",
  "Data Science",
  "Blockchain",
  "Cibersegurança",
];
