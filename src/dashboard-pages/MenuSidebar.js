import React, { useEffect, useState } from 'react'
import { useDashboardContext } from '../app-context/dashboardContext';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const menuOptionsEnum = ['Appetiser', 'Small', 'Medium', 'Large', 'Drink', 'Dessert'];

const MenuSidebar = function () {
    // pass to setFilterOptions
    // const [checkedMenuOptions,setCheckedMenuOptions] = useState([]);
    const [checkedOptions, setCheckedOptions] = useState(
        new Array(menuOptionsEnum.length).fill(false)
    );
    const [maxPrice, setMaxPrice] = useState(30);
    // const [temp, setTemp] = useState(false);
    const {
        currentSessionCookie,
        unauthenticate,
        isSidebarOpen,
        toggleSidebar,
        sidebarFilterOptions,
        setFilterOptions,
        clearFilterOptions
    } = useDashboardContext();
    // let navigate = useNavigate();

    // useEffect(() => {
    //     let test = setTimeout(() => {
    //         setTemp(!temp);
    //         console.log(checkedOptions);
    //     },500);
    //     return () => {clearTimeout(test);}
    // },[temp]);

    const onCheck = function (index) {
        if (document.cookie === currentSessionCookie) {
            const nextCheckedOptions = checkedOptions.map((bool, i) => {
                return (index === i ? !bool : bool);
            });
            // console.log(nextCheckedOptions)
            setCheckedOptions(nextCheckedOptions);
        } else {
            clearFilterOptions(); // else next render of Menu will use filter
            unauthenticate();
        }
    }

    const onSlide = function (event) {
        event.preventDefault();
        console.log(event.target.value)
        if (document.cookie === currentSessionCookie) {
            setMaxPrice(event.target.value);
        } else {
            clearFilterOptions();
            unauthenticate();
        }
    }

    // onSubmitFilter and onClearFilter with toggleSidebar('close') prevents
    // re-rendering Menu's useEffect (es-lint disable so does not run useEffect 
    // on every state change); re running useEffect; brief moment of unauthenticated
    const onSubmitFilter = function (event) {
        event.preventDefault();
        // auth status checked by axios get to backend
        const filterArr = [];
        checkedOptions.forEach((bool, index) => {
            if (bool) { filterArr.push(menuOptionsEnum[index]) }
        });
        // console.log(filterArr)
        setFilterOptions(filterArr, maxPrice);
        toggleSidebar('close');
    }

    const onClearFilter = function (event) {
        event.preventDefault();
        clearFilterOptions();
        toggleSidebar('close');
    }

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'show-sidebar' : ''}`}>
            <div className='sidebar-header'>
                <h4>Sidebar for now</h4>
                <button className='close-btn' onClick={() => { toggleSidebar('close') }}>
                    <FaTimes />
                </button>
            </div>
            <form className='sidebar-form'>
                <h4>Menu types</h4>
                {menuOptionsEnum.map((option, index) => {
                    return (
                        // each option is in an unordered list, so 7 unordered lists
                        <ul key={option}>
                            <input
                                type='checkbox'
                                id={`custom-checkbox-${index}`}
                                name={option}
                                value={option}
                                checked={checkedOptions[index]}
                                onChange={() => {
                                    // never have two setState's inside here, very weird behaviour
                                    onCheck(index);
                                    /* reason below does not work is because checkedOptions does not seem
                                    // to get mutated enough i.e not new object so no state change 
                                    // means no update in component; React slightly finnicky
                                    checkedOptions[index] = !checkedOptions[index]
                                    setCheckedOptions(checkedOptions) */
                                }} />
                            <label>{option}</label>
                        </ul>
                    );
                })}
                <h4>Maximum price</h4>
                <input
                    type='range'
                    step={0.5}
                    value={maxPrice}
                    min={4} // hard coded, maybe can set up state of min price (from get req)
                    max={50}
                    onChange={onSlide}
                />
                <label>{maxPrice}</label>
                <div>
                    <button
                        type='submit'
                        className='btn btn-submit'
                        onClick={onSubmitFilter}>
                        Search with filter
                    </button>
                    <button
                        type='submit'
                        className='btn btn-submit'
                        // never call clearFilterOptions(); trigger re-render of Menu; cause unauthenticated glitch
                        // onClick={() => {clearFilterOptions()}}>
                        onClick={onClearFilter}>
                        View whole menu
                    </button>
                </div>
            </form>
            {/* https://stackoverflow.com/questions/53048037/react-showing-0-instead-of-nothing-with-short-circuit-conditional-component/53048160#53048160 */}
            {/* ternary or boolean cast like below prevents rendering 0 */}
            {!!Object.keys(sidebarFilterOptions).length && <div className='sidebar-form'>
                <h4>Current menu types with budget {sidebarFilterOptions.budgetPrice}:</h4>
                {sidebarFilterOptions.mealTypes.map((type) => {
                    return (<li key={type}>{type}</li>);
                })}
                {/* <h4>{sidebarFilterOptions.budgetPrice}</h4> */}
            </div>}
        </aside>
    );
}

export default MenuSidebar