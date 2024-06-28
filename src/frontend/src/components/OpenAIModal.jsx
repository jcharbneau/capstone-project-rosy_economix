import React from 'react';
import Draggable from 'react-draggable';

const OpenAIModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <Draggable handle=".titleBar">
                <div style={styles.modal}>
                    <div className="titleBar" style={styles.titleBar}>
                        <span>OpenAI - Analysis</span>
                        <button style={styles.closeButton} onClick={onClose}>X</button>
                    </div>
                    <div style={styles.content}>
                        {children}
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        width: '40%',
        maxHeight: '80%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
    },
    titleBar: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '18px', // Increased font size
        fontWeight: 'bold', // Bold font
        cursor: 'move' // Change cursor to move when hovering over the title bar
    },
    closeButton: {
        border: 'none',
        background: 'transparent',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer'
    },
    content: {
        padding: '20px',
        overflowY: 'auto', // Vertical scrolling only
        overflowX: 'hidden', // Prevent horizontal scrolling
        wordBreak: 'break-word', // Ensure text breaks correctly
        overflowWrap: 'break-word', // Ensure text breaks correctly
        whiteSpace: 'pre-wrap', // Preserve formatting and wrap text
        flex: '1 1 auto' // Ensure content area can grow and shrink
    }
};

export default OpenAIModal;
