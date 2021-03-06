import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Layout from '@modules/layout';
import CustomSwitch from '@modules/common/components/CustomSwitch';
import HomePage from '@modules/home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { WalletConnect } from '@modules/providers/WalletConnect';
import { ModalProvider } from '@modules/providers/ModalProvider';
import Web3Wrapper from '@modules/web3/containers/Web3Wrapper';

const modulesData = [{ path: '/', title: 'home', component: HomePage }];

const isBrowserSupportsHistory = 'pushState' in window.history;
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});
const NoFound = () => <Redirect to="/404" />;

function App() {
  return (
    <BrowserRouter forceRefresh={!isBrowserSupportsHistory}>
      <QueryClientProvider client={queryClient}>
        <Web3Wrapper>
          <WalletConnect>
            <ModalProvider>
              <Layout>
                <CustomSwitch>
                  {modulesData.map(({ path, title, component }) => (
                    <Route exact key={title} path={path} component={component} />
                  ))}
                  <Route component={NoFound} key="pageNotFound" />
                </CustomSwitch>
              </Layout>
            </ModalProvider>
          </WalletConnect>
        </Web3Wrapper>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
