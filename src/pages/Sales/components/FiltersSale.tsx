import { Grid, Typography } from "@mui/material";
import CustomDatePicker from "components/Controls/CustomDatePicker";
import React, { useEffect } from "react";
import type { Range } from "react-date-range";

export interface ISaleFilter {
    startdate: Date;
    enddate: Date;
}

export interface SaleFiltersProps {
    filters: ISaleFilter;
    setFilters: React.Dispatch<React.SetStateAction<ISaleFilter>>;
    fetchData: () => void;
}

const SaleFilters: React.FC<SaleFiltersProps> = ({ filters, setFilters, fetchData }) => {
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
            <Grid item xs={12} sm={6}>
                <CustomDatePicker
                    onChange={(newDate) => handleDateChange(newDate as Range)}
                    variant="outlined"
                    fullWidth
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

export default SaleFilters;
