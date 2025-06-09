
import { createSlice } from "@reduxjs/toolkit";
import { LoginAction,} from "../actions/userAction";
const initialState = {
    CurrentUser:null,
    isFetching:false,
    error:false,
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
        })
   .addCase(LoginAction.rejected,(state)=>{
        state.loading= false;
        state.error=true;
        state.CurrentUser=null;
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

