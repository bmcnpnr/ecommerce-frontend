import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileFormData } from '../../utils/validators';
import { useCurrentUser, useUpdateUser } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import { formatDate } from '../../utils/formatters';

const ProfilePage: React.FC = () => {
  const { username } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const { data: user, isLoading } = useCurrentUser();
  const updateMutation = useUpdateUser(user?.id || 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        defaultShippingAddress: user.defaultShippingAddress || '',
        defaultBillingAddress: user.defaultBillingAddress || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      showSnackbar('Profile updated successfully!', 'success');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to update profile', 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
            {isLoading ? (
              <>
                <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
                <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
              </>
            ) : (
              <>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: 32,
                  }}
                >
                  {username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  @{user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {user?.email}
                </Typography>
                {user?.role && (
                  <Chip
                    label={user.role}
                    color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  Member since {user?.createdAt ? formatDate(user.createdAt) : '-'}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Edit Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Edit Profile
            </Typography>

            {updateMutation.isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {(updateMutation.error as Error)?.message || 'Failed to update profile'}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="First Name"
                    fullWidth
                    {...register('firstName')}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    disabled={updateMutation.isPending || isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    {...register('lastName')}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    disabled={updateMutation.isPending || isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    {...register('phoneNumber')}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    disabled={updateMutation.isPending || isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary" mb={1}>
                    Default Addresses
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Default Shipping Address"
                    fullWidth
                    multiline
                    rows={2}
                    {...register('defaultShippingAddress')}
                    error={!!errors.defaultShippingAddress}
                    helperText={errors.defaultShippingAddress?.message}
                    disabled={updateMutation.isPending || isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Default Billing Address"
                    fullWidth
                    multiline
                    rows={2}
                    {...register('defaultBillingAddress')}
                    error={!!errors.defaultBillingAddress}
                    helperText={errors.defaultBillingAddress?.message}
                    disabled={updateMutation.isPending || isLoading}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updateMutation.isPending || !isDirty || isLoading}
                    startIcon={updateMutation.isPending ? <CircularProgress size={16} color="inherit" /> : null}
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
