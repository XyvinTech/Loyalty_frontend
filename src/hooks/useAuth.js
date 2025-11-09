import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authApi from "../api/auth";
import useAuthStore from "../store/auth";

/**
 * Custom hook for authentication using TanStack Query
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const setAuthState = useAuthStore((state) => state.setAuth);
  const clearAuthState = useAuthStore((state) => state.clearAuth);
  const setFirstLogin = useAuthStore((state) => state.setFirstLogin);

  // Login user
  const useLogin = () => {
    return useMutation({
      mutationFn: (credentials) => authApi.login(credentials),
      onSuccess: (data) => {
        const token = data?.data?.token;
        const isFirstLogin = Boolean(data?.data?.isFirstLogin);

        if (token) {
          localStorage.setItem("token", token);
          setAuthState({ token, isFirstLogin });
        }

        // Invalidate user query to refetch user data
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      },
    });
  };

  // Register user
  const useRegister = () => {
    return useMutation({
      mutationFn: (userData) => authApi.register(userData),
    });
  };

  // Get current user
  const useGetCurrentUser = (options = {}) => {
    return useQuery({
      queryKey: ["currentUser"],
      queryFn: () => authApi.getCurrentUser(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
      onSuccess: (response) => {
        if (response?.data) {
          setAuthState({
            user: response.data,
            token: localStorage.getItem("token"),
            isFirstLogin: useAuthStore.getState().isFirstLogin,
          });
        }
      },
      ...options,
    });
  };

  // Update profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: (userData) => authApi.updateProfile(userData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      },
    });
  };

  // Change password
  const useChangePassword = () => {
    return useMutation({
      mutationFn: (passwordData) => authApi.changePassword(passwordData),
      onSuccess: () => {
        setFirstLogin(false);
      },
    });
  };

  // Logout user
  const useLogout = () => {
    return useMutation({
      mutationFn: () => authApi.logout(),
      onSuccess: () => {
        // Remove token from localStorage
        localStorage.removeItem("token");

        // Clear user data from cache
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.setQueryData(["currentUser"], null);
        clearAuthState();
      },
    });
  };

  // Check if user is authenticated
  const useIsAuthenticated = () => {
    const { data: user, isLoading , refetch} = useGetCurrentUser({
      enabled: !!localStorage.getItem("token"),
    });

    return {
      isAuthenticated: !!user,
      user,
      isLoading,
      refetchUser: refetch,
    };
  };

  return {
    useLogin,
    useRegister,
    useGetCurrentUser,
    useUpdateProfile,
    useChangePassword,
    useLogout,
    useIsAuthenticated,
  };
}

//write an  example of implementing this is an email login page below
/**
import { useState } from 'react';
import { useAuth } from './useAuth';

const EmailLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, isLoggingIn, loginError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      setError(error.message);
    }
  };

      return (  
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};
*/
