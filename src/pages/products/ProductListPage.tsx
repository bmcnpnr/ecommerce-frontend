import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts, useProductSearch, useProductsByCategory } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../../api/categories.api';
import ProductGrid from '../../components/product/ProductGrid';
import EmptyState from '../../components/common/EmptyState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { ProductStatus } from '../../types';

const SIDEBAR_WIDTH = 240;

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | ''>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const searchQuery = searchParams.get('q') || '';
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null;

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: allProductsData,
    isLoading: allLoading,
    error: allError,
  } = useProducts(page, 20);

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useProductSearch(searchQuery, page, 20);

  const {
    data: categoryProducts,
    isLoading: categoryLoading,
  } = useProductsByCategory(categoryId);

  const isSearchMode = searchQuery.length > 0;
  const isCategoryMode = categoryId !== null;

  let products = isSearchMode
    ? (searchData?.content || [])
    : isCategoryMode
    ? (categoryProducts || [])
    : (allProductsData?.content || []);

  const totalPages = isSearchMode
    ? (searchData?.totalPages || 1)
    : isCategoryMode
    ? 1
    : (allProductsData?.totalPages || 1);

  const isLoading = isSearchMode ? searchLoading : isCategoryMode ? categoryLoading : allLoading;
  const error = isSearchMode ? searchError : allError;

  // Filter by status
  if (statusFilter) {
    products = products.filter((p) => p.status === statusFilter);
  }

  const selectedCategory = categories?.find((c) => c.id === categoryId);

  const handleCategoryClick = (catId: number | null) => {
    const params = new URLSearchParams();
    if (catId) params.set('categoryId', String(catId));
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
    setPage(0);
    setMobileOpen(false);
  };

  useEffect(() => {
    setPage(0);
  }, [searchQuery, categoryId]);

  const sidebar = (
    <Box sx={{ width: SIDEBAR_WIDTH }}>
      <Typography variant="subtitle1" fontWeight={600} px={2} py={1.5}>
        Categories
      </Typography>
      <List dense disablePadding>
        <ListItemButton
          selected={!categoryId}
          onClick={() => handleCategoryClick(null)}
        >
          <ListItemText primary="All Products" />
        </ListItemButton>
        {categories?.map((cat) => (
          <ListItemButton
            key={cat.id}
            selected={categoryId === cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            sx={{ pl: cat.parentCategoryId ? 4 : 2 }}
          >
            <ListItemText primary={cat.name} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle1" fontWeight={600} px={2} py={1.5}>
        Status
      </Typography>
      <Box px={2} pb={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Filter by status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by status"
            onChange={(e) => setStatusFilter(e.target.value as ProductStatus | '')}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="ACTIVE">In Stock</MenuItem>
            <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" gap={3}>
        {/* Desktop sidebar */}
        <Paper
          sx={{ display: { xs: 'none', md: 'block' }, width: SIDEBAR_WIDTH, flexShrink: 0, alignSelf: 'flex-start', borderRadius: 2 }}
          elevation={1}
        >
          {sidebar}
        </Paper>

        {/* Mobile sidebar */}
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { md: 'none' } }}
        >
          {sidebar}
        </Drawer>

        {/* Main content */}
        <Box flexGrow={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {isSearchMode
                  ? `Search: "${searchQuery}"`
                  : selectedCategory
                  ? selectedCategory.name
                  : 'All Products'}
              </Typography>
              {statusFilter && (
                <Chip
                  label={`Status: ${statusFilter}`}
                  onDelete={() => setStatusFilter('')}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>
            <Button
              startIcon={<FilterListIcon />}
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              Filters
            </Button>
          </Box>

          {error && <ErrorAlert error={error as Error} />}

          {!isLoading && products.length === 0 && (
            <EmptyState
              title="No products found"
              description={
                isSearchMode
                  ? `No results for "${searchQuery}". Try different keywords.`
                  : 'No products available in this category.'
              }
              actionLabel="Browse All Products"
              onAction={() => navigate('/products')}
            />
          )}

          <ProductGrid products={products} isLoading={isLoading} />

          {totalPages > 1 && !isCategoryMode && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_, value) => setPage(value - 1)}
                color="primary"
              />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductListPage;
