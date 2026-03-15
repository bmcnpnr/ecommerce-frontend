import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../../api/categories.api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  path: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, path, isLoading }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardActionArea onClick={() => navigate(path)}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={60} height={48} />
              ) : (
                <Typography variant="h3" fontWeight={700}>
                  {value}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: productsData, isLoading: productsLoading } = useProducts(0, 1);
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  const quickLinks = [
    { label: 'Manage Products', icon: <InventoryIcon />, path: '/admin/products', color: '#1976d2' },
    { label: 'Manage Categories', icon: <CategoryIcon />, path: '/admin/categories', color: '#9c27b0' },
    { label: 'Manage Orders', icon: <ShoppingBagIcon />, path: '/admin/orders', color: '#ed6c02' },
    { label: 'Moderate Reviews', icon: <RateReviewIcon />, path: '/admin/reviews', color: '#2e7d32' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Products"
            value={productsData?.totalElements ?? '-'}
            icon={<InventoryIcon />}
            color="#1976d2"
            path="/admin/products"
            isLoading={productsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Categories"
            value={categories?.length ?? '-'}
            icon={<CategoryIcon />}
            color="#9c27b0"
            path="/admin/categories"
            isLoading={categoriesLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Orders"
            value="—"
            icon={<ShoppingBagIcon />}
            color="#ed6c02"
            path="/admin/orders"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Reviews"
            value="—"
            icon={<RateReviewIcon />}
            color="#2e7d32"
            path="/admin/reviews"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={600} mb={2}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {quickLinks.map((link) => (
          <Grid key={link.path} size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={link.icon}
              onClick={() => navigate(link.path)}
              sx={{ py: 2, justifyContent: 'flex-start', borderColor: link.color, color: link.color }}
            >
              {link.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
