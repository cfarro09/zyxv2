import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const NotFoundContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#bbb'
}));

const NotFoundTitle = styled('h1')({
    fontSize: '6em',
    margin: 0,
    fontWeight: 'bold',
});

const NotFoundText = styled('p')({
    fontSize: '1.5em',
    margin: '0.5em 0 2em',
});

const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <NotFoundContainer>
            <NotFoundTitle>403</NotFoundTitle>
            <NotFoundText>No tiene permisos para ver esta página</NotFoundText>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                Volver al inicio
            </Button>
        </NotFoundContainer>
    );
};

export default ForbiddenPage;