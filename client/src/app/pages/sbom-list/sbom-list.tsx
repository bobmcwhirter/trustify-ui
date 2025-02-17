import React from "react";
import { NavLink } from "react-router-dom";

import dayjs from "dayjs";

import {
  Button,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import DownloadIcon from "@patternfly/react-icons/dist/esm/icons/download-icon";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";

import {
  RENDER_DATE_FORMAT,
  TablePersistenceKeyPrefixes,
} from "@app/Constants";
import { VulnerabilityGallery } from "@app/components/VulnerabilityGallery";
import { FilterToolbar, FilterType } from "@app/components/FilterToolbar";
import { SimplePagination } from "@app/components/SimplePagination";
import {
  ConditionalTableBody,
  TableHeaderContentWithControls,
} from "@app/components/TableControls";
import {
  getHubRequestParams,
  useTableControlProps,
  useTableControlState,
} from "@app/hooks/table-controls";
import { useDownload } from "@app/hooks/useDownload";
import { useSelectionState } from "@app/hooks/useSelectionState";
import { useFetchSBOMs } from "@app/queries/sboms";

export const SbomList: React.FC = () => {
  const tableControlState = useTableControlState({
    tableName: "sboms",
    persistenceKeyPrefix: TablePersistenceKeyPrefixes.sboms,
    columnNames: {
      name: "Name",
      version: "Version",
      supplier: "Supplier",
      published: "Published",
      packages: "Packages",
      cves: "CVEs",
    },
    isSortEnabled: true,
    sortableColumns: ["published"],
    initialItemsPerPage: 10,
    isFilterEnabled: true,
    filterCategories: [
      {
        categoryKey: "",
        title: "Filter text",
        placeholderText: "Search",
        type: FilterType.search,
      },
    ],
  });

  const {
    result: { data: advisories, total: totalItemCount },
    isFetching,
    fetchError,
  } = useFetchSBOMs(
    getHubRequestParams({
      ...tableControlState,
      hubSortFieldKeys: {
        published: "published",
      },
    })
  );

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: "id",
    currentPageItems: advisories,
    totalItemCount,
    isLoading: isFetching,
    selectionState: useSelectionState({
      items: advisories,
      isEqual: (a, b) => a.id === b.id,
    }),
  });

  const {
    numRenderedColumns,
    currentPageItems,
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
    },
  } = tableControls;

  const { downloadSBOM } = useDownload();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">SBOMs</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          style={{
            backgroundColor: "var(--pf-v5-global--BackgroundColor--100)",
          }}
        >
          <Toolbar {...toolbarProps}>
            <ToolbarContent>
              <FilterToolbar showFiltersSideBySide {...filterToolbarProps} />
              <ToolbarItem {...paginationToolbarItemProps}>
                <SimplePagination
                  idPrefix="sboms-table"
                  isTop
                  paginationProps={paginationProps}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>

          <Table {...tableProps} aria-label="Sboms details table">
            <Thead>
              <Tr>
                <TableHeaderContentWithControls {...tableControls}>
                  <Th {...getThProps({ columnKey: "name" })} />
                  <Th {...getThProps({ columnKey: "version" })} />
                  <Th {...getThProps({ columnKey: "supplier" })} />
                  <Th {...getThProps({ columnKey: "published" })} />
                  <Th {...getThProps({ columnKey: "packages" })} />
                  <Th {...getThProps({ columnKey: "cves" })} />
                </TableHeaderContentWithControls>
              </Tr>
            </Thead>
            <ConditionalTableBody
              isLoading={isFetching}
              isError={!!fetchError}
              isNoData={totalItemCount === 0}
              numRenderedColumns={numRenderedColumns}
            >
              {currentPageItems.map((item) => {
                return (
                  <Tbody key={item.id}>
                    <Tr {...getTrProps({ item })}>
                      <Td width={20} {...getTdProps({ columnKey: "name" })}>
                        <NavLink to={`/sboms/${item.id}`}>{item.title}</NavLink>
                      </Td>
                      <Td
                        width={10}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "version" })}
                      >
                        {item.version}
                      </Td>
                      <Td
                        width={30}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "supplier" })}
                      >
                        {item.authors}
                      </Td>
                      <Td
                        width={10}
                        modifier="truncate"
                        {...getTdProps({ columnKey: "published" })}
                      >
                        {dayjs(item.published).format(RENDER_DATE_FORMAT)}
                      </Td>
                      <Td width={10} {...getTdProps({ columnKey: "packages" })}>
                        {/* {item.related_packages.count} */}
                      </Td>
                      <Td width={20} {...getTdProps({ columnKey: "cves" })}>
                        {/* <VulnerabilityGallery severities={item.related_cves} /> */}
                      </Td>
                    </Tr>
                  </Tbody>
                );
              })}
            </ConditionalTableBody>
          </Table>
          <SimplePagination
            idPrefix="sboms-apps-table"
            isTop={false}
            isCompact
            paginationProps={paginationProps}
          />
        </div>
      </PageSection>
    </>
  );
};
