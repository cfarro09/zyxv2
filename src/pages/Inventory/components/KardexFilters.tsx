import { Grid, Typography } from "@mui/material";
import CustomDatePicker from "components/Controls/CustomDatePicker";
import React, { useEffect } from "react";
import type { Range } from "react-date-range";
import { KardexFiltersProps } from "../models";


const KardexFilters: React.FC<KardexFiltersProps> = ({ filters, setFilters, fetchData }) => {
    useEffect(() => {
        fetchData()
    }, [filters])

    const handleDateChange = ({ startDate, endDate }: Range) => {
        setFilters({ ...filters, startdate: (startDate as Date), enddate: (endDate as Date) })
    }

    return (
        <Grid container flexDirection={'row'} gap={2} alignItems={'center'}>
            <Grid item>
                <Typography>Filtros</Typography>
            </Grid>
            <Grid item xs={4}>
                <CustomDatePicker
                    onChange={(newDate) => handleDateChange(newDate as Range)}
                    variant="outlined"
                    initialRange={[
                        {
                            startDate: filters.startdate,
                            endDate: filters.enddate,
                            key: 'selection'
                        }
                    ]}
                />
            </Grid>
        </Grid>
    );
};

export default KardexFilters;
