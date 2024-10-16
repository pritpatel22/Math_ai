// import React from 'react';
// import './Hero.css'; // Custom CSS for additional styling

// const Hero = () => {
//     return (
//         <>
//             {/* Hero Section */}
//             <section className="hero">
//                 <div className="container">
//                     <h2 className="display-4">Unlock Your Potential with Smart Guide</h2>
//                     <p className="lead">Better learning with great tools.</p>
//                     <a href="/services" className="btn btn-outline-light">Explore Services</a>
//                 </div>
//             </section>

//             {/* Popular Videos Section */}
//             <section className="section__courses">
//                 <div className="container-fluid">
//                     <div className="home-section-title home-section-title--left home-section-title--courses">
//                         <h2>Popular Videos</h2>
//                     </div>

//                     <div className="section__courses-lessons row">
//                         {/* Lesson 1 */}
//                         <article className="col-md-4 mb-4">
//                             <div className="card h-100 bg-light text-center">
//                                 <div className="card-body">
//                                     <div className="card-meta">
//                                         <span className="badge badge-warning p-2 mb-2">Course</span>
//                                         <p className="text-muted">3 hours of content</p>
//                                     </div>
//                                     <h3 className="card-title">
//                                         <a href="https://websitelearners.com/wordpress-course/" target="_blank" rel="noopener noreferrer">
//                                             WordPress Course (2021)
//                                         </a>
//                                     </h3>
//                                     <p className="card-text">Learn everything about WordPress with this course.</p>
//                                     <a href="https://websitelearners.com/wordpress-course/" className="btn btn-success mt-3" target="_blank" rel="noopener noreferrer">View Course</a>
//                                 </div>
//                             </div>
//                         </article>

//                         {/* Lesson 2 */}
//                         <article className="col-md-4 mb-4">
//                             <div className="card h-100 bg-light text-center">
//                                 <div className="card-body">
//                                     <div className="card-meta">
//                                         <span className="badge badge-success p-2 mb-2">Security</span>
//                                     </div>
//                                     <h3 className="card-title">
//                                         <a href="https://www.youtube.com/watch?v=lPAt2nfgtPA" target="_blank" rel="noopener noreferrer">
//                                             How to Get a Free SSL for your Website
//                                         </a>
//                                     </h3>
//                                     <p className="card-text">Watch this video to get a Free SSL for your WordPress website and secure it with a lock symbol.</p>
//                                     <a href="https://www.youtube.com/watch?v=lPAt2nfgtPA" className="btn btn-success mt-3" target="_blank" rel="noopener noreferrer">Learn more</a>
//                                 </div>
//                             </div>
//                         </article>

//                         {/* Lesson 3 */}
//                         <article className="col-md-4 mb-4">
//                             <div className="card h-100 bg-light text-center">
//                                 <div className="card-body">
//                                     <div className="card-meta">
//                                         <span className="badge badge-primary p-2 mb-2">Design</span>
//                                     </div>
//                                     <h3 className="card-title">
//                                         <a href="https://www.youtube.com/watch?v=wVrEeImyg_E" target="_blank" rel="noopener noreferrer">
//                                             How To Make A Logo in 5 Minutes - for Free
//                                         </a>
//                                     </h3>
//                                     <p className="card-text">Watch how you can create a logo for free using 4 simple steps.</p>
//                                     <a href="https://www.youtube.com/watch?v=wVrEeImyg_E" className="btn btn-success mt-3" target="_blank" rel="noopener noreferrer">Learn more</a>
//                                 </div>
//                             </div>
//                         </article>

//                         {/* Lesson 4 */}
//                         <article className="col-md-4 mb-4">
//                             <div className="card h-100 bg-light text-center">
//                                 <div className="card-body">
//                                     <div className="card-meta">
//                                         <span className="badge badge-info p-2 mb-2">Course</span>
//                                         <p className="text-muted">2 hours of content</p>
//                                     </div>
//                                     <h3 className="card-title">
//                                         <a href="https://websitelearners.com/elementor-course/" target="_blank" rel="noopener noreferrer">
//                                             Elementor Course
//                                         </a>
//                                     </h3>
//                                     <p className="card-text">Learn how to build stunning WordPress sites using Elementor.</p>
//                                     <a href="https://websitelearners.com/elementor-course/" className="btn btn-success mt-3" target="_blank" rel="noopener noreferrer">View Course</a>
//                                 </div>
//                             </div>
//                         </article>

