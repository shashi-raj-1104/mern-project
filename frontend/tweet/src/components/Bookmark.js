import React from 'react';
import Tweet from './Tweet.js';
import { useSelector } from "react-redux";

const Bookmark = () => {
    const { user } = useSelector(store => store.user);
    const allTweets = useSelector(store => store.tweet?.tweets ?? []); // Get all tweets from Redux store

    // Filter tweets that match user's bookmarked tweet IDs
    const bookmarkedTweets = allTweets.filter(tweet => user?.bookmarks?.includes(tweet._id));

    console.log("Bookmarked Tweets:", bookmarkedTweets);

    return (
      <div className='w-[50%] border border-gray-200'>
        <h1 className="text-2xl font-bold text-center p-2">Bookmark Tweets</h1>
        <div>
          {bookmarkedTweets.length > 0 ? (
            bookmarkedTweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
          ) : (
            <p>No bookmarks found</p>
          )}
        </div>
      </div>
    );
};

export default Bookmark;
