import { Close } from '@mui/icons-material';
import { Box, Button, IconButton, Modal, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const TakePhoto: React.FC<{ handleUpload: (_: File) => void; openModal: boolean; setOpenModal: (_: boolean) => void; }> = ({ openModal, setOpenModal, handleUpload }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [camera, setCamera] = useState<'user' | 'environment'>('user'); // Estado para controlar la cámara activa

    useEffect(() => {
        if (openModal) {
            const constraints = {
                video: { facingMode: camera }
            };
            navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }).catch(error => console.error("getUserMedia error:", error));
        }
    }, [openModal, camera]);

    const handleCloseModal = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setOpenModal(false);
    };

    const takePhoto = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
            if (!blob) {
                console.error("Failed to capture the photo.");
                return;
            }
            const file = new File([blob], `photo_${Date.now()}.png`, { type: 'image/png' });
            handleUpload(file);
            handleCloseModal();
        }, 'image/png');
    };

    const handleCameraChange = (_event: React.MouseEvent<HTMLElement>, newCamera: 'user' | 'environment') => {
        if (newCamera) {
            setCamera(newCamera);
        }
    };

    return (
        <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ToggleButtonGroup
                    color="primary"
                    value={camera}
                    exclusive
                    onChange={handleCameraChange}
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="user">Frontal</ToggleButton>
                    <ToggleButton value="environment">Trasera</ToggleButton>
                </ToggleButtonGroup>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video ref={videoRef} playsInline autoPlay style={{ width: '100%' }}></video>
                <Button onClick={takePhoto} sx={{ mt: 2 }}>Capturar Foto</Button>
                <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Close />
                </IconButton>
            </Box>
        </Modal>
    );
};

export default TakePhoto;
