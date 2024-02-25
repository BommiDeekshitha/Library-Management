"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

interface UserData {
    name: string;
    email: string;
    borrowed_book: string;
    return_date: string;
}
const Profile = () => {
  const [userData,setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL;
        const id = localStorage.getItem('id');
        console.log(id);
        const response = await axios.get(url+"profile/"+id)
        .then(res=>{
            setUserData(res.data[0]);
        }); 
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-20">
  <div className="max-w-screen-lg w-full">
    <div className="bg-white shadow-md rounded-md p-6">
        <div className='flex justify-center'>
            <h1 className="text-2xl font-semibold mb-4 text-center">PROFILE DETAILS</h1>
        </div>
      {userData && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold">Name:</p>
            <p className="text-sm">{userData.name}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Email:</p>
            <p className="text-sm">{userData.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Borrowed Book:</p>
            <p className="text-sm">{userData.borrowed_book}</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Return Date:</p>
            <p className="text-sm">{userData.return_date}</p>
          </div> 
        </div>
      )}
    </div>
    </div>
    <div className="pt-8 flex justify-center">
        <a href="/home" className="mr-4 px-6 py-3 bg-black text-white text-black font-semibold rounded-md">GO TO HOME</a>
    </div>
    </div>

  );
};

export default Profile;