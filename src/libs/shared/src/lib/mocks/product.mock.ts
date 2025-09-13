import { Product } from '@smart-management/stock';

export const categoryMock = {
  id: '1',
  name: 'Roupas',
  description: 'Categoria de roupas e vestuário',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const productMock: Product = {
  id: '1',
  name: 'Camiseta Básica',
  description:
    'Camiseta Básica 100% Algodão - Conforto e Estilo para o Dia a Dia',
  photoUrl:
    'https://cdn.iset.io/assets/66687/produtos/15075/85dd7b4a5c88270a082be4ff5320471a672142e48456a.png',
  stockAmount: 10,
  saleValue: 39.99,
  grossValue: 19.99,
  category: categoryMock,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const productListMock: Product[] = [
  productMock,
  {
    id: '2',
    name: 'Camiseta Básica 2',
    description: 'Description for Product 2',
    photoUrl: 'https://via.placeholder.com/150',
    stockAmount: 5,
    saleValue: 50.0,
    grossValue: 60.0,
    category: categoryMock,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Product 3',
    description: 'Description for Product 3',
    photoUrl: 'https://via.placeholder.com/150',
    stockAmount: 8,
    saleValue: 80.0,
    grossValue: 96.0,
    category: categoryMock,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
