import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const BookReader = ({ pdfUrl, onClose }) => {
    return (
        <div className="pdf-modal">
            <button onClick={onClose} className="close-btn">Close</button>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfUrl} />
            </Worker>
        </div>
    );
};

export default BookReader;
