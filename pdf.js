const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const sizeOf = require('image-size');

// -- Variables
const folderPath = '/Users/rajranj/Downloads/PDFTry';
const fileName = 'test.pdf';
const isEncrypted = false;
const password = '123456';
const width = 450;

// -- Create PDF
let imagePaths = getImagePaths(folderPath);

// Create a new PDF document
let options = {
    autoFirstPage: false,
    pdfVersion: '1.7ext3',
}

if (isEncrypted) {
    options.userPassword = password;
}

const doc = new PDFDocument(options);

// Pipe the PDF document to a file
doc.pipe(fs.createWriteStream(folderPath + '/' + fileName));

// Add some content to the PDF document
let textWidth = (width * 0.7) >> 0;
doc.addPage({ size: [width, 1.5*width] })
    .moveDown()
    .fontSize(12)
    .text('Unauthorized PDF usage is prohibited. Access, distribution, or reproduction without permission is illegal and may result in legal action.', {
        width: textWidth,
        align: 'center'
    });

// Iterate over imagePaths and append each image in single page in pdf doc
imagePaths.forEach(imagePath => {
    doc.addPage({ size: [width, getHeight(imagePath)] })
        .image(imagePath, 0, 0, { width: width });
});


// Finalize the PDF document
doc.end();

console.log('PDF created successfully');


// Utility functions
function getImagePaths(folderPath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const files = fs.readdirSync(folderPath); ``
    const imageFiles = files.filter(file => {
        const extension = path.extname(file).toLowerCase();
        return imageExtensions.includes(extension);
    });
    const imagePaths = imageFiles.map(file => path.join(folderPath, file));
    return imagePaths;
}

function getHeight(imagePath) {
    const dimensions = sizeOf(imagePath);
    return (width * dimensions.height / dimensions.width) >> 0;
}
