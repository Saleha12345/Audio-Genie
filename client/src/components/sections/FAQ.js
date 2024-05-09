import React from 'react';

const FAQs = () => {
  const faqs = [
    {
      question: 'How do I separate voices from an audio file?',
      answer: 'You can separate voices by uploading an audio file and selecting the appropriate separation settings in the application.',
    },
    {
      question: 'What file formats are supported for audio separation?',
      answer: 'The application supports commonly used audio formats such as MP3, WAV, and FLAC.',
    },
    {
      question: 'I encountered an error while using the application. What should I do?',
      answer: 'If you encounter any errors or issues, please try refreshing the page or clearing your browser cache. If the problem persists, please contact our support team for assistance.',
    },
    {
      question: 'How can I request a new feature for the application?',
      answer: 'You can submit feature requests by navigating to the "Feedback" section of the application and providing details about the feature you would like to see.',
    },
    {
      question: 'Is there a limit to the duration of audio files that can be processed?',
      answer: 'The application does not impose a strict limit on the duration of audio files, but longer files may take more time to process depending on the server load.',
    },
    {
      question: 'Can I use the application on mobile devices?',
      answer: 'Yes, the application is compatible with most modern web browsers on both desktop and mobile devices. However, for the best user experience, we recommend using a desktop or laptop computer.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
      <h2 style={{ marginBottom: '20px' }}>Frequently Asked Questions (FAQs)</h2>
      {/* Map through the array of FAQs and render each FAQ item */}
      {faqs.map((faq, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#0019BF' }}>{faq.question}</h3>
          <p style={{ lineHeight: '1.6', marginRight: '190px' }}>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQs;
