import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const NavBar = (props) => {
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            Todo List
          </Typography>
          <Button color="inherit" onClick={props.signOut}>Sign Out</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
