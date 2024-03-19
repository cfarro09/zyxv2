/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Rating, Typography } from '@mui/material';
import { IMainProps, ObjectZyx } from '@types';
import { getProductSel, getValuesFromDomain, productIns } from 'common/helpers';
import DropZone from 'components/Controls/DropZone';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { IProduct } from '../models';
import { useSendFormApi } from 'hooks/useSendFormApi';
import { useMultiData } from 'hooks/useMultiData';
import { useSelector } from 'hooks';

interface IDataAux {
    listStatus: ObjectZyx[];
    listUnidad: ObjectZyx[];
    listCategory: ObjectZyx[];
}

export const ManageProduct: React.FC<IMainProps & { newTitle?: string, setNewProduct?: React.Dispatch<React.SetStateAction<IProduct>> }> = ({ baseUrl, onlyForm, newTitle = '', callback, setNewProduct }) => {
    const navigate = useNavigate();
    const [dataAux, setDataAux] = useState<IDataAux>({ listStatus: [], listCategory: [], listUnidad: [] });
    const [formData, setFormData] = useState<IProduct | null>(null);
    const { id } = useParams<{ id?: string }>();
    const role = useSelector(state => state.login?.validateToken?.user?.rolename);

    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: (data) => {
            if (!onlyForm) {
                navigate(baseUrl + window.location.search);
            }
            callback && callback();
            setNewProduct && setNewProduct({ ...formData, productid: data?.[0]?.vproductid || 0 } as IProduct)
        }
    });
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<IProduct>({
        defaultValues: {
            productid: 0,
            code: '',
            barcode: '',
            purchase_price: 0,
            title: newTitle || '',
            description: '',
            image: '',
            selling_price: 0,
            unit: '',
            color: '',
            status: 'ACTIVO',
            category: '',
        }
    });

    const { giveMeData, loading } = useMultiData<IProduct, IDataAux>({
        registerX: () => {
            register('productid');
            register('title', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('code', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        },
        reset,
        setDataAux,
        collections: [
            ...((id !== 'new' && !onlyForm) ? [{
                rb: getProductSel(parseInt(`${id}`)),
                key: 'UFN_PRODUCT_SEL',
                keyData: "",
                main: true,
            }] : []),
            { rb: getValuesFromDomain('CATEGORIA'), key: 'UFN_DOMAIN_VALUES_SEL-CATEGORIA', keyData: "listCategory" },
            { rb: getValuesFromDomain('UNIDAD'), key: 'UFN_DOMAIN_VALUES_SEL-UNIDAD', keyData: "listUnidad" },
            { rb: getValuesFromDomain('ESTADO'), key: 'UFN_DOMAIN_VALUES_SEL-ESTADO', keyData: "listStatus" },
        ],
    });

    const onSubmit = handleSubmit((data) => {
        setFormData(data)
        onSubmitData(productIns({
            ...data,
            operation: data.productid > 0 ? "UPDATE" : "INSERT"
        }))
    });

    const handleFileUpload = (fileUrl: string) => {
        setValue('image', fileUrl);
    };

    useEffect(() => {
        giveMeData();
    }, []);

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            {!onlyForm &&
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textPrimary" to={baseUrl + window.location.search}>
                            <Typography color="secondary" fontWeight={500}>Productos</Typography>
                        </Link>
                        <Typography color="textSecondary">Detalle</Typography>
                    </Breadcrumbs>
                </div>
            }
            <Paper className="w-full" sx={{ marginTop: 0, marginBottom: 2 }} elevation={onlyForm ? 0 : 1}>
                <Grid container className="px-6 py-3 border-b">
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5">{(id === 'new' || onlyForm) ? 'Nuevo Producto' : 'Modificar Producto'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} container justifyContent={'flex-end'} gap={2}>
                        <Button color="primary" type="submit" variant="contained" onClick={onSubmit} disabled={loading}>
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
                <Grid container component={'form'} spacing={2} padding={2} sx={{ flexDirection: { xs: "column-reverse", md: "row", lg: "row" } }}>
                    <Grid item sm={12} md={8} lg={onlyForm ? 12 : 8}>
                        <Grid container gap={2}>
                            <Grid item xs={12} display={'flex'} alignItems={'end'} gap={2}>
                                <Rating name="customized-10" defaultValue={1} max={1} size="large" />
                                <Grid item sx={{ width: '100%' }}>
                                    <FieldEdit
                                        label={'Nombre del producto'}
                                        valueDefault={getValues('title')}
                                        onChange={(value) => setValue('title', `${value}`)}
                                        error={errors.title?.message}
                                        variant="standard"
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: 3 }}>
                                <Typography fontSize={16} variant="h5">
                                    Informacion del producto
                                </Typography>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FieldEdit
                                        label={'Descripcion'}
                                        valueDefault={getValues('description')}
                                        onChange={(value) => setValue('description', `${value}`)}
                                        error={errors.description?.message}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FieldEdit
                                        label={'Código'}
                                        valueDefault={getValues('code')}
                                        onChange={(value) => setValue('code', `${value}`)}
                                        error={errors.code?.message}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FieldEdit
                                        label={'Cod. Barra'}
                                        valueDefault={getValues('barcode')}
                                        onChange={(value) => setValue('barcode', `${value}`)}
                                        error={errors.barcode?.message}
                                        variant="outlined"
                                    />
                                </Grid>
                                {role === "SUPERADMIN" && (
                                    <Grid item xs={12} sm={6}>
                                        <FieldEdit
                                            label={'Precio compra'}
                                            valueDefault={getValues('purchase_price')}
                                            onChange={(value) => setValue('purchase_price', parseFloat(value || "0.0"))}
                                            error={errors.purchase_price?.message}
                                            variant="outlined"
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <FieldEdit
                                        label={'Precio venta'}
                                        valueDefault={getValues('selling_price')}
                                        onChange={(value) => setValue('selling_price', parseFloat(value || "0.0"))}
                                        error={errors.selling_price?.message}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FieldSelect
                                        label={'Unidad'}
                                        variant="outlined"
                                        valueDefault={getValues('unit')}
                                        onChange={(value) => setValue('unit', value?.domainvalue as string ?? "")}
                                        error={errors.unit?.message}
                                        loading={loading}
                                        data={dataAux.listUnidad}
                                        optionDesc="domainvalue"
                                        optionValue="domainvalue"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FieldEdit
                                        label={'Color'}
                                        valueDefault={getValues('color')}
                                        onChange={(value) => setValue('color', `${value}`)}
                                        error={errors.color?.message}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FieldSelect
                                        label={'Estado'}
                                        variant="outlined"
                                        valueDefault={getValues('status')}
                                        onChange={(value) => setValue('status', value?.domainvalue as string ?? "")}
                                        error={errors.status?.message}
                                        loading={loading}
                                        data={dataAux.listStatus}
                                        optionDesc="domainvalue"
                                        optionValue="domainvalue"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FieldSelect
                                        label={'Categoria'}
                                        variant="outlined"
                                        valueDefault={getValues('category')}
                                        onChange={(value) => setValue('category', value?.domainvalue as string ?? "")}
                                        error={errors.category?.message}
                                        loading={loading}
                                        data={dataAux.listCategory}
                                        optionDesc="domainvalue"
                                        optionValue="domainvalue"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {!onlyForm &&
                        <Grid item justifyContent={"center"} lg={4} md={4} sm={12}>
                            <Box className="px-6 py-6 mb-4 flex">
                                <DropZone url={getValues('image')} onFileUpload={handleFileUpload} takePhoto={true} />
                            </Box>
                        </Grid>
                    }
                </Grid>
            </Paper>
        </Box>
    );
};

