import React, { Suspense, lazy } from "react";
import { useParams, useRoutes } from "react-router-dom";

import { Bullseye, Spinner } from "@patternfly/react-core";

const Home = lazy(() => import("./pages/home"));
const AdvisoryList = lazy(() => import("./pages/advisory-list"));
const AdvisoryDetails = lazy(() => import("./pages/advisory-details"));
const VulnerabilityList = lazy(() => import("./pages/vulnerability-list"));
const VulnerabilityDetails = lazy(
  () => import("./pages/vulnerability-details")
);
const PackageList = lazy(() => import("./pages/package-list"));
const PackageDetails = lazy(() => import("./pages/package-details"));
const SBOMList = lazy(() => import("./pages/sbom-list"));
const SBOMDetails = lazy(() => import("./pages/sbom-details"));
const ImporterList = lazy(() => import("./pages/importer-list"));

export enum PathParam {
  ADVISORY_ID = "advisoryId",
  VULNERABILITY_ID = "vulnerabilityId",
  SBOM_ID = "sbomId",
  PACKAGE_ID = "packageId",
  IMPORTER_ID = "importerId",
}

export const AppRoutes = () => {
  const allRoutes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/advisories", element: <AdvisoryList /> },
    {
      path: `/advisories/:${PathParam.ADVISORY_ID}`,
      element: <AdvisoryDetails />,
    },
    { path: "/vulnerabilities", element: <VulnerabilityList /> },
    {
      path: `/vulnerabilities/:${PathParam.VULNERABILITY_ID}`,
      element: <VulnerabilityDetails />,
    },
    { path: "/packages", element: <PackageList /> },
    {
      path: `/packages/:${PathParam.PACKAGE_ID}`,
      element: <PackageDetails />,
    },
    { path: "/sboms", element: <SBOMList /> },
    {
      path: `/sboms/:${PathParam.SBOM_ID}`,
      element: <SBOMDetails />,
    },
    {
      path: `/importers`,
      element: <ImporterList />,
    },
  ]);

  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      {allRoutes}
    </Suspense>
  );
};

export const useRouteParams = (pathParam: PathParam) => {
  const params = useParams();
  return params[pathParam];
};
