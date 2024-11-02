import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { QuestionMarkCircleIcon, MicrophoneIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/solid';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './AIPane.css';

const AIPane = ({ isOpen, isLoading, feedback, onClose, onRefresh, onQuery }) => {
    const [question, setQuestion] = useState('');
    const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

    useEffect(() => {
        if (!listening && transcript) {
            setQuestion(transcript);
            console.log(transcript); // Log the final transcript
            // onQuery(transcript);
        }
    }, [listening, transcript]);

    const handleQuestionClick = () => {
        if (question) {
            onQuery(question);
            setQuestion('');
        }
    };

    const handleMicrophoneClick = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: false });
    };

    const handleStopListening = () => {
        SpeechRecognition.stopListening();
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className={`ai-right-pane ${isOpen ? 'ai-open' : 'ai-closed'}`}>
            <div className="ai-title-container">
                <h2>
                    <span className="ai-title">Insights</span>
                    <span className="ai-tagline">by Rosy AI&trade;</span>
                </h2>
                <div className="ai-action-buttons">
                    <button className="ai-question-button" onClick={handleQuestionClick}>
                        <QuestionMarkCircleIcon className="h-6 w-6 ai-icon" />
                    </button>
                    <button
                        className={`ai-microphone-button ${listening ? 'ai-microphone-active' : ''}`}
                        onMouseDown={handleMicrophoneClick}
                        onMouseUp={handleStopListening}
                    >
                        <MicrophoneIcon className="h-6 w-6 ai-icon" />
                    </button>
                    <button className="ai-refresh-button" onClick={onRefresh}>
                        <ArrowPathIcon className="h-6 w-6 ai-icon" />
                    </button>
                    <button className="ai-close-button" onClick={onClose}>
                        <XMarkIcon className="h-6 w-6 ai-icon" />
                    </button>
                </div>
            </div>
            <div className="ai-rosy-line"></div>
            <div className="ai-content">
                {isLoading ? (
                    <div className="ai-spinner-container">
                        <div className="ai-spinner"></div>
                        <div className="ai-spinner-text">Loading Insights...</div>
                    </div>
                ) : (
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                )}
            </div>
            {/*<div className="ai-footer"></div>*/}
        </div>
    );
};

export default AIPane;
