import { Popover, Typography, Button, Grid, } from "@mui/material";
import type { ButtonProps } from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { DateRangePicker, Range } from 'react-date-range';
import { CalendarMonth } from "@mui/icons-material";
import dayjs from "dayjs";
import { es } from 'date-fns/locale';

type InputProps = {
    initialRange: Range[];
    onChange?: (_?: Range | null) => number | string | void | null;
    onlyDay?: boolean;
} & Omit<ButtonProps, 'error' | "onChange">;

const CustomDatePicker: React.FC<InputProps> = ({ initialRange, onChange, onlyDay = false }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const [range, setRange] = useState<Range[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        onChange && onChange(range[0])
        setAnchorEl(null);
    };

    useEffect(() => {
        setRange(initialRange as Range[]);
    }, [initialRange])

    return (
        <>
            <Button
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
                sx={{
                    textTransform: 'none',
                    background: 'transparent',
                    color: '#5b5b5b',
                    boxShadow: 'none',
                    borderRadius: '4px',
                    border: '1px solid #c4c4c4',
                    padding: '9px',
                    '&:hover': {
                        background: '#f5f5f5',
                        border: '1px solid #c4c4c4',
                        boxShadow: 'none'
                    }
                }}
            >
                <Grid container gap={1} flexWrap={'nowrap'} alignItems={'bottom'}>
                    <CalendarMonth fontSize="small" />
                    <Typography fontSize={14}>{dayjs(range[0].startDate).format('DD/MM/YYYY')} - {dayjs(range[0].endDate).format('DD/MM/YYYY')}</Typography>
                </Grid>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{ '& .rdrInputRangeInput': { background: 'white' } }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Grid container flexDirection={'column'}>
                    <DateRangePicker
                        editableDateInputs={true}
                        locale={es}
                        onChange={(ranges) => {
                            const { startDate, endDate } = ranges.selection;
                            if (onlyDay) {
                                if (startDate === endDate) {
                                    setRange([ranges.selection]);
                                } else {
                                    setRange([{ ...ranges.selection, endDate: startDate }]);
                                }
                            } else {
                                setRange([ranges.selection]);
                            }

                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        months={1}
                    />
                    <Grid item container flexDirection={'row-reverse'} mb={1} pr={4}>
                        <Button color={'primary'} onClick={handleClose}>Aceptar</Button>
                    </Grid>
                </Grid>
            </Popover>
        </>
    )
};

export default CustomDatePicker;
