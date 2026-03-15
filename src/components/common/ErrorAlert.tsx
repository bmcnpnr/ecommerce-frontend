import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface ErrorAlertProps {
  error: Error | string | null;
  title?: string;
  onRetry?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, title = 'Error', onRetry }) => {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;

  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>{title}</AlertTitle>
      <Box>{message}</Box>
    </Alert>
  );
};

export default ErrorAlert;