//                         {/* Lesson 5 */}
//                         <article className="col-md-4 mb-4">
//                             <div className="card h-100 bg-light text-center">
//                                 <div className="card-body">
//                                     <div className="card-meta">
//                                         <span className="badge badge-dark p-2 mb-2">Marketing</span>
//                                     </div>
//                                     <h3 className="card-title">
//                                         <a href="https://www.youtube.com/watch?v=BnJWwaClv7E" target="_blank" rel="noopener noreferrer">
//                                             How to Do Email Marketing
//                                         </a>
//                                     </h3>
//                                     <p className="card-text">A comprehensive video guide on mastering email marketing for your business.</p>
//                                     <a href="https://www.youtube.com/watch?v=BnJWwaClv7E" className="btn btn-success mt-3" target="_blank" rel="noopener noreferrer">Learn more</a>
//                                 </div>
//                             </div>
//                         </article>

//                         {/* Lesson 6 */}
//                         <article className="col-md-4 mb-4">
//                             <div className="card h-100 bg-light text-center">
//                                 <div className="card-body">
//                                     <div className="card-meta">
//                                         <span className="badge badge-secondary p-2 mb-2">Design</span>
//                                     </div>
//                                     <h3 className="card-title">
//                                         <a href="https://www.youtube.com/watch?v=Rl3wd4E9fdc" target="_blank" rel="noopener noreferrer">
//                                             Learn Web Design - 10 Easy Steps
//                                         </a>
//                                     </h3>
//                                     <p className="card-text">Discover how to design beautiful websites in just 10 simple steps.</p>
//                                     <a href="https://www.youtube.com/watch?v=Rl3wd4E9fdc" className="btn btn-success mt-3" target="_blank" rel="noopener noreferrer">Learn more</a>
//                                 </div>
//                             </div>
//                         </article>
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// export default Hero;


import React from 'react';
import './Hero.css'; // Custom CSS for additional styling

const videos = [
    {
        title: "WordPress Course (2021)",
        link: "https://websitelearners.com/wordpress-course/",
        thumbnail: "https://img.youtube.com/vi/VIDEO_ID_1/hqdefault.jpg", // Replace VIDEO_ID_1 with actual ID
    },
    {
        title: "How to Get a Free SSL for your Website",
        link: "https://www.youtube.com/watch?v=lPAt2nfgtPA",
        thumbnail: "https://img.youtube.com/vi/lPAt2nfgtPA/hqdefault.jpg",
    },
    {
        title: "How To Make A Logo in 5 Minutes - for Free",
        link: "https://www.youtube.com/watch?v=wVrEeImyg_E",
        thumbnail: "https://img.youtube.com/vi/wVrEeImyg_E/hqdefault.jpg",
    },
    {
        title: "Elementor Course",
        link: "https://websitelearners.com/elementor-course/",
        thumbnail: "https://img.youtube.com/vi/VIDEO_ID_2/hqdefault.jpg", // Replace VIDEO_ID_2 with actual ID
    },
    {
        title: "How to Do Email Marketing",
        link: "https://www.youtube.com/watch?v=BnJWwaClv7E",
        thumbnail: "https://img.youtube.com/vi/BnJWwaClv7E/hqdefault.jpg",
    },
    {
        title: "Learn Web Design - 10 Easy Steps",
        link: "https://www.youtube.com/watch?v=Rl3wd4E9fdc",
        thumbnail: "https://img.youtube.com/vi/Rl3wd4E9fdc/hqdefault.jpg",
    },
];

const Hero = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h2 className="display-4">Unlock Your Potential with Smart Guide</h2>
                    <p className="lead">Better learning with great tools.</p>
                    <a href="/services" className="btn btn-outline-light">Explore Services</a>
                </div>
            </section>

            {/* Popular Videos Section */}
            <section className="section__courses">
                <div className="container-fluid">
                    <div className="home-section-title">
                        <h2>Popular Videos</h2>
                    </div>

                    <div className="section__courses-lessons row">
                        {videos.map((video, index) => (
                            <article className="col-md-4 mb-4" key={index}>
                                <a href={video.link} target="_blank" rel="noopener noreferrer">
                                    <img 
                                        src={video.thumbnail} 
                                        alt={video.title} 
                                        className="img-fluid video-thumbnail" 
                                    />
                                    <h3 className="video-title">{video.title}</h3>
                                </a>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;
