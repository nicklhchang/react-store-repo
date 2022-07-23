import React, {  } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDashboardContext } from '../app-context/dashboardContext';

const CartItem = React.memo(function({ id,count,cost }) {
    // arr = [id,count]
    const {
        mutateLocalCart
    } = useDashboardContext();
    return (
        <article className='cart-item'>
            {/* can just be renamed item-footer in index.css for both menu and cart */}
            <div className='menu-item-footer'>
                <h4>{id}</h4>
                <h4>Cost per item: {cost}</h4>
                <h4>Subtotal: {count * cost}</h4>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
                <button className='count-btn' onClick={() => {mutateLocalCart('add',id)}}>
                    <FaPlus />
                </button>
                <span className='count'>{count}</span>
                <button className='count-btn' onClick={() => {mutateLocalCart('remove',id)}}>
                    <FaMinus />
                </button>
            </div>
        </article>
    );
});

export default CartItem