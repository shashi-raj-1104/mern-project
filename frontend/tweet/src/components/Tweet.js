import React, { useState } from 'react';
import Avatar from "react-avatar";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { TWEET_API_END_POINT, USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';
import { bookmarkUpdate } from '../redux/userSlice';
import {timeSince} from "../utils/constant";

const Tweet = ({ tweet }) => {
    const { user } = useSelector(store => store.user); 
    const [click, setClick] = useState(false);   
    const dispatch = useDispatch();
    const likeOrDislikeHandler = async (id) => {
        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${id}`, { id: user?._id }, {
                withCredentials: true
            })
            console.log(res);
            dispatch(getRefresh());
            toast.success(res.data.message);

        } catch (error) {
            toast.success(error.response.data.message);
            console.log(error);
        }
    }

    const commentHandler = async (id, comment) => {
        try {
            const res = await axios.post(`${TWEET_API_END_POINT}/comment`, { user: user?.username, id: user?._id, content: comment, tweetId: id}, {
                withCredentials: true
            })
            console.log(res);
            dispatch(getRefresh());
            toast.success(res.data.message);

        } catch (error) {
            toast.success(error.response.data.message);
            console.log(error);
        }
      
    }
    const BookmarkHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.put(`${USER_API_END_POINT}/bookmark/${id}`, { id: user?._id });

            console.log("Updated user data:", res.data.user); // Check if backend returns updated user

            dispatch(bookmarkUpdate(id)); // Optimistically update Redux
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating bookmark");
            console.log(error);
        }
        console.log(user);
    };
    const deleteTweetHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`);
            console.log(res);
            dispatch(getRefresh());
            toast.success(res.data.message);
        } catch (error) {
            toast.success(error.response.data.message);
            console.log(error);
        }
    }
    return (
        <div className='border-b border-gray-200'>
            <div>
                <div className='flex p-4'>
                    <Avatar src="https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg" size="40" round={true} />
                    <div className=' ml-2 w-full'>
                        <div className='flex items-center'>
                            <h1 className='font-bold'>{tweet?.userDetails[0]?.name}</h1>
                            <p className='text-gray-500 text-sm ml-1'>{`@${tweet?.userDetails[0]?.username} . ${timeSince(tweet?.createdAt)}`}</p>
                        </div>
                        <div>
                            <p>{tweet?.description}</p>
                        </div>
                        <div className='flex justify-between my-3'>
                            <div className='flex items-center'>
                                <div onClick={() => setClick(!click)} className='p-2 hover:bg-green-200 rounded-full cursor-pointer'>
                                    <FaRegComment size="20px" />
                                </div>
                                <p>{tweet?.comment?.length}</p>
                            </div>
                            <div className='flex items-center'>
                                <div onClick={() => likeOrDislikeHandler(tweet?._id)} className='p-2 hover:bg-pink-200 rounded-full cursor-pointer'>
                                {tweet?.like.includes(user?._id) ? (
                                        <FcLike  size="22px" />
                                    ) : (
                                        <CiHeart size="24px" />
                                    )}
                                </div>
                                <p>{tweet?.like?.length}</p>
                            </div>
                            <div className='flex items-center'>
                                <div onClick={() => BookmarkHandler(tweet?._id)} className='p-2 hover:bg-yellow-200 rounded-full cursor-pointer'>
                                    {user?.bookmarks.includes(tweet?._id) ? (
                                        <FaBookmark  size="22px" />
                                    ) : (
                                        <CiBookmark size="24px" />
                                    )}
                                </div>
                                {/* <p>{user?.bookmarks?.length}</p> */}
                            </div>
                            {
                                user?._id === tweet?.userId && (
                                    <div onClick={() => deleteTweetHandler(tweet?._id)} className='flex items-center'>
                                        <div className='p-2 hover:bg-red-300 rounded-full cursor-pointer'>
                                            <MdOutlineDeleteOutline size="24px" />
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                        {
                            click && (<>

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    commentHandler(tweet?._id, e.target.comment.value);
                                    e.target.comment.value = '';
                                }}>
                                    <div className='flex'>
                                        <input
                                            type="text"
                                            name="comment"
                                            placeholder='Comment'
                                            className="outline-blue-500 border w-full border-gray-800 px-3 py-2 rounded-full my-1 font-semibold"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                        <button type='submit' className='bg-[#1D9BF0] mx-1 my-2 px-4 py-1 text-base text-white text-right border-none rounded-full '>
                                            <IoSend />
                                        </button>
                                    </div>
                                </form>

                                <ul>
                                    
                                    {tweet?.comment?.map(comment => (
                                        <li key={comment?._id}>
                                            <strong className='pr-2'>{comment?.user}</strong>
                                            
                                            :
                                            {comment?.content}
                                            
                                        </li>
                                    ))}
                                </ul>
                            </>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tweet