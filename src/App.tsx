import {
  AppLayout,
  BreadcrumbGroup,
  ContentLayout,
  Flashbar,
  Header,
  HelpPanel,
  Link,
  SideNavigation,
} from '@cloudscape-design/components';
import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { SeasonDataTable } from './components/SeasonDataTable';
import { Provider } from 'react-redux';
import { setupStore } from './store';

const LOCALE = 'en';

function App() {
  const reduxStore = setupStore();
  return (
    <Provider store={reduxStore}>
      <I18nProvider locale={LOCALE} messages={[messages]}>
        <AppLayout
          breadcrumbs={
            <BreadcrumbGroup
              items={[
                { text: 'Home', href: '#' },
                { text: 'Service', href: '#' },
              ]}
            />
          }
          navigation={
            <SideNavigation
              header={{
                href: '#',
                text: 'app.navigation.serviceName',
              }}
              items={[{ type: 'link', text: `app.navigation.pageOne`, href: `#` }]}
            />
          }
          notifications={
            <Flashbar
              items={[
                {
                  type: 'info',
                  dismissible: true,
                  content: 'This is an info flash message.',
                  id: 'message_1',
                },
              ]}
            />
          }
          tools={<HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>}
          content={
            <ContentLayout
              header={
                <Header variant="h1" info={<Link variant="info">Info</Link>}>
                  Page header
                </Header>
              }
            >
              <SeasonDataTable/>
            </ContentLayout>
          }
        />
      </I18nProvider>
    </Provider>
  );
}

export default App;
