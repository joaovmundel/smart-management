import { Sale } from '../models/sale.model';
import { productListMock } from './product.mock';

const [productOne, productTwo, productThree, productFour] = productListMock;

export const salesMock: Sale[] = [
  {
    id: 'S-1001',
    saleDate: new Date('2024-10-12T10:15:00'),
    status: 'completed',
    paymentMethod: 'credit',
    customerName: 'João Oliveira',
    notes: 'Cliente recorrente',
    items: [
      {
        product: productOne,
        quantity: 2,
        unitPrice: productOne.saleValue,
      },
      {
        product: productTwo,
        quantity: 1,
        unitPrice: productTwo.saleValue,
        discount: 5,
      },
    ],
  },
  {
    id: 'S-1002',
    saleDate: new Date('2024-10-13T15:45:00'),
    status: 'completed',
    paymentMethod: 'pix',
    customerName: 'Mariana Souza',
    items: [
      {
        product: productThree,
        quantity: 3,
        unitPrice: productThree.saleValue,
      },
    ],
  },
  {
    id: 'S-1003',
    saleDate: new Date('2024-10-14T11:05:00'),
    status: 'pending',
    paymentMethod: 'bank-slip',
    customerName: 'Empresa XPTO',
    notes: 'Aguardando pagamento do boleto',
    items: [
      {
        product: productOne,
        quantity: 10,
        unitPrice: productOne.saleValue,
        discount: 40,
      },
    ],
  },
  {
    id: 'S-1004',
    saleDate: new Date('2024-10-15T17:30:00'),
    status: 'completed',
    paymentMethod: 'cash',
    customerName: 'Carlos Mendes',
    items: [
      {
        product: productFour,
        quantity: 1,
        unitPrice: productFour.saleValue,
      },
      {
        product: productTwo,
        quantity: 2,
        unitPrice: productTwo.saleValue,
        discount: 10,
      },
    ],
  },
  {
    id: 'S-1005',
    saleDate: new Date('2024-10-18T09:20:00'),
    status: 'completed',
    paymentMethod: 'debit',
    customerName: 'Fernanda Lima',
    items: [
      {
        product: productThree,
        quantity: 1,
        unitPrice: productThree.saleValue,
      },
      {
        product: productOne,
        quantity: 1,
        unitPrice: productOne.saleValue,
      },
    ],
  },
];
