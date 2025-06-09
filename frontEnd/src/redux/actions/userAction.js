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
  
/* export const LogoutAction =createAsyncThunk(
    
)
export const UpdateUserAction =createAsyncThunk(
   
) */ 