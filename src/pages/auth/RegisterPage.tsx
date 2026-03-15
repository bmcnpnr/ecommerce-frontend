import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../utils/validators';
import { useRegister } from '../../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Join ShopMicro today!
      </Typography>

      {registerMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {registerMutation.error?.message || 'Registration failed. Please try again.'}
        </Alert>
      )}

      {registerMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Account created! Redirecting to login...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Username *"
              fullWidth
              autoComplete="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message || 'Letters, numbers, and underscores only (3-50 chars)'}
              disabled={registerMutation.isPending}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email *"
              type="email"
              fullWidth
              autoComplete="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={registerMutation.isPending}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Password *"
              type="password"
              fullWidth
              autoComplete="new-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message || 'Minimum 8 characters'}
              disabled={registerMutation.isPending}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="First Name"
              fullWidth
              autoComplete="given-name"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              disabled={registerMutation.isPending}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Last Name"
              fullWidth
              autoComplete="family-name"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              disabled={registerMutation.isPending}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Phone Number"
              fullWidth
              autoComplete="tel"
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              disabled={registerMutation.isPending}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={registerMutation.isPending}
              startIcon={
                registerMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box textAlign="center" mt={3}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" fontWeight={600}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterPage;
