import React from 'react';
import Grid from '@mui/material/Grid2';
import { ProductDTO } from '../../types';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import { useCart } from '../../hooks/useCart';

interface ProductGridProps {
  products: ProductDTO[];
  isLoading?: boolean;
  skeletonCount?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  skeletonCount = 8,
}) => {
  const { addToCart, isAdding } = useCart();

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ProductCard
            product={product}
            onAddToCart={(p) => addToCart(p.id, 1)}
            isAddingToCart={isAdding}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
