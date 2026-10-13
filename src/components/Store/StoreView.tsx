import React, { useState } from 'react';
import { useGaditas } from '../../context/GaditasContext';
import { StoreProduct } from '../../types';
import { 
  ShoppingBag, 
  Plus, 
  AlertTriangle, 
  Check, 
  Package, 
  Edit3, 
  DollarSign, 
  Search,
  X
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { products, addProduct, updateProduct, addStoreSale, currentRole } = useGaditas();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<StoreProduct | null>(null);
  const [quantityToBuy, setQuantityToBuy] = useState(1);
  const [buyerName, setBuyerName] = useState('Aluno Tatame');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<StoreProduct['category']>('Kimonos');
  const [price, setPrice] = useState(250);
  const [costPrice, setCostPrice] = useState(130);
  const [stock, setStock] = useState(15);
  const [photoUrl, setPhotoUrl] = useState('');
  const [sizesInput, setSizesInput] = useState('A1, A2, A3');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name,
      category,
      price: Number(price),
      costPrice: Number(costPrice),
      stock: Number(stock),
      sizes: sizesInput.split(',').map(s => s.trim()),
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400',
      minStockAlert: 5
    });
    setShowNewModal(false);
  };

  const handleCheckoutSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutProduct) return;
    addStoreSale(checkoutProduct.id, quantityToBuy, buyerName);
    setShowCheckoutModal(false);
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-100 font-cinzel">
              Loja Oficial Gaditas & Controle de Estoque
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Equipamentos, kimonos de competição, rashguards, fight shorts e luvas oficiais da equipe.
          </p>
        </div>

        {currentRole !== 'aluno' && (
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Produto</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar produto por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden"
          >
            <option value="all">Todas as Categorias</option>
            <option value="Kimonos">Kimonos</option>
            <option value="Camisas">Camisas & Rashguards</option>
            <option value="Shorts & Bermudas">Shorts & Bermudas</option>
            <option value="Luvas">Luvas</option>
            <option value="Faixas & Acessórios">Faixas & Acessórios</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(prod => {
          const isLowStock = prod.stock <= prod.minStockAlert;
          return (
            <div 
              key={prod.id}
              className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition-all"
            >
              <div>
                <div className="relative h-48 bg-neutral-950 overflow-hidden">
                  <img 
                    src={prod.photoUrl} 
                    alt={prod.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-900/90 text-amber-400 border border-neutral-700 backdrop-blur-xs">
                    {prod.category}
                  </span>

                  {isLowStock && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/90 text-white flex items-center gap-1 backdrop-blur-xs">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Estoque Baixo</span>
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-neutral-100 group-hover:text-amber-400 transition-colors">
                    {prod.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-xl font-mono font-extrabold text-amber-400">
                      R$ {prod.price.toFixed(2)}
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      Estoque: <strong className={isLowStock ? 'text-red-400' : 'text-emerald-400'}>{prod.stock} un.</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    {prod.sizes.map((size, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-300">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutProduct(prod);
                    setShowCheckoutModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Registrar Venda / Pedido</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Registrar Venda */}
      {showCheckoutModal && checkoutProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Finalizar Venda na Loja Gaditas</h2>
              <button type="button" onClick={() => setShowCheckoutModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSale} className="space-y-3">
              <div>
                <span className="text-neutral-400 block mb-1">Produto Selecionado</span>
                <p className="font-bold text-neutral-100 text-sm">{checkoutProduct.name}</p>
                <p className="text-amber-400 font-mono text-base font-bold">R$ {checkoutProduct.price.toFixed(2)} un.</p>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Nome do Comprador / Aluno</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  max={checkoutProduct.stock}
                  value={quantityToBuy}
                  onChange={(e) => setQuantityToBuy(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden font-mono"
                />
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Total a Lançar no Caixa:</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  R$ {(checkoutProduct.price * quantityToBuy).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold"
                >
                  Confirmar Venda & Baixar Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Produto */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-bold text-neutral-100 text-sm font-cinzel">Cadastrar Produto no Estoque</h2>
              <button type="button" onClick={() => setShowNewModal(false)} className="text-neutral-400 hover:text-neutral-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-neutral-300 block mb-1">Nome do Equipamento</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Kimono Gaditas White Edition"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                  >
                    <option value="Kimonos">Kimonos</option>
                    <option value="Camisas">Camisas</option>
                    <option value="Shorts & Bermudas">Shorts & Bermudas</option>
                    <option value="Luvas">Luvas</option>
                    <option value="Faixas & Acessórios">Faixas & Acessórios</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">Tamanhos Disponíveis (separados por vírgula)</label>
                <input
                  type="text"
                  value={sizesInput}
                  onChange={(e) => setSizesInput(e.target.value)}
                  placeholder="Ex: A1, A2, A3, P, M, G"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-neutral-300 block mb-1">URL da Imagem</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
