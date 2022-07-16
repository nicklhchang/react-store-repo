import React, {  } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';
import { FaTimes } from 'react-icons/fa';

const MenuSidebar = function() {
    const {
        isSidebarOpen,
        sidebarFilterOptions,
        toggleSidebar,
        filterOptions
    } = useDashboardContext();

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'show-sidebar' : ''}`}>
            <div className='sidebar-header'>
                <h4>Sidebar for now</h4>
                <button className='close-btn' onClick={() => {toggleSidebar('close')}}>
                    <FaTimes />
                </button>
            </div>
            <div>
                <button className='btn btn-submit'>Search with filter</button>
                <button className='btn btn-submit'>Clear filter</button>
            </div>
        </aside>
    );
}

export default MenuSidebar