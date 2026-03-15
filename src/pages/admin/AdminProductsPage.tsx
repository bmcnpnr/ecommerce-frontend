import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, CreateProductFormData } from '../../utils/validators';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useUpdateStock } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../../api/categories.api';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PRODUCT_STATUS_COLORS } from '../../constants';
import { ProductDTO } from '../../types';
import ErrorAlert from '../../components/common/ErrorAlert';

const AdminProductsPage: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [stockUpdateProduct, setStockUpdateProduct] = useState<ProductDTO | null>(null);
  const [stockDelta, setStockDelta] = useState(0);

  const { data: productsData, isLoading, error } = useProducts(page, 20);
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
  });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const stockMutation = useUpdateStock();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { price: 0, stockQuantity: 0 },
  });

  const handleCreate = async (data: CreateProductFormData) => {
    try {
      await createMutation.mutateAsync(data);
      showSnackbar('Product created!', 'success');
      setCreateOpen(false);
      reset();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to create product', 'error');
    }
  };

  const handleEdit = async (data: CreateProductFormData) => {
    if (!editingProduct) return;
    try {
      await updateMutation.mutateAsync({ id: editingProduct.id, data });
      showSnackbar('Product updated!', 'success');
      setEditingProduct(null);
      reset();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to update product', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      showSnackbar('Product deleted!', 'success');
      setDeletingId(null);
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to delete product', 'error');
    }
  };

  const handleStockUpdate = async () => {
    if (!stockUpdateProduct) return;
    try {
      await stockMutation.mutateAsync({ id: stockUpdateProduct.id, delta: stockDelta });
      showSnackbar('Stock updated!', 'success');
      setStockUpdateProduct(null);
      setStockDelta(0);
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to update stock', 'error');
    }
  };

  const openEdit = (product: ProductDTO) => {
    setEditingProduct(product);
    reset({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      brand: product.brand || '',
      categoryId: product.categoryId,
    });
  };

  const ProductForm = ({ onSubmit, isEdit }: { onSubmit: (d: CreateProductFormData) => void; isEdit: boolean }) => (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="SKU *" fullWidth {...register('sku')} error={!!errors.sku} helperText={errors.sku?.message} disabled={isEdit} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Name *" fullWidth {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField label="Description" fullWidth multiline rows={2} {...register('description')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Price *"
            type="number"
            fullWidth
            {...register('price', { valueAsNumber: true })}
            error={!!errors.price}
            helperText={errors.price?.message}
            slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Stock Quantity *"
            type="number"
            fullWidth
            {...register('stockQuantity', { valueAsNumber: true })}
            error={!!errors.stockQuantity}
            helperText={errors.stockQuantity?.message}
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Brand" fullWidth {...register('brand')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select {...field} label="Category" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}>
                  <MenuItem value="">None</MenuItem>
                  {categories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setCreateOpen(true); reset({ price: 0, stockQuantity: 0 }); }}
        >
          Add Product
        </Button>
      </Box>

      {error && <ErrorAlert error={error as Error} />}

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : productsData?.content.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{product.sku}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{product.name}</Typography>
                      {product.brand && <Typography variant="caption" color="text.secondary">{product.brand}</Typography>}
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        {product.stockQuantity}
                        <Tooltip title="Update Stock">
                          <IconButton size="small" onClick={() => { setStockUpdateProduct(product); setStockDelta(0); }}>
                            <InventoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.status} color={PRODUCT_STATUS_COLORS[product.status]} size="small" />
                    </TableCell>
                    <TableCell>
                      {product.categoryId ? categories?.find((c) => c.id === product.categoryId)?.name || '-' : '-'}
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(product)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeletingId(product.id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {productsData && productsData.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={productsData.totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} color="primary" />
        </Box>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent>
          <ProductForm onSubmit={handleCreate} isEdit={false} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit(handleCreate)}
            disabled={createMutation.isPending}
            startIcon={createMutation.isPending ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editingProduct !== null} onClose={() => setEditingProduct(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <ProductForm onSubmit={handleEdit} isEdit />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingProduct(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit(handleEdit)}
            disabled={updateMutation.isPending}
            startIcon={updateMutation.isPending ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog open={stockUpdateProduct !== null} onClose={() => setStockUpdateProduct(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Stock - {stockUpdateProduct?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Current stock: {stockUpdateProduct?.stockQuantity}. Enter a positive or negative delta.
          </Typography>
          <TextField
            label="Delta"
            type="number"
            fullWidth
            value={stockDelta}
            onChange={(e) => setStockDelta(Number(e.target.value))}
            helperText="Positive = add, Negative = subtract"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStockUpdateProduct(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleStockUpdate}
            disabled={stockMutation.isPending}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deletingId !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
};

export default AdminProductsPage;
