import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatOrderStatus, truncateText } from '../../utils/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats a number as USD currency', () => {
      expect(formatCurrency(29.99)).toBe('$29.99');
    });

    it('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('formats large numbers with commas', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });
  });

  describe('formatDate', () => {
    it('formats an ISO date string', () => {
      const result = formatDate('2024-01-15T10:00:00Z');
      expect(result).toMatch(/Jan|15|2024/);
    });

    it('returns the original value if parsing fails', () => {
      // formatDate catches errors and returns the original string
      expect(formatDate('not-a-date')).toBe('not-a-date');
    });
  });

  describe('formatOrderStatus', () => {
    it('capitalises first letter and lowercases the rest, replacing underscores with spaces', () => {
      expect(formatOrderStatus('PENDING')).toBe('Pending');
      // charAt(0) + slice(1).toLowerCase().replace(/_/g,' ') → "Out of stock"
      expect(formatOrderStatus('OUT_OF_STOCK')).toBe('Out of stock');
    });
  });

  describe('truncateText', () => {
    it('returns the original string if shorter than limit', () => {
      expect(truncateText('hello', 10)).toBe('hello');
    });

    it('truncates and appends ellipsis', () => {
      expect(truncateText('hello world', 5)).toBe('hello...');
    });
  });
});
