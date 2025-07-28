
import { createSlice } from "@reduxjs/toolkit";
import { LoginAction,GithubLoginAction, GithubCallbackAction,ForgotPasswordAction,FetchUserProfile,UpdatePasswordAction,LogoutAction,GoogleLoginAction,GoogleCallbackAction} from "../actions/userAction";
const initialState = {
  CurrentUser: null,
  loading: false,
  error: false,        // null ou string
  successMessage: null,
  errorMessage: null,
  token: null,
}

const userSlice = createSlice({
name:'user',
initialState,
reducers:{},
extraReducers:(builder) =>{
    builder
   .addCase(LoginAction.pending,(state)=>{
        state.loading= true;
        state.error=false;

    })
    .addCase(LoginAction.fulfilled,(state,action)=>{
        state.loading= false;
        state.CurrentUser= action.payload;
        state.error=false;
        localStorage.setItem("token", action.payload?.token?.accessToken);
        })
   .addCase(LoginAction.rejected,(state)=>{
        state.loading= false;
        state.error=true;
        state.CurrentUser=null;
    })
      // GitHub Login Actions
    .addCase(GithubLoginAction.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
    .addCase(GithubLoginAction.fulfilled, (state,action) => {
        state.isFetching = false;
        state.error = false;
        state.CurrentUser = action.payload; 
      })
    .addCase(GithubLoginAction.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      // GitHub Callback Actions
    .addCase(GithubCallbackAction.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
    .addCase(GithubCallbackAction.fulfilled, (state, action) => {
        state.isFetching = false;
        state.CurrentUser = action.payload.data;
        state.token = action.payload.token;
        
        state.error = false;
      })
    .addCase(GithubCallbackAction.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
        state.CurrentUser = null;
        
        
      })
    .addCase(ForgotPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
    .addCase(ForgotPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.successMessage = action.payload;
      })

    .addCase(ForgotPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.errorMessage = action.payload;
      })
    .addCase(FetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = false;
    })
    .addCase(FetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
     
        state.CurrentUser = action.payload.data;
        state.error = false;
    })
    .addCase(FetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        // Stocke le message d'erreur pour l'afficher si besoin
        state.error = true;
        state.errorMessage = action.payload;
        state.CurrentUser = null;
    })
  .addCase(UpdatePasswordAction.pending, (state) => {
      state.loading = true;
      state.error = false;
      state.successMessage = null;
      state.errorMessage = null;
  })
  .addCase(UpdatePasswordAction.fulfilled, (state, action) => {
    state.loading = false;
    state.error = false;
    state.successMessage = action.payload.message;
    state.CurrentUser = action.payload.user || action.payload.data;
    // MAJ token seulement si présent
    if (action.payload?.token?.accessToken) {
      state.token = action.payload.token.accessToken;
    }
  })
  .addCase(UpdatePasswordAction.rejected, (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.payload;
  })
  .addCase(LogoutAction.fulfilled, (state) => {
    state.loading = false;
    state.CurrentUser = null;
    state.error = false;
    localStorage.removeItem("token");
  })
  .addCase(LogoutAction.rejected, (state) => {
    state.loading = false;
    state.error = true;
  })
  .addCase(LogoutAction.pending, (state) => {
    state.loading = true;
    state.error = false;
  })
  // Google Login Actions
.addCase(GoogleLoginAction.pending, (state) => {
  state.isFetching = true;
  state.error = false;
})
.addCase(GoogleLoginAction.fulfilled, (state) => {
  state.isFetching = false;
})
.addCase(GoogleLoginAction.rejected, (state) => {
  state.isFetching = false;
  state.error = true;
})

// Google Callback Actions
.addCase(GoogleCallbackAction.pending, (state) => {
  state.isFetching = true;
  state.error = false;
})
.addCase(GoogleCallbackAction.fulfilled, (state, action) => {
  state.isFetching = false;
  state.CurrentUser = action.payload.data;
  state.token = action.payload.token;
  state.error = false;
  localStorage.setItem("token", action.payload.token);

})

.addCase(GoogleCallbackAction.rejected, (state) => {
  state.isFetching = false;
  state.error = true;
  state.CurrentUser = null;
})


  

     
      

    /* .addCase(LogoutAction.pending,(state)=>{
        state.loading= true;
        state.error=false;
    })
    .addCase(LogoutAction.fulfilled,(state)=>{
        state.loading= false;
        state.CurrentUser=null;
        state.error=false;
    })
    .addCase(LogoutAction.rejected,(state)=>{
        state.loading= false;
        state.error=true;
    })
    .addCase(UpdateUserAction.fulfilled,(state,action)=>{
        state.loading= false;
        state.CurrentUser=action.payload;
        state.error=false;
    }) */


}


});

export default userSlice.reducer;

