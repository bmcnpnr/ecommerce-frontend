import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="white" gutterBottom fontWeight={700}>
              ShopMicro
            </Typography>
            <Typography variant="body2">
              Your one-stop ecommerce platform powered by microservices architecture.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Link component={RouterLink} to="/" color="inherit" underline="hover" variant="body2">
                Home
              </Link>
              <Link component={RouterLink} to="/products" color="inherit" underline="hover" variant="body2">
                Products
              </Link>
              <Link component={RouterLink} to="/tracking" color="inherit" underline="hover" variant="body2">
                Track Order
              </Link>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Account
            </Typography>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Link component={RouterLink} to="/login" color="inherit" underline="hover" variant="body2">
                Login
              </Link>
              <Link component={RouterLink} to="/register" color="inherit" underline="hover" variant="body2">
                Register
              </Link>
              <Link component={RouterLink} to="/orders" color="inherit" underline="hover" variant="body2">
                My Orders
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: 'grey.700', my: 3 }} />
        <Typography variant="body2" textAlign="center">
          © {new Date().getFullYear()} ShopMicro. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
