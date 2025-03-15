import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { updateUser } from '../redux/userSlice';

const EditProfile = () => {
    const { id } = useParams(); // Get user ID from URL
    const { user } = useSelector(store => store.user);
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || "");
    const [profile_photo, setProfile_photo] = useState(user?.profile_photo || "");
    const [cover_photo, setCover_photo] = useState(user?.cover_photo || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.put(`${USER_API_END_POINT}/update/${id}`, {
                name,
                bio,
                profile_photo,
                cover_photo
            });

            dispatch(updateUser(res.data.user));
            toast.success("Profile updated successfully!");
            navigate(`/profile/${id}`); // Redirect back to profile page
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <form onSubmit={handleUpdate}>
                <label className="block font-bold">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded-lg mb-4"
                />

                <label className="block font-bold">Bio</label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border p-2 rounded-lg mb-4"
                ></textarea>

                <label className="block font-bold">Profile_photo</label>
                <textarea
                    value={profile_photo}
                    onChange={(e) => setProfile_photo(e.target.value)}
                    className="w-full border p-2 rounded-lg mb-4"
                ></textarea>

                <label className="block font-bold">cover_photo</label>
                <textarea
                    value={cover_photo}
                    onChange={(e) => setCover_photo(e.target.value)}
                    className="w-full border p-2 rounded-lg mb-4"
                ></textarea>

                <button type="submit" className="w-full bg-black text-white py-2 rounded-lg">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
