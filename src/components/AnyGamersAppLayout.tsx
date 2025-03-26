import { AppLayout, ContentLayout, Header, Link } from "@cloudscape-design/components"
import { ReactNode } from "react";

export interface AnyGamersAppLayoutProps {
  header: ReactNode;
  children?: ReactNode;
}

export const AnyGamersAppLayout = ({ header,  children }: AnyGamersAppLayoutProps) => {

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
    navigationHide
    toolsHide
    content={content()}
  />
}