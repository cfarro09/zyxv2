import { Box, Grid } from '@mui/material';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import React from 'react';

export const Product: React.FC = () => {
    return (
        <Box sx={{ flexGrow: 1 }} width={"100%"} margin={1}>
            <Grid container spacing={2}>
                <Grid item xs={4} >
                    <FieldEdit
                        label={"Producto"}
                        valueDefault={"22"}
                        variant="outlined"
                        // error={errors?.firstname?.message}
                        onChange={(value) => console.log(value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FieldEdit
                        label={"Descripcion"}
                        valueDefault={"22"}
                        variant="outlined"
                        // error={errors?.firstname?.message}
                        onChange={(value) => console.log(value)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FieldSelect
                        label={"Producto"}
                        variant="outlined"
                        valueDefault={"a"}
                        data={[{ option: "a" }, { option: "b" }]}
                        optionDesc="option"
                        optionValue="option"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
