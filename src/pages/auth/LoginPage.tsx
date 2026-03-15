import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../utils/validators';
import { useLogin } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
        Sign In
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Welcome back! Please sign in to your account.
      </Typography>

      {loginMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loginMutation.error?.message || 'Invalid credentials. Please try again.'}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Username"
          fullWidth
          autoComplete="username"
          autoFocus
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={loginMutation.isPending}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          autoComplete="current-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={loginMutation.isPending}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loginMutation.isPending}
          startIcon={loginMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ mt: 1 }}
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </Box>

      <Box textAlign="center" mt={3}>
        <Typography variant="body2">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/register" fontWeight={600}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
