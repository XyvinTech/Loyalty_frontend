import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authApi from "../api/auth";

/**
 * Custom hook for authentication using TanStack Query
 */
export function useAuth() {
  const queryClient = useQueryClient();

  // Login user
  const useLogin = () => {
    return useMutation({
      mutationFn: (credentials) => authApi.login(credentials),
      onSuccess: (data) => {
        // Store token in localStorage

        if (data?.data) {
          localStorage.setItem("token", data?.data);
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
      },
    });
  };

  // Check if user is authenticated
  const useIsAuthenticated = () => {
    const {
      data: user,
      isLoading,
      refetch,
    } = useGetCurrentUser({
      enabled: !!localStorage.getItem("token"),
    });

    return {
      isAuthenticated: !!user,
      user,
      isLoading,
      refetchUser: refetch,
    };
  };

  // Force password change (for first-time login)
  const useForcePasswordChange = () => {
    return useMutation({
      mutationFn: (passwordData) => authApi.forcePasswordChange(passwordData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      },
    });
  };

  return {
    useLogin,
    useRegister,
    useGetCurrentUser,
    useUpdateProfile,
    useChangePassword,
    useLogout,
    useIsAuthenticated,
    useForcePasswordChange,
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
