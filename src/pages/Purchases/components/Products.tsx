import { IPurchase } from "@types";
import React from "react";
import { Control, useFieldArray } from "react-hook-form";

export const Products: React.FC<{ control: Control<IPurchase, object, IPurchase> }> = ({ control }) => {

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'products',
    });

    return (
        <div>
            holis
        </div>
    )
}