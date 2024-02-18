import { Box, Breadcrumbs, Button, Grid, Paper, Rating, Typography } from '@mui/material';
import { ObjectZyx } from '@types';
import { getProductSel, getValuesFromDomain, productIns } from 'common/helpers';
import DropZone from 'components/Controls/DropZone';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IRootState } from 'stores';
import { execute, getMultiCollection, resetMultiMain } from 'stores/main/actions';
import { IProduct } from '../models';
import { manageConfirmation, showBackdrop, showSnackbar } from 'stores/popus/actions';
import paths from 'common/constants/paths';

interface IDataAux {
    listStatus: ObjectZyx[];
    listCategory: ObjectZyx[];
}

const ManageProduct: React.FC<unknown> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const multiResult = useSelector((state: IRootState) => state.main.multiData);
    const [dataAux, setDataAux] = useState<IDataAux>({ listStatus: [], listCategory: [] });
    const executeResult = useSelector((state: IRootState) => state.main.execute);
    const { id } = useParams<{ id?: string }>();
    const [waitSave, setWaitSave] = useState(false);

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
            title: '',
            description: '',
            image: '',
            selling_price: 0,
            unit: '',
            color: '',
            status: 'ACTIVO',
            category: '',
        }
    });

    const registerX = () => {
        register('productid');
        register('title', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
    };


    useEffect(() => {
        registerX();
        dispatch(
            getMultiCollection([
                ...(id !== 'new' ? [getProductSel(parseInt(`${id}`))] : []),
                getValuesFromDomain('ESTADO'),
                getValuesFromDomain('UNIDAD'),
            ]),
        );

    }, [dispatch, register, id]);

    useEffect(() => {
        if (!multiResult.loading && !multiResult.error) {
            const rows = multiResult.data.find((f) => f.key === `UFN_PRODUCT_SEL`)?.data ?? [];
            if (rows.length > 0) {
                reset(rows[0]);
            }
            registerX()
            const listStatus = multiResult.data.find((f) => f.key === `UFN_DOMAIN_VALUES_SEL-ESTADO`)?.data ?? [];
            const listCategory = multiResult.data.find((f) => f.key === `UFN_DOMAIN_VALUES_SEL-CATEGORIA`)?.data ?? [];
            setDataAux({ listStatus, listCategory });
        }
    }, [multiResult]);

    useEffect(() => {
        return () => {
            dispatch(resetMultiMain())
        }
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showBackdrop(false));
                dispatch(showSnackbar({ show: true, severity: "success", message: `Guardado satisfactoriamente.` }));
                navigate(paths.PRODUCTS)
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: `${executeResult.code}` }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [navigate, executeResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(productIns({
                ...data,
                operation: data.productid > 0 ? "UPDATE" : "INSERT"
            })));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: "¿Está seguro de continuar?",
            callback
        }))
    });

    const handleFileUpload = (fileUrl: string) => {
        console.log({ fileUrl })
        setValue('image', fileUrl);
    };

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textPrimary" to="/products/">
                            Productos
                        </Link>
                        <Typography color="textSecondary">Detalle</Typography>
                    </Breadcrumbs>
                </div>
                <Paper className="w-full" sx={{ marginTop: 0, marginBottom: 2 }}>
                    <Grid container className="px-6 py-3 border-b">
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5">{id === '0' ? 'Nuevo Producto' : 'Modificar Producto'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} container justifyContent={'flex-end'} gap={2}>
                            <Button color="primary" type="submit" variant="contained" onClick={onSubmit}>
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container component={'form'} spacing={2} padding={2} sx={{ pb: 4, pl: 4 }} wrap='nowrap'>
                        <Grid item sm={12} md={12} lg={8}>
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
                                <Grid container xs={12} spacing={2}>
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
                                    <Grid item xs={12} sm={6}>
                                        <FieldEdit
                                            label={'Precio compra'}
                                            valueDefault={getValues('purchase_price')}
                                            onChange={() => setValue('purchase_price', 0)}
                                            error={errors.purchase_price?.message}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FieldEdit
                                            label={'Precio venta'}
                                            valueDefault={getValues('selling_price')}
                                            onChange={() => setValue('selling_price', 0)}
                                            error={errors.selling_price?.message}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FieldEdit
                                            label={'Unidad'}
                                            valueDefault={getValues('unit')}
                                            onChange={(value) => setValue('unit', `${value}`)}
                                            error={errors.unit?.message}
                                            variant="outlined"
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
                                            onChange={(value) => setValue('status', `${value?.domainvalue}`)}
                                            error={errors.status?.message}
                                            loading={multiResult.loading}
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
                                            onChange={(value) => setValue('category', `${value?.domainvalue}`)}
                                            error={errors.category?.message}
                                            loading={multiResult.loading}
                                            data={dataAux.listCategory}
                                            optionDesc="domainvalue"
                                            optionValue="domainvalue"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs sx={{ display: { xs: 'none', md: 'none', lg: 'flex' }, justifyContent: 'center' }}>
                            <Box className="px-6 py-6 mb-4 flex">
                                <DropZone url={getValues('image')} onFileUpload={handleFileUpload} />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </>
    );
};

export default ManageProduct;
