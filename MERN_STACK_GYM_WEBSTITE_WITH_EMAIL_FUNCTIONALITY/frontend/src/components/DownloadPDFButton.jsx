import React, { useState } from 'react';

const DownloadPDFButton = ({ mobileNumber }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = () => {
        setLoading(true);
        const pdfWindow = window.open(
            `${process.env.REACT_APP_API_URL}/api/pdf/generate/${mobileNumber}`,
            '_blank'
        );
        
        // Reset loading when window closes
        pdfWindow.onbeforeunload = () => setLoading(false);
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className={`py-2 px-4 rounded-lg mt-4 ${
                loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
        >
            {loading ? 'Generating PDF...' : 'Download Health Report (PDF)'}
        </button>
    );
};

export default DownloadPDFButton;