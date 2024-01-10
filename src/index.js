import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import  PrivateRoute from 'utils/PrivateRoute';
import { AuthProvider } from 'contexts/AuthContext';

ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<ThemeEditorProvider>
				<HashRouter>
					<AuthProvider>
						<Switch>
							<Route path={`/auth`} component={AuthLayout} />

							<PrivateRoute path={`/admin`} component={AdminLayout} />
							
							<Route path={`/rtl`} component={RtlLayout} />
							<Redirect from='/' to='/admin' /> 
							
						</Switch>
					</AuthProvider>
				</HashRouter>
			</ThemeEditorProvider>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);
