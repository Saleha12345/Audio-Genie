import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const FAQs = () => {
  const faqs = [
    {
      question: 'How do I separate voices from an audio file?',
      answer: 'You can separate voices by uploading an audio file and selecting the appropriate separation settings in the application.',
    },
    {
      question: 'What file formats are supported for audio separation?',
      answer: 'The application supports commonly used audio format WAV',
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
    <div style={{ textAlign: 'left', padding: '20px', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '20px' }}>Frequently Asked Questions (FAQs)</h2>
      {faqs.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
            {faq.question}
          </AccordionSummary>
          <AccordionDetails>
            <p style={{ lineHeight: '1.6', textAlign: 'left' }}>{faq.answer}</p>
          </AccordionDetails>

        </Accordion>
      ))}
    </div>
  );
};

export default FAQs;
