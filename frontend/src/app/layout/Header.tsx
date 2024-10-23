import { AppBar, Box, Icon, List, ListItem, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/context/AuthContext"; // Import your Auth context
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Define types for the links
type NavLinkType = { title: string; path: string; icon?: undefined } | { icon: JSX.Element; path: string; title?: undefined };

const leftLinks: NavLinkType[] = [
    { title: 'catalog', path: '/subjects' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' }
];

const authorizedRightLinks: NavLinkType[] = [
    { icon: <AccountCircleIcon sx={{ fontSize: 35 }} />, path: '/settings' },
    { title: 'logout', path: '/logout'}
];

const unauthorizedRightLinks: NavLinkType[] = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' }
];

const navStyles = {
    color: 'inherit',
    transition: "all 0.2s ease-in-out",
    '&:hover': {
        backgroundColor: 'primary.light',
        color: 'white'
    }
}

function Header() {
    const { token } = useAuth(); // Get token from Auth context
    const isLoggedIn = !!token; // Determine if user is logged in

    return (
        <AppBar position='static' sx={{ mb: 4 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        variant='h6'
                        component={NavLink}
                        to='/'
                        sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            marginRight: '10px'
                        }}
                    >
                        Note Master
                    </Typography>
                    <List sx={{ display: 'flex',  }}>
                        {leftLinks.map(({ title, path, icon }) => (
                            <ListItem
                                key={path}
                                component={NavLink}
                                to={path}
                                sx={navStyles
                                }
                            >
                                {title ? title.toUpperCase() : icon}
                            </ListItem>

                        ))}
                    </List>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <List sx={{ display: 'flex' }}>
                        {(isLoggedIn ? authorizedRightLinks : unauthorizedRightLinks).map(({ title, path, icon }) => (
                            <ListItem
                                key={path}
                                component={NavLink}
                                to={path}
                                sx={navStyles}
                            >
                                {icon || title?.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header;
