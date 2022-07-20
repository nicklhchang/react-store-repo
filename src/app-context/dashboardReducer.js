const authReducer = function (state, action) {
    switch (action.type) {
        case 'authenticate':
            return {
                isLoading: false, // can only call authenticate() in .then(); response received
                isAuthenticated: true,
                currentUser: action.payload.user,
                currentSessionCookie: action.payload.sessionCookie
            }
        case 'unauthenticate':
            return {
                isLoading: false, // when logging out need session over
                isAuthenticated: false,
                currentUser: null,
                currentSessionCookie: null
            }
        default:
            throw new Error('oopsie no authdispatch matched');

    }
}

const sidebarReducer = function (state, action) {
    switch (action.type) {
        case 'open':
            return {
                ...state,
                isSidebarOpen: true,
            }
        case 'close':
            return {
                ...state,
                isSidebarOpen: false
            }
        case 'filter':
            // console.log(action.payload)
            return {
                ...state,
                sidebarFilterOptions: {
                    mealTypes: action.payload.arr,
                    budgetPrice: action.payload.budget
                }
            }
        case 'clear':
            return {
                ...state,
                sidebarFilterOptions: {}
            }
        default:
            throw new Error('oopsie no sidebardispatch matched');
    }
}

const cartReducer = function (state, action) {
    switch (action.type) {
        case 'initial-populate':
            const cart = {}
            action.payload.items.map((obj,index) => {
                cart[obj.item] = obj.count;
            });
            console.log(cart) // cart = {objectid:number,objectid:number...}
            return {
                ...state,
                localCart: cart
            }
        case 'clear-on-sync':
            return {
                ...state,
                changesSinceLastUpload: {}
            }
        case 'mutate-local-cart':
            const { type,id } = action.payload;
            // below guarantees local cart and state changes kept in sync; do both at same time
            const { localCart,changesSinceLastUpload } = state
            // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
            // need deep copy or mutate original state, which causes incrementing twice instead of once
            const nextLocalCart = JSON.parse(JSON.stringify(localCart));
            const nextCSLU = JSON.parse(JSON.stringify(changesSinceLastUpload));
            // console.log('mutates')
            switch (type) {
                case 'add':
                    // [] notation because had item._id initially
                    if (!localCart[id]) { // doesn't already exist
                        console.log('added new')
                        nextLocalCart[id] = 1;
                        nextCSLU[id] = 1;
                    } else {
                        console.log('incremented')
                        nextLocalCart[id] += 1;
                        nextCSLU[id] += 1;
                    }
                    return {
                        localCart:nextLocalCart,
                        changesSinceLastUpload:nextCSLU
                    }
                case 'remove': // only expose remove to >= 1
                    nextLocalCart[id] -= 1;
                    nextCSLU[id] -= 1;
                    return {
                        localCart:nextLocalCart,
                        changesSinceLastUpload:nextCSLU
                    }
            }
        // deprecated
        case 'add-change':
            const prevChanges = state.changesSinceLastUpload
            console.log(prevChanges)
            return {
                ...state,
                changesSinceLastUpload: prevChanges.push(
                    action.payload.change
                )
            }
        default:
            throw new Error('oopsie no sidebardispatch matched');
    }
}

export { 
    authReducer, 
    sidebarReducer, 
    cartReducer 
};