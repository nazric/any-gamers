import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { SeasonDataTable } from './components/SeasonDataTable';
import { AnyGamersAppLayout } from './components/AnyGamersAppLayout';

const LOCALE = 'en';

function App() {
  const breadcrumbItems = [
    { text: 'breadcrumbs.text.home', href: '#' },
    { text: 'breadcrumbs.text.service', href: '#' },
  ];
  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AnyGamersAppLayout header="Any Gamers???" breadcrumbItems={breadcrumbItems}>
        <SeasonDataTable/>
      </AnyGamersAppLayout>
    </I18nProvider>
  );
}

export default App;
