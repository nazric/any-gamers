import { AppLayout, BreadcrumbGroup, ContentLayout, Flashbar, Header, HelpPanel, Link, SideNavigation } from "@cloudscape-design/components"
import { ReactNode } from "react";

export interface AnyGamersAppLayoutProps {
  header: ReactNode;
  breadcrumbItems: readonly { text: string; href: string; }[];
  children?: ReactNode;
}

export const AnyGamersAppLayout = ({ header, breadcrumbItems,  children }: AnyGamersAppLayoutProps) => {

  function breadcrumbs() {
    return <BreadcrumbGroup
      items={breadcrumbItems}
    />
  }

  function sideNav() {
    return <SideNavigation
      header={{
        href: '#',
        text: 'app.navigation.serviceName',
      }}
      items={[{ type: 'link', text: `app.navigation.pageOne`, href: `#` }]}
    />
  }

  function notifications() {
    return <Flashbar
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

  function tools() {
    return <HelpPanel header={<h2>Overview</h2>}>Help content</HelpPanel>
  }

  function content() {
    return <ContentLayout
      header={
        <Header variant="h1" info={<Link variant="info">Info</Link>}>
          {header}
        </Header>
      }
    >
      {children}
    </ContentLayout>
  }

  return <AppLayout
    breadcrumbs={breadcrumbs()}
    navigation={sideNav()}
    notifications={notifications()}
    tools={tools()}
    content={content()}
  />
}