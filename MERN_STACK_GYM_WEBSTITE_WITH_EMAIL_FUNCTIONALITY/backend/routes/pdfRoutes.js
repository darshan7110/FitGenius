// routes/pdfRoutes.js
import express from 'express';
import PDFDocument from 'pdfkit';
import User from '../models/HealthData.js'; 

const router = express.Router();

router.get('/generate/:mobile', async (req, res) => {
    try {
        const { mobile } = req.params;
        
        // Fetch user data
        const user = await User.findOne({ mobileNumber: mobile });
        if (!user) return res.status(404).send('User not found');
        
        // Create PDF
        const doc = new PDFDocument();
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=FitGenius_${mobile}.pdf`);
        
        // Pipe PDF to response
        doc.pipe(res);
        
        // Add content
        doc.fontSize(20).text('FitGenius Health Report', { align: 'center' });
        doc.moveDown();
        
        // Add user details
        doc.fontSize(14).text(`Name: ${user.name || 'N/A'}`);
        doc.text(`Mobile: ${mobile}`);
        doc.moveDown();
        
        // Add health data
        doc.fontSize(16).text('Health Metrics:', { underline: true });
        doc.moveDown();
        
        if (user.healthData) {
            for (const [key, value] of Object.entries(user.healthData)) {
                doc.text(`${key}: ${value}`);
            }
        }
        
        // Add plans if available
        if (user.workout?.content) {
            doc.addPage();
            doc.fontSize(16).text('Workout Plan:', { underline: true });
            doc.moveDown();
            doc.text(user.workout.content);
        }
        
        // Finalize
        doc.end();
        
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).send('Error generating PDF');
    }
});

export default router;