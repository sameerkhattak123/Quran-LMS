
import React, { Fragment } from 'react';
// import './navbar.css'
import { AiOutlineMenu } from 'react-icons/ai';
import { AiFillBell } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../redux/actions/auth';
import { Link, useLocation } from "react-router-dom"
import Azam from "../img/Azam.jpg"
import { getCurrentProfile } from '../../redux/actions/profile';
import { fetchUnreadNotificationCount, fetchNotifications, markNotificationAsRead } from "../../redux/actions/notification"

// import CustomButton from '../CustomButton/CustomButton'

const InstructorNavbar = ({ getCurrentProfile, fetchUnreadNotificationCount, fetchNotifications, markNotificationAsRead, auth: { isAuthenticated }, logout, profile, notification, notifications }) => {

    // const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        getCurrentProfile();
        fetchUnreadNotificationCount();
    }, [getCurrentProfile, fetchUnreadNotificationCount]);

    // console.log(notification.notification.data);
    const [notificationsVisible, setNotificationsVisible] = useState(false);

    // const handleBellIconClick = async () => {
    //     try {
    //         // Fetch notifications from the backend
    //         const response = await fetchNotifications();
    //         // Set notifications to state
    //         setNotifications(response.data); // Assuming your response contains notifications data
    //     } catch (error) {
    //         console.error('Error fetching notifications:', error);
    //     }
    // };
    // console.log(notifications.data);


    const handleBellIconClick = () => {
        fetchNotifications()
        setNotificationsVisible(!notificationsVisible);
    }

    const handleNotificationClick = (notificationId) => {
        // Call the action to mark the notification as read
        markNotificationAsRead(notificationId);
        // Additional logic if needed after marking the notification as read
        // For example, redirect to a specific page or show a message to the user
        fetchUnreadNotificationCount();
    };


    const unreadNotificationCount = notification.unreadCount.data?.unreadCount || 0;
    const notificationMessages = notification.notification.data || [];
    // console.log(unreadNotificationCount);

    const [toggle, setToggle] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible((prevState) => !prevState);
    };
    const location = useLocation();

    const instauthLinks = (
        <div className='bg-teal-50'>
            <div className='max-w-[1240px] px-[15px] py-[15px] items-center flex justify-between mx-auto'>
                <div className='flex items-center gap-10'>
                    {toggle ?
                        <AiOutlineMenu onClick={() => setToggle(!toggle)} className='text-black text-2xl md:hidden block' />
                        :
                        <AiOutlineClose onClick={() => setToggle(!toggle)} className='text-black text-2xl md:hidden block' />
                    }
                    <div className='text-3xl font-bold text-[#00A86B]'>
                        Quran LMS
                    </div>
                    <ui className='hidden md:flex text-gray-700 lg:gap-10 gap-4 list-none text-sm lg:text-xl'>
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <Link to="/instructorcourses">
                            {/* <i className="fas fa-user" />{' '} */}
                            <span className="hide-sm">Courses</span>
                        </Link>
                        <Link to="/tarjuma">
                            {/* <i className="fas fa-user" />{' '} */}
                            <span className="hide-sm"> Tarjuma  </span>
                        </Link>
                        <Link to="/addcourse">
                            {/* <i className="fas fa-user" />{' '} */}
                            <span className="hide-sm">Add Course</span>
                        </Link>
                        {/* <li>
                            <Link to="/posts">Posts</Link>
                        </li> */}
                        <Link to="/instructorDashboard">
                            <li>DashBoard</li>
                        </Link>
                        <Link to="/Instructorprofiles">
                            <li>Instrcutors</li>
                        </Link>
                        <li>
                            <Link to="/posts">Forums</Link>
                        </li>
                    </ui>

                    {/* Responsive menu */}

                    <ui className={` duration-300 md:hidden fixed text-start bg-black z-40 text-white top-[70px] w-full h-screen list-none 
           ${toggle ? 'left-[-100%]' : 'left-[0]'}`}>
                       <li>
                            <Link to="/home">Home</Link>
                        </li>
                        <Link to="/instructorcourses">
                            {/* <i className="fas fa-user" />{' '} */}
                            <span className="hide-sm">Courses</span>
                        </Link>
                        <Link to="/tarjuma">
                            {/* <i className="fas fa-user" />{' '} */}
                            <span className="hide-sm"> Tarjuma  </span>
                        </Link>
                        <Link to="/addcourse">
                            {/* <i className="fas fa-user" />{' '} */}
                            <span className="hide-sm">Add Course</span>
                        </Link>
                        {/* <li>
                            <Link to="/posts">Posts</Link>
                        </li> */}
                        <Link to="/instructorDashboard">
                            <li>DashBoard</li>
                        </Link>
                        <Link to="/Instructorprofiles">
                            <li>Instrcutors</li>
                        </Link>
                        <li>
                            <Link to="/posts">Forums</Link>
                        </li>
                    </ui>
                </div>
                <div className="relative flex flex-col items-center space-x-4">
                    <div className="w-full flex relative">
                        <AiFillBell className='w-8 h-8' onClick={handleBellIconClick} />
                        {unreadNotificationCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2">
                                {unreadNotificationCount}
                            </span>
                        )}

                        {/* Notification display component */}
                        {isAuthenticated && notificationMessages.length > 0 && notificationsVisible && (
                            <div className='absolute w-80 top-12 right-0 bg-white border border-gray-300 p-4 rounded shadow-md max-h-80 overflow-y-auto z-10'>
                                <h3 className='text-lg font-semibold mb-2'>Notifications:</h3>
                                <ul className='text-start pl-4'>
                                    {notificationMessages.map((msg, index) => (
                                        <li
                                            key={index}
                                            className='hover:bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4 cursor-pointer transition duration-300 shadow-md'
                                            onClick={() => handleNotificationClick(msg._id)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                                                    <AiFillBell className="text-blue-500 w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-semibold mb-2">{msg.title}</h4>
                                                    <p className="text-gray-700">{msg.message}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}

                                </ul>
                            </div>
                        )}

                    </div>
                </div>
                <div className="flex flex-col items-center space-x-4 relative">
                    <img className="w-12 h-12 rounded-full" src={profile?.profile?.user?.profilepicture} alt="" onClick={toggleDropdown} />
                    <div className="font-medium dark:text-white">
                        {/* Add content for the profile page */}
                    </div>
                    {isDropdownVisible && (
                        <div className="absolute bg-white rounded-md shadow-lg z-10 mt-12 right-0">
                            {/* Add your buttons here */}
                            <Link to={`/instructordashboard`}>
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-40">Profile</button>
                            </Link>

                            <Link to="/instructorchange-password" className="btn btn-primary my-1">
                                <button className="block px-2 py-2 text-gray-800 hover:bg-gray-100 w-full">
                                    Change Password
                                </button>
                            </Link>
                            <Link to="/sharedCourseContent" className="btn btn-primary my-1">
                                <button className="block px-2 py-2 text-gray-800 hover:bg-gray-100 w-full">
                                    Shared Material
                                </button>
                            </Link>

                            <Link to="/create-instructorprofile" className="btn btn-primary my-1">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full">
                                    Edit Profile
                                </button>
                            </Link>
                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-40" onClick={logout}>LogOut</button>
                        </div>
                    )}
                </div>



            </div>
        </div>
    );

    const guestLinks = (
        <div className='bg-white'>
            <div className='max-w-[1240px] px-[15px] py-[15px] items-center flex justify-between mx-auto'>
                <div className='flex items-center gap-10'>
                    {toggle ?
                        <AiOutlineMenu onClick={() => setToggle(!toggle)} className='text-black text-2xl md:hidden block' />
                        :
                        <AiOutlineClose onClick={() => setToggle(!toggle)} className='text-black text-2xl md:hidden block' />
                    }
                    <div className='text-3xl font-bold text-[#00A86B]'>
                        Quran LMS
                    </div>
                    <ui className='hidden md:flex text-gray-700 lg:gap-10 gap-4 list-none text-sm lg:text-xl'>                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>About</li>
                        <li><Link to="/Contact"> Contact </Link></li>
                        <Link to="/instructorDashboard">
                            <li>DashBoard</li>
                        </Link>
                    </ui>

                    {/* Responsive menu */}

                    <ui className={` duration-300 md:hidden fixed text-start bg-black z-40 text-white top-[70px] w-full h-screen list-none 
           ${toggle ? 'left-[-100%]' : 'left-[0]'}`}>
                        <li className='p-5'>Home</li>
                        <li className='p-5'>About</li>
                        <li className='p-5'>Contact</li>
                        <Link to="/instructorDashboard">
                            <li>DashBoard</li>
                        </Link>
                    </ui>
                </div>

                {location.pathname === '/instructorregister' ? (
                    <button className='bg-white text-[#414141] font-bold py-2 px-4'>
                        <Link to='/Login' className="mr-2">Login</Link>

                        <Link to="/Login">Student</Link>

                    </button>
                ) : (
                    <button className='flex flex-row bg-white text-[#414141] font-bold py-2 px-4'>
                        <Link to='/instructorregister' className="mr-2" >Signup</Link>

                        <Link to="/Login">Student</Link>

                    </button>

                )}


            </div>
        </div>
    );


    return (
        <Fragment>{isAuthenticated ? instauthLinks : guestLinks}</Fragment>
    )
}

InstructorNavbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    fetchUnreadNotificationCount: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
    notification: state.notificationReducer,
    notifications: state.notificationReducer
});

export default connect(mapStateToProps, { logout, getCurrentProfile, fetchUnreadNotificationCount, fetchNotifications, markNotificationAsRead })(InstructorNavbar);