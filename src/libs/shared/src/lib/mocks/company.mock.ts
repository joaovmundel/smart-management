import { Company } from "../models/company.model";

export const mockCompany: Company = {
    id: 1,
    name: 'Smart Solutions Ltda',
    description: 'Empresa de tecnologia focada em soluções inteligentes.',
    logoUrl: 'https://static.vecteezy.com/system/resources/thumbnails/024/553/534/small_2x/lion-head-logo-mascot-wildlife-animal-illustration-generative-ai-png.png',
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
    createdAt: '2022-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z'
}

export const mockCompanyList: Company[] = [
    mockCompany,
    {
        id: 2,
        name: 'Tech Innovations Inc.',
        description: 'Empresa de tecnologia focada em inovações.',
        logoUrl: 'https://diariodocomercio.com.br/mix/wp-content/uploads/2025/08/nubank-1200x900.png',
        websiteUrl: 'https://techinnovations.com',
        cnpj: '98.765.432/0001-10',
        phone: '+55 11 88888-8888',
        email: 'contato@techinnovations.com',
        address: 'Avenida das Tecnologias, 456',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '98765-432',
        country: 'Brasil',
        isActive: true,
        createdAt: '2022-02-01T10:00:00Z',
        updatedAt: '2023-02-01T10:00:00Z'
    },
    {
        id: 3,
        name: 'Innovative Tech Solutions',
        description: 'Empresa de tecnologia focada em soluções inovadoras.',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/PicPay_Logogrande.png',
        websiteUrl: 'https://innovativetech.com',
        cnpj: '12.345.678/0001-99',
        phone: '+55 11 99999-9999',
        email: 'contato@innovativetech.com',
        address: 'Rua das Inovações, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil',
        isActive: true,
        createdAt: '2022-01-01T10:00:00Z',
        updatedAt: '2023-01-01T10:00:00Z'
    }
];