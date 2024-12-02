import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { FaArrowLeft } from 'react-icons/fa'; 
import "../styles/ListPage.css";

const ListPage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null); // Track which list is being edited
  const [newName, setNewName] = useState(""); // Track the new name
  const navigate = useNavigate();

  const fetchLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token is missing.');

      const response = await axios.get('https://response-code-manager-beta.vercel.app/api/lists', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists(response.data.lists || []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (listId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to delete a list.');

    try {
      await axios.delete(`https://response-code-manager-beta.vercel.app/api/lists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists(lists.filter((list) => list._id !== listId));
    } catch (err) {
      alert('Failed to delete list.');
    }
  };

  const updateListName = async (listId, newName) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to edit a list.');

    try {
      const response = await axios.put(
        `https://response-code-manager-beta.vercel.app/api/lists/${listId}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLists(
        lists.map((list) =>
          list._id === listId ? { ...list, name: response.data.name } : list
        )
      );
      setEditId(null); // Reset editing state
      setNewName("");
    } catch (err) {
      alert('Failed to update list name.');
    }
  };

  const handleEditClick = (listId, currentName) => {
    setEditId(listId);
    setNewName(currentName);
  };

  const handleBackIconClick = () => {
    navigate('/search');
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="list-page">
      <h1>Your Saved Image Lists</h1>
      {loading && <p>Loading lists...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {lists.length > 0 ? (
        <ul>
          {lists.map((list) => (
            <li key={list._id}>
              {editId === list._id ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <button onClick={() => updateListName(list._id, newName)}>
                    Save
                  </button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3>{list.name}</h3>
                  <button onClick={() => handleEditClick(list._id, list.name)}>
                    Edit
                  </button>
                </>
              )}
              <ul>
                {list.images.map((image, index) => (
                  <li key={index}>
                    <img src={image.url} alt={`Image ${index + 1}`} />
                  </li>
                ))}
              </ul>
              <button onClick={() => deleteList(list._id)}>Delete List</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No lists saved yet.</p>
      )}
      <div className="back-icon" onClick={handleBackIconClick}>
        <FaArrowLeft size={30} />
      </div>
    </div>
  );
};

export default ListPage;
