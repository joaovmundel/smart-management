# Cart Component (Carrinho de Vendas)

## 📋 Visão Geral

O `CartComponent` é um componente standalone Angular responsável por gerenciar o carrinho de vendas da aplicação. Ele permite que vendedores adicionem produtos, controlem quantidades, visualizem o total e finalizem vendas de forma intuitiva e eficiente.

## 🎯 Funcionalidades

### Principais Recursos

- ✅ **Adicionar Produtos**: Adiciona produtos ao carrinho com quantidade específica
- ✅ **Controle de Quantidade**: Incrementa/decrementa quantidade de cada item
- ✅ **Remover Itens**: Remove produtos individuais do carrinho
- ✅ **Cálculo Automático**: Calcula subtotais e valor total automaticamente
- ✅ **Limpar Carrinho**: Remove todos os itens de uma vez
- ✅ **Finalizar Venda**: Processa o checkout e emite evento com os itens
- ✅ **Estado Vazio**: Exibe mensagem amigável quando não há itens
- ✅ **Badge de Contagem**: Mostra quantidade total de itens no cabeçalho
- ✅ **Design Responsivo**: Adaptado para desktop, tablet e mobile

## 🏗️ Estrutura de Arquivos

```
cart/
├── cart.component.ts        # Lógica do componente
├── cart.component.html       # Template HTML
├── cart.component.scss       # Estilos CSS
└── readme.md                 # Documentação
```

## 📦 Dependências

### Módulos Angular Material

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
```

### Modelos

```typescript
import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';
```

## 🔧 API do Componente

### Propriedades

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `cartItems` | `CartItem[]` | Array de itens no carrinho |
| `totalItems` | `number` (getter) | Total de itens no carrinho |
| `totalValue` | `number` (getter) | Valor total de todos os itens |
| `isEmpty` | `boolean` (getter) | Indica se o carrinho está vazio |

### Eventos de Saída (@Output)

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `checkoutComplete` | `EventEmitter<CartItem[]>` | Emitido ao finalizar venda |
| `cartCleared` | `EventEmitter<void>` | Emitido ao limpar o carrinho |

### Métodos Públicos

#### `addProduct(product: Product, quantity = 1): void`

Adiciona um produto ao carrinho. Se o produto já existir, incrementa a quantidade.

**Parâmetros:**
- `product`: Produto a ser adicionado
- `quantity`: Quantidade (padrão: 1)

**Exemplo:**
```typescript
this.cartComponent.addProduct(myProduct, 2);
```

---

#### `removeProduct(productId: string): void`

Remove completamente um produto do carrinho.

**Parâmetros:**
- `productId`: ID do produto a ser removido

**Exemplo:**
```typescript
this.cartComponent.removeProduct('prod-123');
```

---

#### `updateQuantity(productId: string, newQuantity: number): void`

Atualiza a quantidade de um produto e recalcula o subtotal.

**Parâmetros:**
- `productId`: ID do produto
- `newQuantity`: Nova quantidade (se ≤ 0, remove o produto)

**Exemplo:**
```typescript
this.cartComponent.updateQuantity('prod-123', 5);
```

---

#### `incrementQuantity(productId: string): void`

Incrementa em 1 a quantidade de um produto.

**Parâmetros:**
- `productId`: ID do produto

**Exemplo:**
```typescript
this.cartComponent.incrementQuantity('prod-123');
```

---

#### `decrementQuantity(productId: string): void`

Decrementa em 1 a quantidade de um produto.

**Parâmetros:**
- `productId`: ID do produto

**Exemplo:**
```typescript
this.cartComponent.decrementQuantity('prod-123');
```

---

#### `clearCart(): void`

Limpa todos os itens do carrinho e emite evento `cartCleared`.

**Exemplo:**
```typescript
this.cartComponent.clearCart();
```

---

#### `checkout(): void`

Finaliza a venda, emite evento `checkoutComplete` com os itens e limpa o carrinho.

**Exemplo:**
```typescript
this.cartComponent.checkout();
```

## 💻 Uso no Componente Pai

### 1. Importar o Componente

```typescript
import { CartComponent } from './components/cart/cart.component';

@Component({
  // ...
  imports: [CartComponent],
  // ...
})
```

### 2. Adicionar no Template

```html
<sm-cart 
  (checkoutComplete)="onCheckoutComplete($event)"
  (cartCleared)="onCartCleared()">
</sm-cart>
```

### 3. Implementar Handlers

```typescript
export class SalesPageComponent {
  @ViewChild(CartComponent) cart!: CartComponent;

  addProductToCart(product: Product, quantity: number) {
    this.cart.addProduct(product, quantity);
  }

  onCheckoutComplete(items: CartItem[]) {
    console.log('Venda finalizada:', items);
    // Processar a venda (enviar para API, gerar recibo, etc.)
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    alert(`Venda concluída! Total: R$ ${total.toFixed(2)}`);
  }

