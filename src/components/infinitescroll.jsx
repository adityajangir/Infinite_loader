import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './infinitescroll.css'

const InfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts`, {
          params: { _page: page, _limit: 10 },
        });
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading]);

  return (
    <div className="container parentdiv">
      <h1>Infinite Scroll</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {loading && (
        <div className="loader">
          <img src="https://via.placeholder.com/50" alt="Loading..." />
        </div>
      )}
      <div ref={loader} style={{ height: '20px' }}></div>
    </div>
  );
};

export default InfiniteScroll;
