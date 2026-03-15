import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: 'background.default', py: 4 }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="primary.main"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none' }}
          >
            ShopMicro
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
