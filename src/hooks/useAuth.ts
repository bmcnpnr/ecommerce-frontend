import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { LoginRequest, RegisterRequest, UpdateUserRequest } from '../types';

export const useAuth = () => {
  const { token, username, role, isAuthenticated, login, logout } = useAuthStore();
  return { token, username, role, isAuthenticated, login, logout };
};

export const useLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      login({ token: data.token, username: data.username, role: data.role, expiresIn: data.expiresIn });
      queryClient.clear();
      const intended = sessionStorage.getItem('intendedPath');
      if (intended) {
        sessionStorage.removeItem('intendedPath');
        navigate(intended);
      } else {
        navigate('/');
      }
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      navigate('/login');
    },
  });
};

export const useCurrentUser = () => {
  const { username, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['me', username],
    queryFn: () => authApi.getMe(username!),
    enabled: isAuthenticated && !!username,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();
  const { username } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => authApi.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', username] });
    },
  });
};
