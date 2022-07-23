import React, {  } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';

const Item = React.memo(function({ _id,name,cost,classification }) {
    const {
        mutateLocalCart
    } = useDashboardContext();
    // const addToCart = function() {
    //     mutateLocalCart('add',_id)
    // }
    return (
        <article className='menu-item'>
            <div className='menu-item-footer'>
                <h4>{_id}</h4>
                <h4>{name}</h4>
                <h4>{cost.toString()}</h4>
                <h4>{classification}</h4>
                <button onClick={() => {mutateLocalCart('add',_id)}}>Add to cart</button>
            </div>
        </article>
    );
});

export default Item