const express = require('express');
const PDFDocument = require('pdfkit');
const router = express.Router();
const User = require('../models/User'); // Adjust to your User model path

router.get('/generate/:mobile', async (req, res) => {
    try {
        const { mobile } = req.params;
        
        // 1. Fetch user data
        const user = await User.findOne({ mobileNumber: mobile });
        if (!user) return res.status(404).send('User not found');
        
        // 2. Create PDF
        const doc = new PDFDocument();
        
        // 3. Set response headers for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=FitGenius_${mobile}.pdf`);
        
        // 4. Pipe PDF to response
        doc.pipe(res);
        
        // 5. Add content to PDF
        doc.fontSize(20).text('FitGenius Health Report', { align: 'center' });
        doc.moveDown(0.5);
        
        doc.fontSize(14).text(`Name: ${user.name || 'N/A'}`);
        doc.text(`Mobile: ${mobile}`);
        doc.moveDown(1);
        
        doc.fontSize(16).text('Health Metrics', { underline: true });
        doc.moveDown(0.5);
        
        // Add health data (modify according to your schema)
        if (user.healthData) {
            doc.fontSize(12);
            for (const [key, value] of Object.entries(user.healthData)) {
                doc.text(`${key}: ${value}`);
            }
        }
        
        doc.moveDown(1);
        doc.fontSize(10).text(`Report generated on: ${new Date().toLocaleString()}`);
        
        // 6. Finalize PDF
        doc.end();
        
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;