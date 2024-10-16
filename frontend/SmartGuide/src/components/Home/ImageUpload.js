import React, { useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { uploadImage } from '../../api/upload';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [showConfirmButtons, setShowConfirmButtons] = useState(false);
    const [solution, setSolution] = useState('');
    const [videoLinks, setVideoLinks] = useState([]);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file before uploading.');
            return;
        }

        // Reset solution and video links when starting a new upload
        setSolution('');
        setVideoLinks([]);
        setIsConfirmed(false);

        setIsLoading(true);
        try {
            const uploadResult = await uploadImage(file);
            const text = uploadResult.extracted_text || '';
            setExtractedText(text);
            toast.success('Image uploaded successfully!');

            // Show confirm/reject buttons
            setShowConfirmButtons(true);
        } catch (err) {
            console.error('Upload failed:', err);
            toast.error('Failed to upload and process the image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        try {
            const solveResponse = await fetch('http://localhost:8000/api/upload/solve/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: extractedText }),
            });

            if (!solveResponse.ok) {
                const errorText = await solveResponse.text();
                toast.error(`Failed to solve the equation: ${errorText}`);
                setSolution('');
                setVideoLinks([]);
                return;
            }

            const solveData = await solveResponse.json();
            setSolution(solveData.solution || '');
            setVideoLinks(solveData.video_links || []);
            setIsConfirmed(true);
            setShowConfirmButtons(false); // Hide confirm/reject buttons
        } catch (error) {
            toast.error('An error occurred while processing your request.');
            setIsConfirmed(false);
        }
    };

    const handleReject = () => {
        setExtractedText('');
        setShowConfirmButtons(false); // Hide confirm/reject buttons
        setIsConfirmed(false);
    };

    return (
        <div className="image-upload">
            <div className="container-fluid">
                <Form.Group className="form-group">
                    <Form.Label>Choose an image file:</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
                
                {/* Textarea merged with file input */}
                <Form.Group className="form-group">
                    <Form.Label>Extracted Text (Remove everything except equation):</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        className="mb-3"
                    />
                </Form.Group>
                
                {!showConfirmButtons && (
                    <Button className="upload-button" onClick={handleUpload} disabled={isLoading}>
                        {isLoading ? 'Uploading...' : 'Upload'}
                    </Button>
                )}
                
                {/* Confirm/Reject buttons */}
                {showConfirmButtons && (
                    <div className="confirm-buttons">
                        <Button variant="danger" onClick={handleReject} className="mr-2">✗ Reject</Button>
                        <Button variant="success" onClick={handleConfirm}>✓ Confirm</Button>
                    </div>
                )}
                
                {/* Show results if confirmed */}
                {isConfirmed && (
                    <div className="result-section mt-5">
                        <h2 className="animate-fadein">Solution:</h2>
                        <p>{solution}</p>
                        <h2 className="animate-fadein">Related Videos:</h2>
                        <ListGroup>
                            {videoLinks.length > 0 ? (
                                videoLinks.map((video, index) => (
                                    <ListGroup.Item key={index}>
                                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                                            {video.title}
                                        </a>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>No related videos found.</ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
