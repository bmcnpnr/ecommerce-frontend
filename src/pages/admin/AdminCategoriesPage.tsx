import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategorySchema, CreateCategoryFormData } from '../../utils/validators';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../../api/categories.api';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import { formatDate } from '../../utils/formatters';
import ErrorAlert from '../../components/common/ErrorAlert';

const AdminCategoriesPage: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: categoriesApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSnackbar('Category created!', 'success');
      setCreateOpen(false);
      reset();
    },
    onError: (err: Error) => {
      showSnackbar(err.message || 'Failed to create category', 'error');
    },
  });

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
  });

  const onSubmit = (data: CreateCategoryFormData) => {
    createMutation.mutate({
      name: data.name,
      description: data.description,
      parentCategoryId: data.parentCategoryId || undefined,
    });
  };

  const rootCategories = categories?.filter((c) => !c.parentCategoryId) || [];
  const childCategoriesMap = (categories || []).reduce<Record<number, typeof categories>>((acc, cat) => {
    if (cat.parentCategoryId) {
      if (!acc[cat.parentCategoryId]) acc[cat.parentCategoryId] = [];
      acc[cat.parentCategoryId]!.push(cat);
    }
    return acc;
  }, {});

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add Category
        </Button>
      </Box>

      {error && <ErrorAlert error={error as Error} />}

      <Paper elevation={1}>
        {isLoading ? (
          <Box p={2}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={56} />
            ))}
          </Box>
        ) : rootCategories.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">No categories yet. Create one!</Typography>
          </Box>
        ) : (
          <List>
            {rootCategories.map((cat, index) => (
              <React.Fragment key={cat.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight={600}>{cat.name}</Typography>
                        <Chip label={`ID: ${cat.id}`} size="small" variant="outlined" />
                      </Box>
                    }
                    secondary={
                      <Box>
                        {cat.description && <Typography variant="body2" color="text.secondary">{cat.description}</Typography>}
                        <Typography variant="caption" color="text.disabled">
                          Created: {formatDate(cat.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {childCategoriesMap[cat.id]?.map((child) => (
                  <ListItem key={child.id} sx={{ pl: 4 }}>
                    <SubdirectoryArrowRightIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 16 }} />
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight={500}>{child.name}</Typography>
                          <Chip label={`ID: ${child.id}`} size="small" variant="outlined" />
                        </Box>
                      }
                      secondary={child.description}
                    />
                  </ListItem>
                ))}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Category</DialogTitle>
        <DialogContent>
          <Box component="form" display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
            <TextField
              label="Name *"
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              {...register('description')}
            />
            <Controller
              name="parentCategoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Parent Category (optional)</InputLabel>
                  <Select
                    {...field}
                    label="Parent Category (optional)"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  >
                    <MenuItem value="">None (Root Category)</MenuItem>
                    {rootCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
            startIcon={createMutation.isPending ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategoriesPage;
