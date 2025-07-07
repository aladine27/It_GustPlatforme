import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const LoginAction = createAsyncThunk(
    "auth/login",
    async (formData, { rejectWithValue }) => {
      try {
        console.log("[FRONT] LoginAction → Données envoyées :", formData);
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
        console.log("[FRONT] LoginAction → ERROR :", error?.response?.data || error.message);
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
        return response.data;    
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  export const GoogleLoginAction = createAsyncThunk(
    "auth/googleLogin",
    async (_, { rejectWithValue }) => {
      try {
        window.location.href = "http://localhost:3000/auth/google";
        return null;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const GoogleCallbackAction = createAsyncThunk(
    "auth/googleCallback",
    async (queryParams, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/google/callback${queryParams}`,
          { withCredentials: true }
        );
        return response.data; // { message, data, token }
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || error.message
        );
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
  export const FetchUserProfile = createAsyncThunk(
    "user/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "http://localhost:3000/Auth/profile",
                {
                    withCredentials: true,
                }
            );
         
            return response.data;
        } catch (error) {
            // Rejeter avec un message d'erreur clair en cas d'échec
            const errorMessage = error.response?.data?.message || "Impossible de récupérer le profil.";
            return rejectWithValue(errorMessage);
        }
    }
);
export const updateUserAction = createAsyncThunk(
  "user/updateProfile",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // Liste blanche des champs modifiables
      const allowedFields = ['fullName', 'email', 'phone', 'address', 'domain'];
      allowedFields.forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });
      // Si l’utilisateur a sélectionné une nouvelle image, userData.image est un File
      if (userData.image && userData.image instanceof File) {
        formData.append('image', userData.image);
      }
          
          const response = await axios.patch(
            `http://localhost:3000/Auth/updateprofile/${id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          return response.data;
        } catch (error) {
          // Si 401, renvoyer le message ou code pour gérer en front
          return rejectWithValue(error.response?.data || error.message);
        }
      }
    );
    export const UpdatePasswordAction = createAsyncThunk(
      "user/updatePassword",
      async ({ id, oldPassword, newPassword }, { rejectWithValue }) => {
        try {
          const response = await axios.patch(
            `http://localhost:3000/Auth/updatepassword/${id}`,
            { oldPassword, password: newPassword },  
            { withCredentials: true }
          );
               // Sauvegarde immédiate du token côté front
               if (response.data?.token?.accessToken) {
                localStorage.setItem("token", response.data.token.accessToken);
              }
          return response.data; 
        } catch (error) {
          // on renvoie le message brut du backend (NotFoundException, BadRequestException, etc.)
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    );
    export const clearError = () => (dispatch) => {
      dispatch({ type: 'CLEAR_USER_ERROR' });
    };
  
    export const LogoutAction = createAsyncThunk(
      "user/logout",
      async (_, { rejectWithValue }) => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:3000/Auth/Logout", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        
        );
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    );
    
    
    

  
 

  
/* export const LogoutAction =createAsyncThunk(
    
)
export const UpdateUserAction =createAsyncThunk(
   
) */ 