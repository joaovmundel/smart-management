import { Company } from "../models/company.model";

export const mockCompany: Company = {
    id: '1',
    name: 'Smart Solutions Ltda',
    description: 'Empresa de tecnologia focada em soluções inteligentes.',
    logoUrl: 'https://png.pngtree.com/element_our/png/20181228/building-vector-icon-png_296032.jpg',
    websiteUrl: 'https://smartsolutions.com',
    cnpj: '12.345.678/0001-99',
    phone: '+55 11 99999-9999',
    email: 'contato@smartsolutions.com',
    address: 'Rua das Inovações, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    country: 'Brasil',
    isActive: true,
    createdAt: new Date('2022-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z')
}