import { Grid, Typography } from "@mui/material";
import CustomDatePicker from "components/Controls/CustomDatePicker";
import React, { useEffect } from "react";
import type { Range } from "react-date-range";

export interface IFiltersReport {
    startdate: Date;
    enddate: Date;
}

export interface FiltersProps {
    filters: IFiltersReport;
    setFilters: React.Dispatch<React.SetStateAction<IFiltersReport>>;
    fetchData: () => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, fetchData }) => {
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
                    onlyDay={true}
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

export default Filters;
