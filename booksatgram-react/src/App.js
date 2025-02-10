import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then((response) => setBooks(response.data.books))
      .catch((error) => console.error("Error fetching books!", error));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("book", file);

    axios
      .post("http://localhost:5000/upload", formData)
      .then((response) => {
        setBooks((prevBooks) => [
          ...prevBooks,
          {
            filename: response.data.filename,
            thumbnail: `http://localhost:5000/${response.data.thumbnail}`,
          },
        ]);
      })
      .catch((error) => console.error("Error uploading file!", error));
  };

  return (
    <div className="App">
      <header className="header">
        <h1>📚 Bookstagram</h1>
      </header>

      {/* ✅ Upload Section */}
      <section className="upload-section">
        <h2>Upload a Book</h2>
        <form onSubmit={handleFileUpload} className="upload-form">
          <input type="file" accept=".pdf" onChange={handleFileChange} className="file-input" />
          <button type="submit" className="upload-btn">Upload</button>
        </form>
      </section>

      {/* ✅ Book Library Section */}
      <section className="book-library">
        <h2>Available Books</h2>
        <div className="book-grid">
          {books.map((book, index) => (
            <div key={index} className="book-card" onClick={() => setSelectedBook(book.filename)}>
              <img src={`http://localhost:5000${book.thumbnail}`} alt="Book Cover" className="pdf-thumbnail" />
              <p className="book-title">{book.filename}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ PDF Viewer Modal */}
      {selectedBook && (
        <div className="pdf-viewer-modal">
          <div className="pdf-viewer-container">
            <button className="close-btn" onClick={() => setSelectedBook(null)}>×</button>
            <iframe
              id="book-container"
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
