// useDownload.js
import JSZip from 'jszip';

export const useDownload = (content) => {
    const downloadAllContent = () => {
        const zip = new JSZip();

        // Iterate through each file in the content object
        Object.keys(content).forEach(fileName => {
            const fileContent = content[fileName];
            zip.file(fileName, fileContent);
        });

        // Generate the zip file asynchronously
        zip.generateAsync({ type: 'blob' })
            .then(blob => {
                // Create a tag to trigger the download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'DevMesh.zip';
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
            })
            .catch(error => console.error('Error generating zip file:', error));
    };

    return downloadAllContent;
};
