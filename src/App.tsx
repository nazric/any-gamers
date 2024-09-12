import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { SeasonDataTable } from './components/SeasonDataTable';
import { Provider } from 'react-redux';
import { setupStore } from './store';
import { AnyGamersAppLayout } from './components/AnyGamersAppLayout';

const LOCALE = 'en';
const reduxStore = setupStore();

function App() {
  const breadcrumbItems = [
    { text: 'breadcrumbs.text.home', href: '#' },
    { text: 'breadcrumbs.text.service', href: '#' },
  ];
  return (
    <Provider store={reduxStore}>
      <I18nProvider locale={LOCALE} messages={[messages]}>
        <AnyGamersAppLayout header="Any Gamers???" breadcrumbItems={breadcrumbItems}>
          <SeasonDataTable/>
        </AnyGamersAppLayout>
      </I18nProvider>
    </Provider>
  );
}

export default App;