  onCartCleared() {
    console.log('Carrinho limpo');
  }
}
```

## 📊 Modelos de Dados

### CartItem

```typescript
export interface CartItem {
  product: Product;    // Produto completo
  quantity: number;    // Quantidade no carrinho
  subtotal: number;    // Preço × quantidade
}
```

### Product (referência)

```typescript
export interface Product {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  saleValue: number;
  grossValue: number;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 Interface do Usuário

### Layout Principal

O componente é dividido em 3 seções principais:

1. **Cabeçalho**
   - Ícone de carrinho
   - Título "Carrinho de Vendas"
   - Badge com total de itens

2. **Corpo** (quando há itens)
   - Lista de itens do carrinho
   - Cada item mostra:
     - Imagem do produto (ou placeholder)
     - Nome e categoria
     - Preço unitário
     - Controles de quantidade (+/-)
     - Subtotal
     - Botão de remover
   - Resumo do carrinho (total de itens e valor total)
   - Botões de ação (Limpar/Finalizar)

3. **Estado Vazio** (quando não há itens)
   - Ícone grande de carrinho
   - Mensagem "O carrinho está vazio"
   - Dica para adicionar produtos

### Elementos Visuais

- 🖼️ **Imagens de Produtos**: Exibidas em miniatura (80x80px no desktop)
- 🎯 **Controles de Quantidade**: Botões arredondados com ícones +/-
- 💰 **Valores**: Formatados em moeda BRL (R$)
- �️ **Ícone de Remover**: Botão vermelho com ícone de lixeira
- ✅ **Botão Finalizar**: Destacado em azul primário

## 📱 Responsividade

### Desktop (> 768px)
- Layout em duas colunas para informações do item
- Imagens 80x80px
- Botões lado a lado

### Tablet (480px - 768px)
- Layout em coluna única
- Imagens em largura total (altura 150px)
- Controles de quantidade em linha

### Mobile (< 480px)
- Layout compacto
- Cabeçalho reduzido
- Botões em coluna
- Espaçamentos ajustados

## 🎨 Customização de Estilos

### Variáveis Principais

O componente utiliza as variáveis globais do projeto:

```scss
$background-secondary: #40474e;
$background-primary: #23272b;
$background-light: #f2f2f2;
$text-light: white;
$text-dark: #333;
$border-primary: #d9d9d9;
```

### Classes CSS Principais

- `.cart-container`: Container principal
- `.cart-header`: Cabeçalho do carrinho
- `.cart-item`: Card de cada item
- `.quantity-controls`: Controles de quantidade
- `.cart-summary`: Resumo de totais
- `.cart-actions`: Botões de ação
- `.empty-cart`: Estado vazio

## 🔄 Fluxo de Dados

```
Produto Selecionado
       ↓
  addProduct()
       ↓
Produto já existe? → Sim → Incrementa quantidade
       ↓                          ↓
      Não                  Recalcula subtotal
       ↓                          ↓
Adiciona novo item ← ← ← ← ← ← ← ↓
       ↓
Atualiza cartItems
       ↓
Recalcula totais
       ↓
  Atualiza UI
```

## ✅ Validações

- ❌ Quantidade não pode ser menor que 1
- ❌ Não permite checkout com carrinho vazio
- ✅ Remove automaticamente item se quantidade = 0
- ✅ Previne valores negativos

## 🧪 Exemplo Completo

```typescript
// parent.component.ts
import { Component, ViewChild } from '@angular/core';
import { CartComponent } from '@smart-management/stock';
import { Product, CartItem } from '@smart-management/stock';

@Component({
  selector: 'app-sales',
  template: `
    <div class="sales-container">
      <div class="products-section">
        <h2>Produtos Disponíveis</h2>
        <div *ngFor="let product of products">
          <button (click)="addToCart(product)">
            Adicionar {{ product.name }}
          </button>
        </div>
      </div>
      
      <div class="cart-section">
        <sm-cart 
          (checkoutComplete)="onCheckout($event)"
          (cartCleared)="onClear()">
        </sm-cart>
      </div>
    </div>
  `,
  imports: [CartComponent]
})
export class SalesComponent {
  @ViewChild(CartComponent) cart!: CartComponent;
  
  products: Product[] = [/* ... */];

  addToCart(product: Product) {
    this.cart.addProduct(product, 1);
  }

  onCheckout(items: CartItem[]) {
    // Enviar para API, gerar recibo, etc.
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    this.processPayment(items, total);
  }

  onClear() {
    console.log('Carrinho limpo pelo usuário');
  }

  processPayment(items: CartItem[], total: number) {
    // Lógica de pagamento
  }
}
```

## Debugging

### Verificar Estado do Carrinho

```typescript
// No console do navegador ou no componente
console.log('Itens:', this.cart.cartItems);
console.log('Total de itens:', this.cart.totalItems);
console.log('Valor total:', this.cart.totalValue);
console.log('Está vazio?', this.cart.isEmpty);
```

## 🚀 Melhorias Futuras

- [ ]  Persistência do carrinho no localStorage
- [ ]  Serviço de carrinho compartilhado
- [ ]  Descontos e cupons
- [ ]  Limite de estoque
- [ ]  Animações de entrada/saída de itens
- [ ]  Integração com API de vendas
- [ ]  Histórico de carrinhos
- [ ]  Busca de produtos dentro do carrinho

## 📝 Notas

- O componente é **standalone**, não requer módulo
- Os cálculos são feitos automaticamente ao modificar quantidades
- O carrinho é limpo automaticamente após checkout
- Todos os valores monetários são formatados em BRL

## 🤝 Contribuindo

Para modificar ou estender o componente:

1. Mantenha a interface atual para compatibilidade
2. Adicione testes para novas funcionalidades
3. Atualize esta documentação
4. Siga os padrões de código do projeto

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0  
**Autor**: Smart Management Team