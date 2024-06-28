import html2canvas from 'html2canvas';
import axios from 'axios';

const captureAndUpload = async (elementId, file, aiprompt, url, setIsLoading, setFeedback, setPaneOpen) => {
  const chartElement = document.getElementById(elementId);
  setIsLoading(true);
  setPaneOpen(true);

  html2canvas(chartElement, {
    useCORS: true,
    scale: 2
  }).then(canvas => {
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, file);
      formData.append('aiprompt', aiprompt);
      try {
        const response = await axios.post(url, formData);
        const feedbackData = response.data.feedback;
        const cleanedFeedback = feedbackData.replace(/<pre[^>]*>/g, '').replace(/<\/pre>/g, '').trim();
        setFeedback(cleanedFeedback);
      } catch (error) {
        console.error('Error uploading chart:', error);
      } finally {
        setIsLoading(false);
      }
    });
  });
};

export default captureAndUpload;
