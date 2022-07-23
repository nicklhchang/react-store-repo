const authReducer = function (state, action) {
    switch (action.type) {
        case 'authenticate':
            return {
                isAuthenticated: true,
                currentUser: action.payload.user,
                currentSessionCookie: action.payload.sessionCookie
            }
        case 'unauthenticate':
            return {
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
    const { localCart, changesSinceLastUpload } = state
    // below guarantees local cart and state changes kept in sync; do both at same time
    // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
    // need deep copy or it'll mutate original state, which causes incrementing twice instead of once
    // in react, whenever some state (of variable or function) changes, a re-render or refresh usually happens
    const nextLocalCart = JSON.parse(JSON.stringify(localCart));
    const nextCSLU = JSON.parse(JSON.stringify(changesSinceLastUpload));
    switch (action.type) {
        case 'initial-populate':
            const { items } = action.payload
            const cart = {}
            if (items) { // so won't undefined.map if user does not have a cart
                items.forEach((obj, index) => {
                    // look at cart schema
                    cart[obj.item] = obj.count;
                });
            }
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
            const { type, id } = action.payload;
            // console.log('mutates')
            switch (type) {
                case 'add':
                    // [] notation because had item._id initially
                    localCart[id] ? nextLocalCart[id] += 1 : nextLocalCart[id] = 1;
                    changesSinceLastUpload[id] ? nextCSLU[id] += 1 : nextCSLU[id] = 1;
                    break;
                case 'remove':
                    // so no empty changesSinceLastUpload
                    changesSinceLastUpload[id] ? nextCSLU[id] -= 1 : nextCSLU[id] = -1; 
                    // don't worry about localCart[id] being undefined because of where remove is called
                    // ternary condition check original (not next) because only doing operation once
                    // won't -2 in one go if there was only 1 in original (one operation)
                    localCart[id] > 1 ? nextLocalCart[id] -= 1 : delete nextLocalCart[id];
                    break;
                default:
                    throw new Error('oopsie no mutation operation on local cart specified');
            }
            console.log(nextLocalCart)
            return {
                localCart: nextLocalCart,
                changesSinceLastUpload: nextCSLU
            }
        // deprecated
        // case 'add-change':
        //     const prevChanges = state.changesSinceLastUpload
        //     console.log(prevChanges)
        //     return {
        //         ...state,
        //         changesSinceLastUpload: prevChanges.push(
        //             action.payload.change
        //         )
        //     }
        case 'clear-local-cart':
            // so dashboard listening to changes picks it up, 1 is true
            nextCSLU['cleared-all'] = 1;
            return {
                localCart: {},
                changesSinceLastUpload: nextCSLU
            }
        default:
            throw new Error('oopsie no cartdispatch matched');
    }
}

export {
    authReducer,
    sidebarReducer,
    cartReducer
};