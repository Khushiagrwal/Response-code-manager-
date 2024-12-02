import { useState } from 'react';
import { FaSearch  } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [name, setName] = useState('');
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false); // Error popup visibility state
  

  // Fetch Images with error handling and validation
  const fetchImages = async () => {
    if (!query) {
      setError('Please enter a query.');
      setIsErrorPopupVisible(true);
      return;
    }

    // Validate the query format (three-digit or range-based codes)
    if (!/^\d{3}$/.test(query) && !/^\d{1}[x]{2}$/.test(query)) {
      setError('Invalid query format. Use 3-digit codes like 200, 404, or ranges like 2xx, 3xx.');
      setIsErrorPopupVisible(true);
      return;
    }

    setLoading(true);
    setError('');
    setSaveMessage('');
    // console.log("your query is here " + query)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://response-code-manager-beta.vercel.app/api/search?q=${query}`,
        {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        }
      );
      if (!response.ok) throw new Error(await response.text());
      
      const data = await response.json();

      setImages(data.images || []);

    } catch (err) {
      setError(err.message || 'Failed to fetch images');
      setIsErrorPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Save image list with validation and error handling
  const saveImageList = async () => {
    if (!images.length || !name) {
      setSaveMessage('List name and images are required.');
      return;
    }

    const validImages = images.map(({ url, code }) => ({ url, code }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://response-code-manager-beta.vercel.app/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, images: validImages }),
      });

      if (!response.ok) throw new Error(await response.text());
      setSaveMessage('Image list saved successfully!');
    } catch (err) {
      setSaveMessage(err.message || 'Failed to save the image list');
    }
  };

  const closePopup = () => {
    setIsErrorPopupVisible(false);
  };

  return (
    <div className="search-page">
      <div className="nav-bar">
      <h1 >Search and Save Response Codes</h1>
      <br />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter response code (e.g., 2xx, 203)"
          className="search-input"
        />
        <button onClick={fetchImages} disabled={loading} className="search-button">
          <FaSearch />
        </button>
          <input
            type="text"
            placeholder="Enter list name to save"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="search-input"
          />
          <button onClick={saveImageList} className="save-button"><FaPlus/></button>
          {saveMessage && <p className="save-message">{saveMessage}</p>}
      </div>

      {/* Error Popup */}
      {isErrorPopupVisible && (
        <div className="error-popup">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="close-btn" onClick={closePopup}>Close</button>
        </div>
      )}

      <div className="image-results">
        {images.length > 0 ? (
          <>
            <h2>Images</h2>
            <div className="image-list">
              {images.map((image, index) => (
                <div key={index} className="image-card">
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="image-thumbnail"
                  />
                  <p className="image-code">Code: {image.code}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="no-images-message">No images found for this query. Please try a different code.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
