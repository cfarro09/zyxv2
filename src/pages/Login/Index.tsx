import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { login } from 'stores/login/actions';
import { useSelector } from 'hooks';
import { getAccessToken } from 'common/helpers';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Queen Store
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const ContainerDiv = styled('div')(() => ({
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100vw'
}));

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignIn() {
    const dispatch = useDispatch();
    const resLogin = useSelector(state => state.login.login);

    React.useEffect(() => {
        if (!resLogin.error && resLogin.user && getAccessToken()) {
            window.open("users", "_self");
        }
    }, [resLogin]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        // const token = await recaptchaRef?.current?.executeAsync();
        // setshowError(true);
        dispatch(login(data.get("username") + "", data.get("password") + ""));
        // console.log({
        //     email: data.get('email'),
        //     password: data.get('password'),
        // });
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center' }}>
            <ContainerDiv>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <img src='./logo.png' alt='logo' width={200} />
                        <Typography component="h1" variant="h5">
                            Inicia sesión
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Usuario"
                                name="username"
                                autoComplete="username"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            {/* <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                /> */}
                            <Button
                                type="submit"
                                fullWidth
                                disabled={resLogin.loading}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Iniciar sesión
                            </Button>
                            {/* <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="#" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid> */}
                        </Box>
                    </Box>
                    <Copyright />
                </Container>
            </ContainerDiv>
        </Box>
    );
}