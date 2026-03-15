import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { OrderItemDTO } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface OrderItemRowProps {
  item: OrderItemDTO;
}

const OrderItemRow: React.FC<OrderItemRowProps> = ({ item }) => {
  return (
    <TableRow>
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {item.productName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Product ID: {item.productId}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2">{formatCurrency(item.productPrice)}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">{item.quantity}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(item.productPrice * item.quantity)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default OrderItemRow;
