import React from 'react';
import './Header.css';
import vnr_log from '../assets/VNRVJIETLogo - Copy.png';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from '../redux/slices/StaffAdminSlice';
import { useNavigate, NavLink } from 'react-router-dom';

const Header = () => {
    const { loginUserStatus, currentUser } = useSelector(
        (state) => state.StaffAdminLoginReducer
    );
    const navigate = useNavigate();

    const dispatch = useDispatch();

    function logout() {
        localStorage.removeItem('token');
        dispatch(resetState());
    }

    console.log("loginUserStatus:", loginUserStatus);
    console.log("currentUser:", currentUser);

    return (
        <div className="header-container">
            <ul className="header-list">
                {loginUserStatus === false ? (
                    <>
                        <div className="header-content">
                            <img className='header-logo' src={vnr_log} alt="VNR Logo" />
                            <h2 className='header-title'>VNR VJIET - Circular Repository</h2>
                        </div>
                    </>
                ) : (
                    currentUser.username && (
                        <>
                            <li>
                                <div className="header-content">
                                    <img className='header-logo' src={vnr_log} alt="VNR Logo" />
                                    <h2 className='header-title'>VNR VJIET - Circular Repository</h2>
                                </div>
                            </li>
                            <li>
                                <div className="header-user">
                                    {currentUser.username}
                                    <sup className="header-userType">({currentUser.userType})</sup>
                                </div>
                            </li>
                            <li>
                                <NavLink to="" onClick={logout}>
                                    <button className="header-logoutButton">Log out</button>
                                </NavLink>
                            </li>
                        </>
                    )
                )}
            </ul>
      
        </div>
    );
};

export default Header;
