import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../../api/categories.api';
import ProductGrid from '../../components/product/ProductGrid';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: productsData, isLoading: productsLoading } = useProducts(0, 8);
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
    staleTime: 10 * 60 * 1000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly with real-time tracking.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-grade security.',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: '24/7 Support',
      description: 'Our support team is always available to help you.',
    },
  ];

  return (
    <Box>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography variant="h2" fontWeight={800} mb={2} sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              Discover Amazing Products
            </Typography>
            <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
              Shop from thousands of products with fast delivery and great prices
            </Typography>
            <Box
              component="form"
              onSubmit={handleSearch}
              display="flex"
              maxWidth={600}
              mx="auto"
              gap={1}
            >
              <TextField
                fullWidth
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                sx={{
                  bgcolor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': { borderRadius: 1 },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ bgcolor: 'white', color: 'primary.main', px: 3, '&:hover': { bgcolor: 'grey.100' } }}
              >
                Search
              </Button>
            </Box>
            <Box mt={3}>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/products')}
                sx={{ borderColor: 'rgba(255,255,255,0.7)' }}
              >
                Browse All Products
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Shop by Category
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          <Chip
            label="All Products"
            onClick={() => navigate('/products')}
            color="primary"
            sx={{ fontSize: '0.9rem', py: 2, px: 1 }}
          />
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" width={100} height={32} />
              ))
            : categories?.slice(0, 10).map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                  variant="outlined"
                  sx={{ fontSize: '0.9rem', py: 2, px: 1, cursor: 'pointer' }}
                />
              ))}
        </Box>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={700}>
            Featured Products
          </Typography>
          <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/products')}>
            View All
          </Button>
        </Box>

        <ProductGrid
          products={productsData?.content || []}
          isLoading={productsLoading}
          skeletonCount={8}
        />
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={4}>
            Why Choose ShopMicro?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
                <Paper elevation={0} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'white' }}>
                  <Box mb={2}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
