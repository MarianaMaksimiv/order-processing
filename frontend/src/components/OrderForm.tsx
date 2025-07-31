import React, { useState, useEffect } from 'react';
import { Product, CreateOrderRequest } from '../types';
import { api } from '../services/api';

interface OrderFormProps {
  onSubmit: (orderData: CreateOrderRequest) => void;
  isSubmitting: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, isSubmitting }) => {
  const [customerName, setCustomerName] = useState('');
  const [productId, setProductId] = useState<number | ''>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await api.getProducts();
        setProducts(productsData);
        if (productsData.length > 0) {
          setProductId(productsData[0].id);
        }
      } catch (err) {
        setError('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }

    if (!productId) {
      setError('Please select a product');
      return;
    }

    setError('');
    onSubmit({
      customerName: customerName.trim(),
      productId: Number(productId),
    });

    // Reset form
    setCustomerName('');
    setProductId(products.length > 0 ? products[0].id : '');
  };

  return (
    <div className="order-form">
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product">Product:</label>
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
            disabled={isSubmitting}
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
};