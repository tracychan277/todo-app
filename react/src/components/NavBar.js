import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const NavBar = ({ signOut }) => {
  return (
    <Box sx={{flexGrow: 1, marginBottom: '1rem'}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            To-Do List
          </Typography>
          <Button color="inherit" onClick={signOut}>Sign Out</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
