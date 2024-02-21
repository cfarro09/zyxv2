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
import MoveUpIcon from '@mui/icons-material/MoveUp';
import InventoryDialogTransfer from "./InventoryDialogTransfer";

const columns: ColumnDef<IInventory>[] = [
	{
		header: 'PRODUCTO',
		accessorKey: 'title'
	},
	{
		header: 'CÓDIGO',
		accessorKey: 'code'
	},
	{
		header: 'STOCK',
		accessorKey: 'stock'
	},
	{
		header: 'ALMACEN',
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
	const [openImportDialog, setOpenImportDialog] = React.useState(false);
	const [openTransferDialog, setOpenTransferDialog] = React.useState(false);
	const [keysSelected, setKeysSelected] = React.useState({});
	const [rowsSelected, setRowsSelected] = useState<IInventory[]>([])

	const handleDialogClose = () => setOpenImportDialog(false)

	const fetchData = () => {
		setKeysSelected({});
		dispatch(getCollection(getInventorySel({ ...filters })));
	}

	const { giveMeData, loading } = useMultiData<IInventory, IDataAux>({
		setDataAux,
		collections: [
			{ rb: getValuesFromDomain('ALMACEN'), key: 'UFN_DOMAIN_VALUES_SEL-ALMACEN', keyData: "listWarehouse" },
		],
	})

	useEffect(() => {
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

	const handleChange = (newValue: IDomainValue) => {
		setFilters({ ...filters, warehouse: newValue?.domainvalue || '' })
	}

	const handlerOpenTransferDialog = () => {
		console.log("mainData.filter(x => Object.keys(keysSelected).includes(`${x.inventoryid}`))", mainData.filter(x => Object.keys(keysSelected).includes(`${x.inventoryid}`)))
		setRowsSelected(mainData.filter(x => Object.keys(keysSelected).includes(`${x.inventoryid}`)));
		setOpenTransferDialog(true)
	}

	console.log("keysSelected", rowsSelected)

	return (
		<Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
			<Paper className="w-full mt-6">
				<Box className="px-6 py-3 border-b">
					<Typography variant="h5">Inventario</Typography>
				</Box>
				<Box >
					<TableSimple
						loading={mainResult.loading}
						data={mainData}
						showOptions={false}
						columns={columns}
						redirectOnSelect={true}
						columnKey={"inventoryid"}
						selection={true}
						rowsSelected={keysSelected}
						setRowsSelected={setKeysSelected}
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
									onClick={() => setOpenImportDialog(true)}
									variant="outlined"
								>
									<FileUpload fontSize="small" /> Importar
								</Button>
								<Button
									onClick={handlerOpenTransferDialog}
									variant="outlined"
									disabled={Object.keys(keysSelected).length === 0 || !filters.warehouse}
								>
									<MoveUpIcon fontSize="small" /> Transferir
								</Button>
							</>
						}
					/>
				</Box>
			</Paper>
			<InventoryDialogUpload
				open={openImportDialog}
				handleClose={handleDialogClose}
				fetchData={fetchData}
			/>
			<InventoryDialogTransfer
				open={openTransferDialog}
				setOpenDialog={setOpenTransferDialog}
				listWarehouse={dataAux.listWarehouse}
				warehouseSelected={filters.warehouse}
				products={rowsSelected}
				fetchData={fetchData}
			/>
		</Box>
	);
};