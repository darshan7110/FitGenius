// components/DownloadPDFButton.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DownloadPDFButton = ({ mobileNumber }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // Using axios for better error handling
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/pdf/generate/${mobileNumber}`,
                {
                    responseType: 'blob',
                    timeout: 25000 // 25s timeout
                }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `FitGenius_Report_${mobileNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            let errorMessage = 'Failed to download PDF';
            if (error.response) {
                if (error.response.status === 404) {
                    errorMessage = 'User data not found';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error during PDF generation';
                }
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please try again.';
            }
            toast.error(errorMessage);
            console.error('Download Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
        >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </>
            ) : (
                'Download Full Report (PDF)'
            )}
        </button>
    );
};

export default DownloadPDFButton;