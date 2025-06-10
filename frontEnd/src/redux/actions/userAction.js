import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const LoginAction = createAsyncThunk(
    "auth/login",
    async (formData, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/Auth/SignIn",
          formData,
          {
            withCredentials: true,
          }
        );
        console.log("Data to dispatch", response.data);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const GithubLoginAction = createAsyncThunk(
    "auth/githubLogin",
    async (_, { rejectWithValue }) => {
      try {
        // Force la redirection vers GitHub
        window.location.href = "http://localhost:3000/auth/github";
        return null;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const GithubCallbackAction = createAsyncThunk(
    "auth/githubCallback",
    async (queryParams, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/github/callback${queryParams}`,
          { withCredentials: true }
        );
        return response.data;      // { message, data: user, status, token }
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  export const ForgotPasswordAction = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/auth/forgot-password",
          { email },
          { withCredentials: true }
        );
        return response.data.message;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || "Erreur inconnue"
        );
      }
    }
  );

  
/* export const LogoutAction =createAsyncThunk(
    
)
export const UpdateUserAction =createAsyncThunk(
   
) */ 