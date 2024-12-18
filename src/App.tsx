import React, { JSX, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@/components/Layout";
import { Loading } from "@/components/Loading";
import { routerInfo } from "@/shared/routing/routerInfo.tsx";

const lazyLoad = (
  componets: () => Promise<{ default: React.ComponentType<unknown> }>,
) => (
  <Suspense fallback={<Loading />}>
    {React.createElement(React.lazy(componets))}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: routerInfo.map(({ path, element }) => ({
      path,
      element: lazyLoad(element),
    })),
  },
]);

/**
 * The main application component.
 * @returns {JSX.Element} The rendered application component.
 */
function App(): JSX.Element {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
