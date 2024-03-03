import { Grid } from "@mui/material";
import { ISale } from "@types";
import FieldEdit from "components/Controls/FieldEdit";
import React from "react";
import { useFormContext } from "react-hook-form";

const HelpChangePayment: React.FC<{ toPay: number }> = ({ toPay }) => {
    const { setValue: setValueForm } = useFormContext<ISale>()
    const [value, setvalue] = React.useState<number | null>(null);

    if (!(toPay > 0))
        return null;


    return (
        <Grid container alignItems={"center"} spacing={2}>
            <Grid item xs={6} sm={3}>
                <FieldEdit
                    label={"Si paga con"}
                    type='number'
                    value={value || ""}
                    onChange={v => {
                        setvalue(v ? parseFloat(v) : null);
                        setValueForm('moneyFromCustomer', parseFloat(v || "0"));
                    }}
                />
            </Grid>
            <Grid item xs={6} sm={6} alignItems={"center"}>
                Vuelto:
                {(value ?? 0) > 0 && <span className='font-bold pl-2'>{((value || 0) - toPay).toFixed(2)}</span>}
                {value === 0 && <span> -</span>}
            </Grid>
        </Grid>
    )
}

export default HelpChangePayment