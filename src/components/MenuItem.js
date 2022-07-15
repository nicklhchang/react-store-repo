import React, {  } from 'react'

const Item = React.memo(function({ name,cost,classification }) {
    return (
        <article className='menu-item'>
            <div className='menu-item-footer'>
                <h4>{name}</h4>
                <h4>{cost.toString()}</h4>
                <h4>{classification}</h4>
            </div>
        </article>
    );
});

export default Item