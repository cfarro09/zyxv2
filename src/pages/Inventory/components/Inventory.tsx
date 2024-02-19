import { Box, Button, Paper, Typography } from "@mui/material";
import type { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { IDataAux, IDomainValue, IInventory, IInventoryFilters } from "../models";
import { useDispatch, useSelector } from "react-redux";
import { getCollection } from "stores/main/actions";
import { getInventorySel, getValuesFromDomain } from "common/helpers";
import { IRootState } from "stores";
import TableSimple from "components/Controls/TableSimple";
import dayjs from "dayjs";
import { useMultiData } from "hooks/useMultiData";
import { InventoryFilters } from "./InventoryFilters";
import InventoryDialogUpload from "./InventoryDialogUpload";
import { FileUpload } from "@mui/icons-material";

const columns: ColumnDef<IInventory>[] = [
  {
    header: 'title',
    accessorKey: 'title'
  },
  {
    header: 'code',
    accessorKey: 'code'
  },
  {
    header: 'stock',
    accessorKey: 'stock'
  },
  {
    header: 'warehouse',
    accessorKey: 'warehouse'
  },
  {
    header: 'FECHA CREACION',
    accessorFn: (row: IInventory) => dayjs(row.changedate).format('DD/MM/YYYY'),
  },
]

export const Inventory: React.FC<unknown> = () => {
  const dispatch = useDispatch();
  const mainResult = useSelector((state: IRootState) => state.main.mainData);
  const [mainData, setMainData] = useState<IInventory[]>([]);
  const [dataAux, setDataAux] = useState<IDataAux>({ listWarehouse: [] });
  const [filters, setFilters] = useState<IInventoryFilters>({ warehouse: '' })
  const [openImportDialog, setOpenImportDialog] = React.useState(true);

  const handleClickOpen = () => {
    setOpenImportDialog(true);
  };

  const handleDialogClose = () => {
    setOpenImportDialog(false);
  };

  const fetchData = () => {
    dispatch(getCollection(getInventorySel({ ...filters })))
  }

  const { giveMeData, loading } = useMultiData<IInventory, IDataAux>({
    setDataAux,
    collections: [
      { rb: getValuesFromDomain('ALMACEN'), key: 'UFN_DOMAIN_VALUES_SEL-ALMACEN', keyData: "listWarehouse" },
    ],
  })

  useEffect(() => {
    fetchData()
    giveMeData();
  }, []);

  useEffect(() => {
    if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_INVENTORY_SEL') {
      setMainData((mainResult.data as IInventory[]) || []);
    }
  }, [mainResult]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  // const deleteRow = (user: IInventory) => onSubmitData(userIns({ ...user, password: "", operation: "DELETE" }))

  const handleChange = (newValue: IDomainValue) => {
    setFilters({ ...filters, warehouse: newValue?.domainvalue || '' })
  }

  return (
    <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
      <Paper className="w-full mt-6">
        <Box className="px-6 py-3 border-b">
          <Typography variant="h5">Inventario</Typography>
        </Box>
        <Box sx={{ '& .MuiTableBody-root .MuiTableCell-root': { padding: '0 16px' } }}>
          <TableSimple
            loading={mainResult.loading}
            data={mainData}
            showOptions={true}
            addButton={true}
            columns={columns}
            redirectOnSelect={true}
            columnKey={"inventoryid"}
            filterElement={
              <InventoryFilters
                dataAux={dataAux}
                filters={filters}
                loading={loading}
                handleChange={handleChange}
              />
            }
            buttonElement={
              <>
                <Button
                  className={"bg-light-grey px-4 text-grey flex gap-2"}
                  onClick={() => setOpenImportDialog(true)}>
                  <FileUpload fontSize="small" /> Importar
                </Button>
              </>
            }
          />
        </Box>
      </Paper>
      <InventoryDialogUpload open={openImportDialog} handleClose={handleDialogClose} />
    </Box>
  );
};
