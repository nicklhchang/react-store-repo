const authReducer = function(state,action) {
    switch (action.type) {
        case 'authenticate':
            return {
                isAuthenticated:true,
                currentUser:action.payload.user,
                currentSessionCookie:action.payload.sessionCookie
            }
        case 'unauthenticate':
            return {
                isAuthenticated:false,
                currentUser:null,
                currentSessionCookie:null
            }
        default:
            throw new Error('oopsie no authdispatch matched');
        
    }
}

const sidebarReducer = function(state,action) {
    switch (action.type) {
        case 'open':
            return {
                ...state,
                isSidebarOpen:true,
            }
        case 'close':
            return {
                ...state,
                isSidebarOpen:false
            }
        case 'filter':
            return {
                ...state,
                sidebarFilterOptions:action.payload.arr
            }
        default:
            throw new Error('oopsie no sidebardispatch matched');
    }
}

export { authReducer,sidebarReducer };