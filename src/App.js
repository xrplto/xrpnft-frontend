import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
//import { createMuiTheme } from "@material-ui/core/styles";
import { createTheme, adaptV4Theme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import Home from "./containers/Home/Home";
import TokenTester from "./containers/TokenTester/TokenTester";
import Setting from "./containers/Setting/Setting";

import MainLayout from "./layouts/MainLayout";
import EmptyLayout from "./layouts/EmptyLayout";

import { getTheme } from "./context/settingsReducer";
import './App.css';

const NotFound = () => {
  return <div>NotFound</div>;
};

const DashboardRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <MainLayout>
          <Component {...matchProps} />
        </MainLayout>
      )}
    />
  );
};

const EmptyRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <EmptyLayout>
          <Component {...matchProps} />
        </EmptyLayout>
      )}
    />
  );
};

export default function App() {
  
  const theTheme = useSelector(getTheme);

     return (
      <ThemeProvider theme={createTheme(theTheme)}>
        <CssBaseline />
        {/* <div style={{ height: "100vh" }}> */}
          <Router>
            <Routes>
              <DashboardRoute path="/dashboard" component={Home} />
              <DashboardRoute path="/token_tester" component={TokenTester} />
              <DashboardRoute path="/setting" component={Setting} />
              <DashboardRoute exact path="/" component={Home} />
              <EmptyRoute component={NotFound} />
            </Routes>
          </Router>
        {/* </div> */}
      </ThemeProvider>
    );
};