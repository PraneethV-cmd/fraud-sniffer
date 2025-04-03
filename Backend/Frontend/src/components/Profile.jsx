import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // For testing, let's use a hardcoded userID=1 (you can change this later)
                const userID = 1; // or localStorage.getItem('userID');
                const response = await axios.get(`http://localhost:3000/profile/${userID}`);
                console.log('Response:', response.data); // For debugging
                setUserData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err); // For debugging
                setError('Failed to load profile data');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!userData) return <div>No user data found</div>;

    return (
        <Container className="profile-container my-4">
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center">
                            <div className="profile-avatar">
                                <img 
                                    src="/default-avatar.png" 
                                    alt="Profile" 
                                    className="rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px' }}
                                />
                            </div>
                            <h3>{userData.userName}</h3>
                            <p className="text-muted">{userData.email}</p>
                            <div className="score-badge">
                                Score: {userData.score}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile; 