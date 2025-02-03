import React from "react";

const BookCard = ({ book, onSelect }) => {
    return (
        <div className="book-card" onClick={() => onSelect(book)}>
            <img 
                src={book.cover || "/default_cover.png"} 
                alt="Book Cover"
                onError={(e) => (e.target.src = "/default_cover.png")}
                style={{ width: "100px", height: "150px", objectFit: "cover" }}
            />
            <p>{book.title}</p>
        </div>
    );
};

export default BookCard;
