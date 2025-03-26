import { I18nProvider } from '@cloudscape-design/components/i18n';
import messages from '@cloudscape-design/components/i18n/messages/all.en';
import { SeasonDataTable } from './components/SeasonDataTable';
import { AnyGamersAppLayout } from './components/AnyGamersAppLayout';

const LOCALE = 'en';

function App() {
  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <AnyGamersAppLayout header="Any Gamers?">
        <SeasonDataTable/>
      </AnyGamersAppLayout>
    </I18nProvider>
  );
}

export default App;
