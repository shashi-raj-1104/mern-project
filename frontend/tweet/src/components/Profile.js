import React from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import { useSelector, useDispatch } from "react-redux";
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { followingUpdate, updateUser } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';
import Tweet from './Tweet.js';

const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const allTweets = useSelector(store => store.tweet?.tweets ?? []);

    const userTweets = allTweets.filter(tweet => profile?.posts?.includes(tweet._id));

    const { id } = useParams();
    useGetProfile(id);
    const dispatch = useDispatch();

    const followAndUnfollowHandler = async () => {
        if(user.following.includes(id)){
            // unfollow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
            
        }else{
            // follow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {id:user?._id});
                console.log(res);
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
            }
        }
    }

    return (
        <div className='w-[50%] border-l border-r border-gray-200'>
            <div>
                <div className='flex items-center py-2'>
                    <Link to="/" className='p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer'>
                        <IoMdArrowBack size="24px" />
                    </Link>
                    <div className='ml-2'>
                        <h1 className='font-bold text-lg'>{profile?.name}</h1>
                        <p className='text-gray-500 text-sm'>{profile?.posts?.length} posts</p>
                    </div>
                </div>
                <img
                    src={profile?.cover_photo || "https://pbs.twimg.com/profile_banners/1581707412922200067/1693248932/1080x360"}
                    alt="banner"
                    className="w-full h-[200px] object-cover"
                />
                <div className='absolute top-52 ml-2 border-4 border-white rounded-full'>
                    <img
                        src={profile?.profile_photo || "https://img.freepik.com/premium-vector/young-man-anime-style-character-vector-illustration-design-manga-anime-boy_147933-4642.jpg"}
                        alt="Profile"
                        className="w-[120px] h-[120px] object-cover rounded-full"
                    />
                </div>

                <div className='text-right m-6'>
                    {profile?._id === user?._id ? (
                        <Link to={`/update/${user?._id}`} className='px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400'>
                            Edit Profile
                        </Link>
                    ) : (
                        <button onClick={followAndUnfollowHandler} className='px-4 py-1 bg-black text-white rounded-full'>
                            {user.following.includes(id) ? "Following" : "Follow"}
                        </button>
                    )}
                </div>
                <div className='m-4'>
                    <h1 className='font-bold text-xl'>{profile?.name}</h1>
                    <p>{`@${profile?.username}`}</p>
                </div>
                <div className='m-4 text-sm'>
                    <p>{profile?.bio}</p>
                </div>
                <div className="flex gap-4 text-sm font-bold">
                    <p>{profile?.following?.length} <span className="ml-1">Following</span></p>
                    <p>{profile?.followers?.length} <span className="ml-1">{profile?.followers?.length === 1 ? "Follower" : "Followers"}</span></p>
                </div>
                <div className='border border-gray-200'>
                    <h1 className="text-2xl font-bold text-center p-2">Posts</h1>
                    <div>
                        {userTweets.length > 0 ? (
                            userTweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
                        ) : (
                            <p>No posts</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
