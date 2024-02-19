import { Grid, Typography } from "@mui/material";
import { FieldSelect } from "components/Controls/FieldSelect";
import React from "react";
import { IDomainValue, InventoryFiltersProps } from "../models";

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({ dataAux, filters, loading, handleChange }) => {
    return (
        <Grid container flexDirection={'row'} gap={2} alignItems={'center'}>
            <Grid item>
                <Typography>Filtros</Typography>
            </Grid>
            <Grid item>
                <Grid className="w-52">
                    <FieldSelect
                        label={''}
                        variant="outlined"
                        valueDefault={filters.warehouse}
                        data={dataAux.listWarehouse}
                        disabled={loading}
                        onChange={(e) => handleChange(e as IDomainValue)}
                        optionDesc="domaindesc"
                        optionValue="domainvalue"
                        placeholder={'Almacen'}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
