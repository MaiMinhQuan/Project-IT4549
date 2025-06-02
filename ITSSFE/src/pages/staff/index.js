import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Download01Icon from "@untitled-ui/icons-react/build/esm/Download01";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import { Box, Button, Card, Container, Dialog, Stack, SvgIcon, Typography } from "@mui/material";
import staffApi from "src/api/staff";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EmployeeListSearch } from "src/sections/employee/employee-list-search";
import { EmployeeListTable } from "src/sections/employee/employee-list-table";
import { EmployeeEditForm } from "src/sections/employee/employee-edit-form";
import { EmployeeCreateForm } from "src/sections/employee/employee-create-form.js";

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      role: undefined,
    },
    page: 0,
    rowsPerPage: 25,
    sortBy: "updatedAt",
    sortDir: "desc",
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useStaff = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    staff: [],
    staffCount: 0,
  });

  const getStaff = useCallback(async () => {
    try {
      const response = await staffApi.getStaff(search);

      if (isMounted()) {
        setState({
          staff: response.data,
          staffCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, isMounted]);

  const deleteStaff = useCallback(
    async (staffId) => {
      try {
        await staffApi.deleteStaffById(staffId);
        getStaff();
      } catch (err) {
        console.error(err);
      }
    },
    [getStaff]
  );

  useEffect(() => {
    getStaff();
  }, [search]);

  return {
    state,
    deleteStaff,
  };
};

const Page = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const { search, updateSearch } = useSearch();
  const { state, deleteStaff } = useStaff(search);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");

  usePageView();

  const handleFiltersChange = useCallback(
    (filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
      }));
    },
    [updateSearch]
  );

  const handleSortChange = useCallback(
    (sort) => {
      updateSearch((prevState) => ({
        ...prevState,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir,
      }));
    },
    [updateSearch]
  );

  const handlePageChange = useCallback(
    (event, page) => {
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [updateSearch]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10),
      }));
    },
    [updateSearch]
  );

  const handleDeleteStaff = (staffId) => {
    deleteStaff(staffId);
  };

  const onCloseModel = () => {
    setOpenModal(false);
  };

  const onCloseModelCreate = () => {
    setOpenModalCreate(false);
  };

  return (
    <>
      <Head>
        <title>Nhân viên | EliteGym System</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Nhân viên</Typography>
                {/* <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={
                      <SvgIcon>
                        <Upload01Icon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={
                      <SvgIcon>
                        <Download01Icon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack> */}
              </Stack>
              <Stack alignItems="center" direction="row" spacing={3}>
                <Button
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => {
                    setOpenModalCreate(true);
                  }}
                >
                  Thêm mới
                </Button>
              </Stack>
            </Stack>
            <Card>
              <EmployeeListSearch
                onFiltersChange={handleFiltersChange}
                onSortChange={handleSortChange}
                sortBy={search.sortBy}
                sortDir={search.sortDir}
                setQuery={setQuery}
                setRole={setRole}
              />
              {state.staff && (
                <EmployeeListTable
                  staff={state.staff}
                  staffCount={state.staffCount}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPage={search.rowsPerPage}
                  page={search.page}
                  handleDeleteEmployee={handleDeleteStaff}
                  query={query}
                  role={role}
                />
              )}
            </Card>
          </Stack>

          <Dialog open={openModal} onClose={onCloseModel}>
            <EmployeeEditForm onClose={onCloseModel}></EmployeeEditForm>
          </Dialog>
          <Dialog open={openModalCreate} onClose={onCloseModelCreate}>
            <EmployeeCreateForm onClose={onCloseModelCreate}></EmployeeCreateForm>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
