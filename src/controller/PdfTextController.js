const pdf = require('pdf-parse'); // Ensure this is imported
const PdfText = require("../model/PdfTextModel") // Adjust the path as necessary

exports.uploadPdf = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    console.log("File uploaded by Rahim");

    const pdfBuffer = req.file.buffer;

    // Check if buffer is not empty
    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(400).send('Uploaded file is empty.');
    }

    // Extract text from the PDF using pdf-parse
    const data = await pdf(pdfBuffer);

    console.log('Extracted PDF text:', data.text);

    // Clean the extracted text (replace newlines with space)
    const cleanedText = data.text.replace(/\n/g, ' ');

    // Store the extracted text in the database
    const pdfText = await PdfText.create({ content: cleanedText });

    res.status(200).json({ message: 'File uploaded successfully!', id: pdfText.id });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).send(`Error processing the file: ${error.message}`);
  }
};


  exports.getTextById = async (req, res) => {
    try {
      const id = req.params.id;
      const pdfText = await PdfText.findByPk(id);
  
      if (!pdfText) {
        return res.status(404).json({ message: 'Text not found' });
      }
  
      res.status(200).json({ id: pdfText.id, content: pdfText.content });
    } catch (error) {
      console.error('Error fetching text:', error);
      res.status(500).send(`Error fetching the text: ${error.message}`);
    }
  };
  
  