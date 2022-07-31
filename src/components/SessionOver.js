import React, {  } from 'react'
import { Link } from 'react-router-dom'
// import { useAlertContext } from '../app-context/alertContext';
import { useDashboardContext } from '../app-context/dashboardContext';

const SessionOver = function () {
    const {
        isAuthenticated,
        loading,
        // changesSinceLastUpload,
        // clearChangesOnSync
    } = useDashboardContext();
    /** trying to sync changes while unauthenticated not possible in backend (routes protected) */
    /** try sse ?? */
    // const { setCustomAlert } = useAlertContext();
    // const negatedModalState = Object.values(changesSinceLastUpload)
    //     .every((change) => { return change === 0; })
    // const [isModalOpen, setIsModalOpen] = useState(negatedModalState);

    // const saveToBackend = function () {
    //     // no lockinh etc. because no changes once session over
    //     axios.post('http://localhost:8000/api/v1/browse/cart/sync', {
    //         cart: cart.current
    //     }, {
    //         cancelToken: source.token
    //     }).then(function (response) {
    //         console.log(response.data, 'final save')
    //         const { requestSuccess } = response.data;
    //         if (requestSuccess) { clearChangesOnSync(); }
    //     }).catch(function (error) {
    //         console.log(error)
    //         setCustomAlert(true, 'error saving your cart')
    //     });
    // }

    if (!isAuthenticated && !loading) {
        // break out early if not/no longer authenticated 
        return (
            <main>
                {/* <div className={`modal-overlay ${isModalOpen ? 'show-modal' : ''}`}>
                    <div className='modal-container'>
                        <button className='submit-btn' onClick={() => { saveToBackend(); }}>
                            Please save changes before leaving
                        </button>
                    </div>
                </div> */}
                <h3>Session over, please authenticate again</h3>
                <Link to='/auth' className='submit-btn'>go authenticate</Link>
            </main>
        );
    }
}

export default SessionOver