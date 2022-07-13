import React, { useEffect } from 'react'
import { useAlertContext } from '../alertContext';

const Alert = function() {
    const { alert,alertOver } = useAlertContext();

    useEffect(() => {
        let alerted = setTimeout(() => {
            alertOver();
        },2500);
        // cleanup whenever something in dependency array changes,
        // useEffect() sets up new time out
        return () => {clearTimeout(alerted);}
    },[alertOver,alert.shown]);
    
    return (
        <p className='alert alert-danger'>
            {alert.msg}
        </p>
    );
}

export default Alert