import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
        textAlign="center"
        gap={2}
      >
        <Typography variant="h1" fontWeight={900} color="primary.main" sx={{ fontSize: '8rem', lineHeight: 1 }}>
          404
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={400}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
