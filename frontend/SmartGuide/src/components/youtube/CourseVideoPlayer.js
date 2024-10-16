import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CourseVideoPlayer.css'; // Import the corresponding CSS file

const API_URL = 'http://localhost:8000/api';

const CourseVideoPlayer = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [videoData, setVideoData] = useState([]); // To store video data fetched for the selected course
    const [floatingVideoUrl, setFloatingVideoUrl] = useState('');

    // Fetch course list on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_URL}/view_courses_details/`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error('Failed to fetch courses. Please try again.'); // Notify on error
            }
        };

        fetchCourses();
    }, []);

    // Handle course selection
    const handleCourseSelect = async (course) => {
        // Check if the clicked course is already selected
        if (selectedCourse && selectedCourse.id === course.id) {
            // If it is, toggle video visibility by resetting state
            setSelectedCourse(null);
            setVideoData([]);
        } else {
            // If it's a new course, set it as selected
            setSelectedCourse(course);
            setFloatingVideoUrl(''); // Close the floating video player if open
            await fetchVideoData(course.id); // Fetch video data for the selected course
        }
    };

    // Fetch video data for the selected course
    const fetchVideoData = async (courseId) => {
        try {
            const response = await axios.post(`${API_URL}/view_courses_details/`, { course_id: courseId });
            console.log('Raw video data:', response.data); // Debugging: Log the raw response
            setVideoData(formatVideoData(response.data)); // Format the raw video data
            toast.success('Videos fetched successfully!'); // Notify on success
        } catch (error) {
            console.error('Error fetching video data:', error);
            setVideoData([]); // Reset video data in case of error
            toast.error('Failed to fetch videos. Please try again.'); // Notify on error
        }
    };

    // Function to format the raw video data
    const formatVideoData = (rawData) => {
        // Check if rawData is an array
        if (!Array.isArray(rawData)) {
            console.error('Invalid video data format:', rawData); // Log error if format is incorrect
            return [];
        }

        // Map through the rawData to extract required fields
        return rawData.flatMap(videoInfo => {
            const videoData = videoInfo.video_data; // Access video_data from each item
            return videoData.items.map(video => ({
                id: video.id,
                title: video.snippet.title,
                thumbnailUrl: video.snippet.thumbnails.high.url, // Using high-quality thumbnail
                embedUrl: `https://www.youtube.com/embed/${video.id}`, // Constructing the embed URL
            }));
        });
    };

    const playVideo = (url) => {
        setFloatingVideoUrl(url);
    };

    const closeVideoPlayer = () => {
        setFloatingVideoUrl('');
    };

    return (
        <div className="course-video-player">
            {/* Marketing Description */}
            <div className="course-description">
                <h2>Welcome to Our Online Learning Platform!</h2>
                <p>
                    Unlock your potential with our diverse range of online courses designed to cater to all learners, 
                    from beginners to advanced practitioners. Our expertly crafted content provides you with the skills and knowledge 
                    needed to thrive in today's fast-paced world. 
                </p>
                <p>
                    Whether you're looking to upskill in your current profession, explore a new career path, or simply learn something new, 
                    our platform offers flexible learning options that fit your schedule. Join our community of passionate learners 
                    and take your first step towards achieving your goals today!
                </p>
            </div>

            <h2>Select a Course</h2>
            <ul className="course-list">
                {courses.map(course => (
                    <li 
                        key={course.id} 
                        onClick={() => handleCourseSelect(course)}
                        className={selectedCourse && selectedCourse.id === course.id ? 'active' : ''}
                    >
                        {course.title}
                    </li>
                ))}
            </ul>

            {selectedCourse && videoData.length > 0 && (
                <div className="video-list-section">
                    <h3>Videos in {selectedCourse.title}</h3>
                    <div className="video-grid">
                        {videoData.map(video => (
                            <div key={video.id} className="video-thumbnail" onClick={() => playVideo(video.embedUrl)}>
                                <img src={video.thumbnailUrl} alt={video.title} />
                                <p>{video.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {floatingVideoUrl && (
                <FloatingVideoPlayer videoUrl={floatingVideoUrl} onClose={closeVideoPlayer} />
            )}
            <ToastContainer /> {/* Add ToastContainer here */}
        </div>
    );
};

const FloatingVideoPlayer = ({ videoUrl, onClose }) => {
    return (
        <div className="floating-video-player">
            <button className="close-button" onClick={onClose}>✖</button>
            <div className="video-wrapper">
                <iframe
                    src={videoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Playing: ${videoUrl.split('/').pop()}`} // Add a unique title here
                ></iframe>
            </div>
        </div>
    );
};

export default CourseVideoPlayer;
