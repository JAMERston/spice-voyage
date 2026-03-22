import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ShopPage from '@/components/pages/ShopPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import AboutPage from '@/components/pages/AboutPage';
import HowItWorksPage from '@/components/pages/HowItWorksPage';
import ContactPage from '@/components/pages/ContactPage';
import CheckoutPage from '@/components/pages/CheckoutPage';
import OrdersNotificationsPage from '@/components/pages/OrdersNotificationsPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "shop",
        element: <ShopPage />,
        routeMetadata: {
          pageIdentifier: 'shop',
        },
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
        routeMetadata: {
          pageIdentifier: 'product-detail',
        },
      },
      {
        path: "about",
        element: <AboutPage />,
        routeMetadata: {
          pageIdentifier: 'about',
        },
      },
      {
        path: "how-it-works",
        element: <HowItWorksPage />,
        routeMetadata: {
          pageIdentifier: 'how-it-works',
        },
      },
      {
        path: "contact",
        element: <ContactPage />,
        routeMetadata: {
          pageIdentifier: 'contact',
        },
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
        routeMetadata: {
          pageIdentifier: 'checkout',
        },
      },
      {
        path: "orders",
        element: <OrdersNotificationsPage />,
        routeMetadata: {
          pageIdentifier: 'orders-notifications',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
