import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trackingSearchSchema, TrackingSearchFormData } from '../../utils/validators';
import { useShipmentByTracking, useShipmentHistory } from '../../hooks/useShipments';
import { SHIPMENT_STATUS_COLORS } from '../../constants';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TrackingPage: React.FC = () => {
  const { trackingNumber: urlTrackingNumber } = useParams<{ trackingNumber?: string }>();
  const navigate = useNavigate();
  const [searchTracking, setSearchTracking] = useState<string | null>(urlTrackingNumber || null);

  const { register, handleSubmit, formState: { errors } } = useForm<TrackingSearchFormData>({
    resolver: zodResolver(trackingSearchSchema),
    defaultValues: { trackingNumber: urlTrackingNumber || '' },
  });

  const { data: shipment, isLoading, error } = useShipmentByTracking(searchTracking);
  const { data: history } = useShipmentHistory(shipment?.id ?? null);

  const onSearch = (data: TrackingSearchFormData) => {
    setSearchTracking(data.trackingNumber);
    navigate(`/tracking/${data.trackingNumber}`, { replace: true });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <LocalShippingIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
        <Typography variant="h4" fontWeight={700} mb={1}>
          Track Your Package
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your tracking number to get real-time updates
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }} elevation={1}>
        <Box component="form" onSubmit={handleSubmit(onSearch)} display="flex" gap={2}>
          <TextField
            fullWidth
            label="Tracking Number"
            placeholder="Enter tracking number..."
            {...register('trackingNumber')}
            error={!!errors.trackingNumber}
            helperText={errors.trackingNumber?.message}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            sx={{ minWidth: 120 }}
          >
            Track
          </Button>
        </Box>
      </Paper>

      {isLoading && <LoadingSpinner message="Tracking your package..." />}

      {error && (
        <Alert severity="error">
          Tracking number not found. Please check the number and try again.
        </Alert>
      )}

      {shipment && (
        <Paper elevation={1}>
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} flexWrap="wrap" gap={2}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Tracking #{shipment.trackingNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Order #{shipment.orderId}
                </Typography>
              </Box>
              <Chip
                label={shipment.status.replace(/_/g, ' ')}
                color={SHIPMENT_STATUS_COLORS[shipment.status]}
                size="medium"
              />
            </Box>

            <Grid container spacing={2} mb={3}>
              {shipment.carrier && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Carrier</Typography>
                  <Typography variant="body1" fontWeight={500}>{shipment.carrier}</Typography>
                </Grid>
              )}
              {shipment.estimatedDelivery && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Estimated Delivery</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatDate(shipment.estimatedDelivery)}
                  </Typography>
                </Grid>
              )}
              {shipment.actualDelivery && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">Delivered On</Typography>
                  <Typography variant="body1" fontWeight={500} color="success.main">
                    {formatDateTime(shipment.actualDelivery)}
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2} mb={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  From
                </Typography>
                <Typography variant="body2">{shipment.originAddress}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  To
                </Typography>
                <Typography variant="body2">{shipment.destinationAddress}</Typography>
              </Grid>
            </Grid>

            {history && history.length > 0 && (
              <>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Tracking History
                </Typography>
                <Timeline sx={{ p: 0 }}>
                  {history.map((event, index) => (
                    <TimelineItem key={event.id}>
                      <TimelineOppositeContent sx={{ m: 'auto 0', flex: 0.35 }} variant="caption" color="text.secondary">
                        {formatDateTime(event.eventTimestamp)}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={index === 0 ? 'primary' : 'grey'}
                          variant={index === 0 ? 'filled' : 'outlined'}
                        />
                        {index < history.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {event.newStatus.replace(/_/g, ' ')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.eventDescription}
                        </Typography>
                        {event.location && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            {event.location}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </>
            )}
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default TrackingPage;
