import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core'; // Import PDF viewer components
import '@react-pdf-viewer/core/lib/styles/index.css'; // Add styles for the PDF viewer
import "./App.css"
function App() {
    const [books, setBooks] = useState([]);  // List of books to display
    const [file, setFile] = useState(null);   // File to upload
    const [selectedBook, setSelectedBook] = useState(null); // Track selected book for viewing

    // Fetch books from backend on component mount
    useEffect(() => {
        axios.get('http://localhost:5000/books')
            .then((response) => {
                setBooks(response.data.books);
            })
            .catch((error) => {
                console.error("There was an error fetching books!", error);
            });
    }, []);

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('book', file);

        axios.post('http://localhost:5000/upload', formData)
            .then((response) => {
                setBooks((prevBooks) => [...prevBooks, response.data.file.filename]);
            })
            .catch((error) => {
                console.error("There was an error uploading the file!", error);
            });
    };

    // Handle book click to open in PDF viewer
    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    // Close the PDF viewer
    const closePdfViewer = () => {
        setSelectedBook(null);
    };

    return (
        <div className="App">
            <h1>Bookstagram</h1>

            <div>
                <h2>Upload a Book</h2>
                <form onSubmit={handleFileUpload}>
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <button type="submit">Upload</button>
                </form>
            </div>

            <div>
    <h2>Available Books</h2>
    <div className="book-grid">
        {books.map((book, index) => (
            <div key={index} className="book-card" onClick={() => handleBookClick(book)}>
                <p>{book}</p>
            </div>
        ))}
    </div>
</div>

            {/* Display PDF viewer modal when a book is selected */}
            {selectedBook && (
  <div className="pdf-viewer-modal">
    <div className="pdf-viewer-container">
      <button onClick={closePdfViewer}>Close</button>
      <iframe id='book-container'
        src={`http://localhost:5000/uploads/${selectedBook}`}
        width="100%"
        height="600px"
        title="Book PDF"
        frameBorder="0"
      />
    </div>
  </div>
)}
        </div>
    );
}

export default App;
