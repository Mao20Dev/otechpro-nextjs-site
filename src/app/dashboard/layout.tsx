
import Header from '@/components/header';
import HeaderMobile from '@/components/header-mobile';
import MarginWidthWrapper from '@/components/margin-width-wrapper';
import PageWrapper from '@/components/page-wrapper';
import SideNav from '@/components/side-nav';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
    <div className="flex">
        <SideNav />
        <main className="flex-1">
            <MarginWidthWrapper>
            <Header />
            <HeaderMobile />
            <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
        </main>
    </div>
    );
}