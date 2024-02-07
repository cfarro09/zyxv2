import { DashboardTemplateSave, Dictionary, IChannel, IChatWebAdd, ICrmLead, ICrmLeadActivitySave, ICrmLeadHistoryIns, ICrmLeadNoteSave, ICrmLeadSel, ICrmLeadTagsSave, ILead, IPerson, IRequestBody, IRequestBodyPaginated, ISDLeadSel, IServiceDeskLead, IServiceDeskLead2 } from '@types';
import { uuidv4 } from '.';


export const getdashboardoperativoEncuesta3Sel = ({ startdate, enddate, channel, group, company, label, question, closedby, target, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA3_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA3_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, question, closedby, target: target / 100,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoEncuestaSel = ({ startdate, enddate, channel, group, company, label, supervisor }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, closedby: "",
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoEncuesta3Seldata = ({ startdate, enddate, channel, group, company, label, supervisor, question }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA3_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA3_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, question, closedby: "ASESOR,BOT", target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});
export const getdashboardoperativoEncuesta2Seldata = ({ startdate, enddate, channel, group, company, label, supervisor, question }: Dictionary): IRequestBody => ({
    method: 'UFN_DASHBOARD_OPERATIVO_ENCUESTA2_DATA_SEL',
    key: "UFN_DASHBOARD_OPERATIVO_ENCUESTA2_DATA_SEL",
    parameters: {
        startdate, enddate, channel, group, company, label, question, closedby: "ASESOR,BOT", target: 0,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        supervisorid: supervisor
    }
});

export const getPropertySelByName = (propertyname: string, key = ""): IRequestBody => ({
    method: 'UFN_PROPERTY_SELBYNAME',
    key: `UFN_PROPERTY_SELBYNAME${key}`,
    parameters: {
        propertyname
    }
});

export const getPropertySelByNameOrg = (propertyname: string, orgid: number, key: string): IRequestBody => ({
    method: 'UFN_PROPERTY_SELBYNAME',
    key: "UFN_PROPERTY_SELBYNAME" + key,
    parameters: {
        propertyname, orgid
    }
});

export const getConversationClassification2 = (conversationid: number): IRequestBody => ({
    method: 'UFN_CONVERSATIONCLASSIFICATION_SEL2',
    key: "UFN_CONVERSATIONCLASSIFICATION_SEL2",
    parameters: {
        conversationid
    }
});

export const getAttachmentsByPerson = (personid: number): IRequestBody => ({
    method: 'QUERY_SELECT_ATTACHMENT',
    key: "QUERY_SELECT_ATTACHMENT",
    parameters: {
        personid
    }
});

export const getLeadsByUserPerson = (personid: number): IRequestBody => ({
    method: 'QUERY_SELECT_LEADS_BY_USER_PERSON',
    key: "QUERY_SELECT_LEADS_BY_USER_PERSON",
    parameters: {
        personid
    }
});

/// Settings tab (drawer)
export const getPropertyConfigurationsBody = (): IRequestBody[] => ([
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'MAXIMONUMEROTICKETS' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONASESOR' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONADMINISTRADOR' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'CIERREAUTOMATICO' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONSESIONSUPERVISOR' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'ACCIONFUERAHORARIO' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'EXPIRACIONENCUESTA' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'WAITINGMESSAGE' },
    },
    {
        method: "UFN_PROPERTY_SELBYNAME",
        parameters: { propertyname: 'WAITINGREPETITIVEMESSAGE' },
    },
]);

export const insPersonBody = (person: Dictionary): IRequestBody => ({
    method: 'UFN_PERSON_INS',
    parameters: {
        ...person,
        corpid: null,
        orgid: null,
        phone: person?.phone?.replaceAll('+', ''),
        district: person.district || "",
        observation: person.observation || '',
    },
});

export const insPersonCommunicationChannel = (pcc: Dictionary): IRequestBody => ({
    method: 'UFN_PERSONCOMMUNICATIONCHANNEL_INS',
    parameters: {
        ...pcc,
        corpid: null,
        type: pcc.type || "VOXI",
        orgid: null,
    },
});
export const personInsValidation = ({ id, phone, email, alternativephone, alternativeemail, operation }: Dictionary): IRequestBody => ({
    method: 'UFN_PERSON_INS_VALIDATION',
    parameters: {
        id,
        phone: phone?.replaceAll('+', '') || "",
        email,
        alternativephone: alternativephone?.replaceAll('+', '') || "",
        alternativeemail,
        operation
    },
});
export const personImportValidation = ({ table }: Dictionary): IRequestBody => ({
    method: 'UFN_PERSON_IMPORT_VALIDATION',
    parameters: {
        table
    },
});

export const editPersonBody = (person: IPerson): IRequestBody => ({
    method: 'UFN_PERSON_PCC_INS',
    parameters: {
        ...person,
        alternativephone: person?.alternativephone?.replaceAll('+', '') || "",
        id: person.personid,
        operation: person.personid ? 'UPDATE' : 'INSERT',
        observation: person.observation || '',
        phone: person?.phone?.replaceAll('+', '') || "",
    },
});

// export const insLead = (lead: ILead, operation: string): IRequestBody => ({
//     method: 'UFN_LEAD_INS',
//     parameters: {
//         ...lead,
//         id: lead.leadid,
//         operation
//     },
// });

export const insLeadPerson = (lead: ILead, firstname: string, lastname: string, email: string, phone: string, personid: number, persontype: string): IRequestBody => ({
    method: 'UFN_LEAD_PERSON_INS',
    parameters: {
        ...lead,
        id: lead.leadid,
        firstname,
        lastname,
        email,
        phone,
        personid,
        persontype
    },
});
export const getColumnsSel = (id: number, lost: boolean = false): IRequestBody => ({
    method: "UFN_COLUMN_SEL",
    key: "UFN_COLUMN_SEL",
    parameters: {
        id: id,
        all: true,
        lost
    }
})
export const getColumnsSDSel = (id: number, lost: boolean = false): IRequestBody => ({
    method: "UFN_COLUMN_SD_SEL",
    key: "UFN_COLUMN_SD_SEL",
    parameters: {
        id: id,
        all: true,
        lost: false
    }
})

export const getLeadsSel = (params: ICrmLeadSel): IRequestBody => ({
    method: "UFN_LEAD_SEL",
    key: "UFN_LEAD_SEL",
    parameters: {
        ...params,
        all: params.id === 0,
    }
})

export const getLeadsSDSel = (params: ISDLeadSel): IRequestBody => ({
    method: "UFN_LEAD_SD_SEL",
    key: "UFN_LEAD_SD_SEL",
    parameters: {
        ...params,
        all: params.id === 0,
    }
})
export const getAutomatizationRulesSel = ({ id, communicationchannelid }: Dictionary): IRequestBody => ({
    method: "UFN_LEADAUTOMATIZATIONRULES_SEL",
    key: "UFN_LEADAUTOMATIZATIONRULES_SEL",
    parameters: {
        id,
        communicationchannelid,
        all: id === 0
    }
})
export const getOrderColumns = ({ id = 0 }: Dictionary): IRequestBody => ({
    method: "UFN_COLUMN_ORDER_SEL",
    key: "UFN_COLUMN_ORDER_SEL",
    parameters: {
        id,
        all: id === 0
    }
})

export const insAutomatizationRules = ({ id, description, status, type, columnid, order, orderstatus, communicationchannelid, messagetemplateid, messagetemplateparameters, shippingtype, xdays, schedule, tags, products, operation }: Dictionary): IRequestBody => ({
    method: 'UFN_LEADAUTOMATIZATIONRULES_INS',
    key: "UFN_LEADAUTOMATIZATIONRULES_INS",
    parameters: {
        id,
        description,
        status,
        type,
        columnid,
        order,
        communicationchannelid,
        messagetemplateid,
        messagetemplateparameters,
        shippingtype,
        xdays,
        schedule,
        orderstatus,
        tags,
        products,
        operation,
    }
});
export const insColumns = ({ id, description, type, status, edit = true, index, operation, delete_all = false }: Dictionary): IRequestBody => ({
    method: 'UFN_COLUMN_INS',
    key: "UFN_COLUMN_INS",
    parameters: {
        id,
        description,
        type,
        status,
        edit,
        index,
        operation,
        delete_all
    }
});

export const updateColumnsLeads = ({ cards_startingcolumn, cards_finalcolumn, startingcolumn_uuid, finalcolumn_uuid, leadid = null }: Dictionary): IRequestBody => ({
    method: 'UFN_UPDATE_LEADS',
    key: "UFN_UPDATE_LEADS",
    parameters: {
        cards_startingcolumn,
        cards_finalcolumn,
        startingcolumn_uuid,
        finalcolumn_uuid,
        leadid
    }
});
export const updateOrderStatus = ({ orderid, orderstatus }: Dictionary): IRequestBody => ({
    method: 'UFN_CHANGE_ORDERSTATUS',
    key: "UFN_CHANGE_ORDERSTATUS",
    parameters: {
        orderid,
        orderstatus,
    }
});

export const updateColumnsOrder = ({ columns_uuid }: Dictionary): IRequestBody => ({
    method: 'UFN_UPDATE_COLUMNS',
    key: "UFN_UPDATE_COLUMNS",
    parameters: {
        cards_uuid: columns_uuid,
    }
});

export const insLead = ({ leadid, description, status, type, expected_revenue, date_deadline, tags, personcommunicationchannel, priority, conversationid, columnid, column_uuid, index, operation, phone, email, phase }: Dictionary): IRequestBody => ({
    method: 'UFN_LEAD_INS',
    key: "UFN_LEAD_INS",
    parameters: {
        leadid,
        description,
        status,
        type,
        expected_revenue,
        date_deadline,
        tags,
        personcommunicationchannel,
        priority,
        conversationid,
        columnid,
        column_uuid,
        index,
        phone,
        email,
        phase,
        operation
    }
});

export const insSDLead = (lead: IServiceDeskLead2 | IServiceDeskLead, operation: "UPDATE" | "INSERT" | "DELETE" = "INSERT"): IRequestBody => ({
    method: 'UFN_LEAD_SD_INS',
    key: "UFN_LEAD_SD_INS",
    parameters: {
        ...lead,
        id: lead.leadid,
        username: null,
        operation,
    }
});

export const insLead2 = (lead: ICrmLead, operation: "UPDATE" | "INSERT" | "DELETE" = "INSERT"): IRequestBody => ({
    method: 'UFN_LEAD_INS',
    key: "UFN_LEAD_INS",
    parameters: {
        ...lead,
        id: lead.leadid,
        username: null,
        operation,
    },
});

export const getOneLeadSel = (id: string | number): IRequestBody => ({
    method: "UFN_LEAD_SEL",
    key: "UFN_LEAD_SEL",
    parameters: {
        id: id,
        fullname: '',
        leadproduct: '',
        campaignid: 0,
        tags: '',
        userid: "", // filtro asesor
        supervisorid: 0, // id del usuario de la sesión 
        all: false,
    },
});

export const adviserSel = (): IRequestBody => ({
    method: 'UFN_ADVISERS_SEL',
    key: "UFN_ADVISERS_SEL",
    parameters: {},
});
export const userSDSel = (): IRequestBody => ({
    method: 'UFN_USER_SD_SEL',
    key: "UFN_USER_SD_SEL",
    parameters: {},
});

//tabla paginada
export const paginatedPersonWithoutDateSel = ({ skip, take, filters, sorts }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_PERSONWITHOUTDATE_SEL",
    methodCount: "UFN_PERSONWITHOUTDATE_TOTALRECORDS",
    parameters: {
        skip,
        take,
        filters,
        sorts,
        origin: "person",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const leadActivityIns = (parameters: ICrmLeadActivitySave): IRequestBody => ({
    key: "UFN_LEADACTIVITY_INS",
    method: "UFN_LEADACTIVITY_INS",
    parameters,
});

export const leadActivitySel = (leadid: string | number): IRequestBody => ({
    key: "UFN_LEADACTIVITY_SEL",
    method: "UFN_LEADACTIVITY_SEL",
    parameters: {
        leadid,
        leadactivityid: 0,
        all: true,
    }
});

export const leadLogNotesSel = (leadid: string | number): IRequestBody => ({
    key: "UFN_LEADNOTES_SEL",
    method: "UFN_LEADNOTES_SEL",
    parameters: {
        leadid,
        leadnotesid: 0,
        all: true,
    }
});

export const leadLogNotesIns = (parameters: ICrmLeadNoteSave): IRequestBody => ({
    key: "UFN_LEADNOTES_INS",
    method: "UFN_LEADNOTES_INS",
    parameters,
});

export const getPaginatedLead = ({ skip, take, filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBodyPaginated => ({
    methodCollection: "UFN_LEADGRID_SEL",
    methodCount: "UFN_LEADGRID_TOTALRECORDS",
    parameters: {
        origin: "lead",
        startdate,
        enddate,
        skip,
        take,
        filters,
        sorts,
        asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        contact: allParameters['contact'] ? allParameters['contact'] : "",
        offset: (new Date().getTimezoneOffset() / 60) * -1,
        ...allParameters
    }
})

export const getPaginatedSDLead = ({ skip, take, filters, sorts, startdate, enddate, contact, leadproduct, tags, company,
    groups, supervisorid, phase, description, ...allParameters }: Dictionary): IRequestBodyPaginated => ({
        methodCollection: "UFN_LEADGRID_SD_SEL",
        methodCount: "UFN_LEADGRID_SD_TOTALRECORDS",
        parameters: {
            origin: "servicedesk",
            startdate,
            enddate,
            skip,
            take,
            filters,
            sorts,
            fullname: contact,
            leadproduct,
            tags,
            company: company || "",
            groups,
            supervisorid,
            phase,
            description,
            offset: (new Date().getTimezoneOffset() / 60) * -1,
            ...allParameters
        }
    })

export const getLeadExport = ({ filters, sorts, startdate, enddate, ...allParameters }: Dictionary): IRequestBody => ({
    method: "UFN_LEADGRID_EXPORT",
    key: "UFN_LEADGRID_EXPORT",
    parameters: {
        origin: "lead",
        startdate,
        enddate,
        filters,
        sorts,
        asesorid: allParameters['asesorid'] ? allParameters['asesorid'] : 0,
        channel: allParameters['channel'] ? allParameters['channel'] : "",
        contact: allParameters['contact'] ? allParameters['contact'] : "",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const insArchiveServiceDesk = (lead: IServiceDeskLead2 | IServiceDeskLead): IRequestBody => ({
    method: 'UFN_LEAD_SD_INS',
    key: "UFN_LEAD_SD_INS",
    parameters: {
        ...lead,
        id: lead.leadid,
        username: null,
        status: "CERRADO",
        operation: "UPDATE",
    },
});

export const insArchiveLead = (lead: ICrmLead): IRequestBody => ({
    method: 'UFN_LEAD_INS',
    key: "UFN_LEAD_INS",
    parameters: {
        ...lead,
        id: lead.leadid,
        username: null,
        status: "CERRADO",
        operation: "UPDATE",
    },
});

export const heatmapresumensel = ({ communicationchannel, startdate, enddate, closedby }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_RESUMEN_SEL",
    method: "UFN_REPORT_HEATMAP_RESUMEN_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage1 = ({ communicationchannel, startdate, enddate, closedby }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE1_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE1_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage1detail = ({ communicationchannel, startdate, enddate, closedby, horanum, option }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE1_DATE_DETAIL_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE1_DATE_DETAIL_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        horanum,
        option,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage2 = ({ communicationchannel, startdate, enddate, closedby, company, group }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE2_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE2_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        company,
        group,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage2detail1 = ({ communicationchannel, startdate, enddate, closedby, company, group, agentid, option }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE2_1_AGENT_DETAIL_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE2_1_AGENT_DETAIL_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        company,
        group,
        agentid,
        option,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage2detail2 = ({ communicationchannel, startdate, enddate, closedby, company, group, agentid, option }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_PAGE2_2_AGENT_DETAIL_SEL",
    method: "UFN_REPORT_HEATMAP_PAGE2_2_AGENT_DETAIL_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        closedby,
        company,
        group,
        agentid,
        option,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage3 = ({ communicationchannel, startdate, enddate }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_SEL",
    method: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});
export const heatmappage3detail = ({ communicationchannel, startdate, enddate, horanum }: Dictionary): IRequestBody => ({
    key: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_DETAIL_SEL",
    method: "UFN_REPORT_HEATMAP_ASESORESCONECTADOS_DETAIL_SEL",
    parameters: {
        communicationchannel,
        startdate,
        enddate,
        horanum,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const leadHistorySel = (leadid: string | number): IRequestBody => ({
    key: "UFN_LEADACTIVITYHISTORY_SEL",
    method: "UFN_LEADACTIVITYHISTORY_SEL",
    parameters: {
        leadid,
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    }
});

export const updateLeadTagsIns = (tags: ICrmLeadTagsSave): IRequestBody => ({
    key: "UFN_UPDATE_LEAD_TAGS",
    method: "UFN_UPDATE_LEAD_TAGS",
    parameters: tags,
});

export const leadHistoryIns = ({ leadid, historyleadid, description, type, status, operation }: ICrmLeadHistoryIns): IRequestBody => ({
    key: "UFN_HISTORYLEAD_INS",
    method: "UFN_HISTORYLEAD_INS",
    parameters: {
        leadid,
        historyleadid: historyleadid || 0,
        description,
        type,
        status: status || 'ACTIVO',
        operation
    }
});

export const changePasswordOnFirstLoginIns = (userid: number | string, password: string): IRequestBody => ({
    key: "UFN_USERPASSWORD_UPDATE",
    method: "UFN_USERPASSWORD_UPDATE",
    parameters: { password, userid },
});

export const getPlanSel = (): IRequestBody => ({
    method: "UFN_SUPPORTPLAN_SEL",
    key: "UFN_SUPPORTPLAN_SEL",
    parameters: {}
})

export const getPaymentPlanSel = (): IRequestBody => ({
    method: "UFN_PAYMENTPLAN_SEL",
    key: "UFN_PAYMENTPLAN_SEL",
    parameters: {
        code: 0,
        all: true
    }
})

export const getPhoneTax = (): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SEL_PHONETAX",
    key: "UFN_BILLINGPERIOD_SEL_PHONETAX",
    parameters: {}
})

export const getBillingSupportSel = ({ year, month, plan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGSUPPORT_SEL",
    key: "UFN_BILLINGSUPPORT_SEL",
    parameters: { year, month, plan }
})

export const billingSupportIns = ({ year, month, plan, basicfee, starttime, finishtime, plancurrency, status, description, id, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGSUPPORT_INS",
    key: "UFN_BILLINGSUPPORT_INS",
    parameters: { year, month, plan, basicfee, starttime, finishtime, plancurrency, status, type, description, operation, id }
})

export const getBillingConfigurationSel = ({ year, month, plan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONFIGURATION_SEL",
    key: "UFN_BILLINGCONFIGURATION_SEL",
    parameters: { year, month, plan }
})

export const billingConfigurationIns = ({ year, month, plan, id, basicfee, userfreequantity, useradditionalfee, channelfreequantity, channelwhatsappfee, channelotherfee, clientfreequantity, clientadditionalfee, allowhsm, hsmfee, description, status, whatsappconversationfreequantity, freewhatsappchannel, usercreateoverride, channelcreateoverride, vcacomissionperhsm, vcacomissionpervoicechannel, plancurrency, vcacomission, basicanualfee, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONFIGURATION_INS",
    key: "UFN_BILLINGCONFIGURATION_INS",
    parameters: { year, month, plan, id, basicfee, userfreequantity, useradditionalfee, channelfreequantity, channelwhatsappfee, channelotherfee, clientfreequantity, clientadditionalfee, allowhsm, hsmfee, description, status, whatsappconversationfreequantity, freewhatsappchannel, usercreateoverride, channelcreateoverride, vcacomissionperhsm, vcacomissionpervoicechannel, plancurrency, vcacomission, basicanualfee, type, operation }
})

export const getBillingConversationSel = ({ year, month, countrycode = "" }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONVERSATION_SEL",
    key: "UFN_BILLINGCONVERSATION_SEL",
    parameters: { year, month, countrycode: countrycode ? countrycode : "" }
})

export const billingConversationIns = ({ id, year, month, countrycode, vcacomission, description, status, type, plancurrency, businessutilityfee, businessauthenticationfee, businessmarketingfee, usergeneralfee, freequantity, username, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGCONVERSATION_INS",
    key: "UFN_BILLINGCONVERSATION_INS",
    parameters: { id, year, month, countrycode, vcacomission, description, status, type, plancurrency, businessutilityfee, businessauthenticationfee, businessmarketingfee, usergeneralfee, freequantity, username, operation }
})

export const getBillingPeriodSel = ({ corpid, orgid, year, month, billingplan, supportplan }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SEL",
    key: "UFN_BILLINGPERIOD_SEL",
    parameters: { corpid, orgid, year, month, billingplan, supportplan }
})
export const billingPeriodUpd = ({ corpid, orgid, year, month, billingplan, billingsupportplan, billinginvoicecurrency, billingplancurrency, billingstartdate, billingmode, billingplanfee, billingsupportfee, billinginfrastructurefee, billingexchangerate, agentcontractedquantity, agentplancurrency, agentadditionalfee, agenttotalfee, agentaddlimit, agentmode, channelothercontractedquantity, channelotheradditionalfee, channelwhatsappcontractedquantity, channelwhatsappadditionalfee, channelotherquantity, channelwhatsappquantity, channeltotalfee, channelwhatsappfreequantity, channeladdlimit, conversationuserplancurrency, conversationuserserviceadditionalfee, conversationuserservicevcafee, conversationusermetacurrency, conversationuserservicefee, conversationuserservicetotalfee, conversationbusinessplancurrency, conversationbusinessutilityadditionalfee, conversationbusinessauthenticationadditionalfee, conversationbusinessmarketingadditionalfee, conversationbusinessutilityvcafee, conversationbusinessauthenticationvcafee, conversationbusinessmarketingvcafee, conversationbusinessmetacurrency, conversationbusinessutilitymetafee, conversationbusinessauthenticationmetafee, conversationbusinessmarketingmetafee, conversationbusinessutilitytotalfee, conversationbusinessauthenticationtotalfee, conversationbusinessmarketingtotalfee, conversationplancurrency, contactcalculatemode, contactcountmode, contactuniquelimit, contactuniquequantity, contactplancurrency, contactuniqueadditionalfee, contactuniquefee, contactwhatsappquantity, contactotherquantity, contactotheradditionalfee, contactwhatsappadditionalfee, contactotherfee, contactwhatsappfee, contactfee, messagingplancurrency, messagingsmsadditionalfee, messagingsmsvcafee, messagingsmsquantity, messagingsmsquantitylimit, messagingsmstotalfee, messagingmailadditionalfee, messagingmailvcafee, messagingmailquantity, messagingmailquantitylimit, messagingmailtotalfee, voicevcacomission, consultingplancurrency, consultinghourtotal, consultinghourquantity, consultingcontractedfee, consultingextrafee, consultingtotalfee, consultingprofile, consultingadditionalfee, additionalservice01, additionalservice01fee, additionalservice02, additionalservice02fee, additionalservice03, additionalservice03fee, invoiceid, status, force }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_UPD",
    key: "UFN_BILLINGPERIOD_UPD",
    parameters: { corpid, orgid, year, month, billingplan, billingsupportplan, billinginvoicecurrency, billingplancurrency, billingstartdate, billingmode, billingplanfee, billingsupportfee, billinginfrastructurefee, billingexchangerate, agentcontractedquantity, agentplancurrency, agentadditionalfee, agenttotalfee, agentaddlimit, agentmode, channelothercontractedquantity, channelotheradditionalfee, channelwhatsappcontractedquantity, channelwhatsappadditionalfee, channelotherquantity, channelwhatsappquantity, channeltotalfee, channelwhatsappfreequantity, channeladdlimit, conversationuserplancurrency, conversationuserserviceadditionalfee, conversationuserservicevcafee, conversationusermetacurrency, conversationuserservicefee, conversationuserservicetotalfee, conversationbusinessplancurrency, conversationbusinessutilityadditionalfee, conversationbusinessauthenticationadditionalfee, conversationbusinessmarketingadditionalfee, conversationbusinessutilityvcafee, conversationbusinessauthenticationvcafee, conversationbusinessmarketingvcafee, conversationbusinessmetacurrency, conversationbusinessutilitymetafee, conversationbusinessauthenticationmetafee, conversationbusinessmarketingmetafee, conversationbusinessutilitytotalfee, conversationbusinessauthenticationtotalfee, conversationbusinessmarketingtotalfee, conversationplancurrency, contactcalculatemode, contactcountmode, contactuniquelimit, contactuniquequantity, contactplancurrency, contactuniqueadditionalfee, contactuniquefee, contactwhatsappquantity, contactotherquantity, contactotheradditionalfee, contactwhatsappadditionalfee, contactotherfee, contactwhatsappfee, contactfee, messagingplancurrency, messagingsmsadditionalfee, messagingsmsvcafee, messagingsmsquantity, messagingsmsquantitylimit, messagingsmstotalfee, messagingmailadditionalfee, messagingmailvcafee, messagingmailquantity, messagingmailquantitylimit, messagingmailtotalfee, voicevcacomission, consultingplancurrency, consultinghourtotal, consultinghourquantity, consultingcontractedfee, consultingextrafee, consultingtotalfee, consultingprofile, consultingadditionalfee, additionalservice01, additionalservice01fee, additionalservice02, additionalservice02fee, additionalservice03, additionalservice03fee, invoiceid, status, force }
})

export const getBillingPeriodSummarySel = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SUMMARYORG",
    key: "UFN_BILLINGPERIOD_SUMMARYORG",
    parameters: { corpid, orgid: corpid === 0 ? corpid : orgid, year, month, force: true }
})
export const getBillingPeriodSummarySelCorp = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_SUMMARYCORP",
    key: "UFN_BILLINGPERIOD_SUMMARYCORP",
    parameters: { corpid, orgid: corpid === 0 ? corpid : orgid, year, month, force: true }
})
export const billingpersonreportsel = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLING_REPORT_PERSON",
    key: "UFN_BILLING_REPORT_PERSON",
    parameters: { corpid, orgid, year, month }
})
export const billinguserreportsel = ({ corpid, orgid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLING_REPORT_USER",
    key: "UFN_BILLING_REPORT_USER",
    parameters: { corpid, orgid, year, month }
})
export const getInputValidationSel = (id: number): IRequestBody => ({
    method: "UFN_INPUTVALIDATION_SEL",
    key: "UFN_INPUTVALIDATION_SEL",
    parameters: { id }
})
export const inputValidationins = ({ id, operation, description, inputvalue, type, status }: Dictionary): IRequestBody => ({
    method: "UFN_INPUTVALIDATION_INS",
    key: "UFN_INPUTVALIDATION_INS",
    parameters: { id, operation, description, inputvalue, type, status }
})
export const getRecordHSMList = ({ startdate, enddate }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_SENTMESSAGES_LST",
    key: "UFN_REPORT_SENTMESSAGES_LST",
    parameters: {
        startdate, enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const getRecordHSMReport = ({ name, from, date }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_SENTMESSAGES_REPORT",
    key: "UFN_REPORT_SENTMESSAGES_REPORT",
    parameters: {
        date,
        name,
        from,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const getRecordHSMGraphic = ({ startdate, enddate, column, summarization }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_SENTMESSAGES_GRAPHIC",
    key: "UFN_REPORT_SENTMESSAGES_GRAPHIC",
    parameters: {
        filters: {}, sorts: {}, startdate, enddate, column, summarization,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})
export const getRecordVoicecallGraphic = ({ startdate, enddate, column, summarization }: Dictionary): IRequestBody => ({
    method: "UFN_REPORT_VOICECALL_GRAPHIC",
    key: "UFN_REPORT_VOICECALL_GRAPHIC",
    parameters: {
        filters: {}, sorts: {}, startdate, enddate, column, summarization,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
})

export const getDashboardTemplateSel = (dashboardtemplateId: number | string = 0) => ({
    method: "UFN_DASHBOARDTEMPLATE_SEL",
    key: "UFN_DASHBOARDTEMPLATE_SEL",
    parameters: {
        id: dashboardtemplateId,
        all: dashboardtemplateId === 0 || dashboardtemplateId === '0',
    },
});

export const getDashboardTemplateIns = (parameters: DashboardTemplateSave) => ({
    method: "UFN_DASHBOARDTEMPLATE_INS",
    key: "UFN_DASHBOARDTEMPLATE_INS",
    parameters,
});
export const getBillingPeriodCalc = ({ corpid, year, month }: Dictionary) => ({
    method: "UFN_BILLINGPERIOD_CALC",
    key: "UFN_BILLINGPERIOD_CALC",
    parameters: {
        corpid, year, month, force: true
    },
});

export const getBusinessDocType = () => ({
    method: "UFN_BUSINESSDOCTYPE_SEL",
    key: "UFN_BUSINESSDOCTYPE_SEL",
    parameters: {},
});

export const selInvoice = ({ corpid, orgid, year, month, invoiceid, currency, paymentstatus }: Dictionary) => ({
    method: "UFN_INVOICE_SEL",
    key: "UFN_INVOICE_SEL",
    parameters: { corpid, orgid, year, month, invoiceid: invoiceid ? invoiceid : 0, currency, paymentstatus },
});

export const selInvoiceClient = ({ corpid, orgid, year, month, invoiceid, currency, paymentstatus }: Dictionary) => ({
    method: "UFN_INVOICE_SELCLIENT",
    key: "UFN_INVOICE_SELCLIENT",
    parameters: { corpid, orgid, year, month, invoiceid: invoiceid ? invoiceid : 0, currency, paymentstatus },
});

export const deleteInvoice = ({ corpid, orgid, invoiceid }: Dictionary) => ({
    method: "UFN_INVOICE_DELETE",
    key: "UFN_INVOICE_DELETE",
    parameters: { corpid, orgid, invoiceid },
});

export const getLeadTasgsSel = () => ({
    method: "UFN_LEAD_TAGSDISTINCT_SEL",
    key: "UFN_LEAD_TAGSDISTINCT_SEL",
    parameters: {},
});

export const getHistoryStatusConversation = (personid: number, conversationid: number, communicationchannelid: number) => ({
    method: "UFN_CONVERSATIONSTATUS_SEL",
    key: "UFN_CONVERSATIONSTATUS_SEL",
    parameters: {
        personid,
        conversationid,
        communicationchannelid
    },
});

export const getAnalyticsIA = (conversationid: number) => ({
    method: "UFN_CONVERSATION_SEL_ANALYTICS_V2",
    key: "UFN_CONVERSATION_SEL_ANALYTICS_V2",
    parameters: {
        conversationid,
    },
});

export const selKPIManager = (kpiid: number = 0) => ({
    method: "UFN_KPI_SEL",
    key: "UFN_KPI_SEL",
    parameters: {
        kpiid
    },
});

export const insKPIManager = ({ id = 0, kpiname, description, status, type, sqlselect, sqlwhere, target, cautionat, alertat, taskperiod, taskinterval, taskstartdate, operation }: Dictionary): IRequestBody => ({
    method: "UFN_KPI_INS",
    key: "UFN_KPI_INS",
    parameters: {
        id, kpiname, description, status, type, sqlselect, sqlwhere, target, cautionat, alertat, taskperiod, taskinterval, taskstartdate, operation,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});

export const duplicateKPIManager = (kpiid: number = 0): IRequestBody => ({
    method: "UFN_KPI_DUPLICATE",
    key: "UFN_KPI_DUPLICATE",
    parameters: {
        kpiid
    }
});

export const selKPIManagerHistory = ({ kpiid, startdate, enddate }: Dictionary) => ({
    method: "UFN_KPIHISTORY_SEL",
    key: "UFN_KPIHISTORY_SEL",
    parameters: {
        kpiid,
        startdate,
        enddate,
        offset: (new Date().getTimezoneOffset() / 60) * -1
    },
});

export const calcKPIManager = (kpiid: number = 0): IRequestBody => ({
    method: "UFN_KPI_CALC",
    key: "UFN_KPI_CALC",
    parameters: {
        kpiid,
        task: false
    }
});
export const getAppsettingInvoiceSel = () => ({
    method: "UFN_APPSETTING_INVOICE_SEL",
    key: "UFN_APPSETTING_INVOICE_SEL",
    parameters: {},
});

export const updateAppsettingInvoice = ({ ruc, businessname, tradename, fiscaladdress, ubigeo, country, emittertype, currency, invoiceserie, invoicecorrelative, annexcode, igv, printingformat, xmlversion, ublversion, returnpdf, returnxmlsunat, returnxml, invoiceprovider, sunaturl, token, sunatusername, paymentprovider, publickey, privatekey, ticketserie, ticketcorrelative, invoicecreditserie, invoicecreditcorrelative, ticketcreditserie, ticketcreditcorrelative, detraction, detractioncode, detractionaccount, operationcodeperu, operationcodeother, culqiurl, detractionminimum, culqiurlcardcreate, culqiurlclient, culqiurltoken, culqiurlcharge, culqiurlcardget, culqiurlcarddelete }: Dictionary): IRequestBody => ({
    method: "UFN_APPSETTING_INVOICE_UPDATE",
    key: "UFN_APPSETTING_INVOICE_UPDATE",
    parameters: { ruc, businessname, tradename, fiscaladdress, ubigeo, country, emittertype, currency, invoiceserie, invoicecorrelative, annexcode, igv, printingformat, xmlversion, ublversion, returnpdf, returnxmlsunat, returnxml, invoiceprovider, sunaturl, token, sunatusername, paymentprovider, publickey, privatekey, ticketserie, ticketcorrelative, invoicecreditserie, invoicecreditcorrelative, ticketcreditserie, ticketcreditcorrelative, detraction, detractioncode, detractionaccount, operationcodeperu, operationcodeother, culqiurl, detractionminimum, culqiurlcardcreate, culqiurlclient, culqiurltoken, culqiurlcharge, culqiurlcardget, culqiurlcarddelete }
});

/**bloquear o desbloquear personas de forma masiva */
export const personcommunicationchannelUpdateLockedArrayIns = (table: { personid: number, locked: boolean }[]) => ({
    method: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED_ARRAY",
    key: "UFN_PERSONCOMMUNICATIONCHANNEL_UPDATE_LOCKED_ARRAY",
    parameters: { table: JSON.stringify(table) },
});

export const changeStatus = ({ conversationid, status, obs, motive }: {
    conversationid: number;
    status: string;
    obs: string;
    motive: string;
}) => ({
    method: "UFN_CONVERSATION_CHANGESTATUS",
    key: "UFN_CONVERSATION_CHANGESTATUS",
    parameters: {
        conversationid,
        status,
        obs,
        type: motive,
    },
});
export const getBillingPeriodCalcRefreshAll = (year: number, month: number, corpid: number, orgid: number): IRequestBody => ({
    method: "UFN_BILLINGPERIOD_CALC_REFRESHALL",
    key: "UFN_BILLINGPERIOD_CALC_REFRESHALL",
    parameters: {
        year,
        month,
        corpid,
        orgid,
    },
});

export const getTableOrigin = (): IRequestBody => ({
    method: "UFN_REPORT_PERSONALIZED_ORIGIN_SEL",
    key: "UFN_REPORT_PERSONALIZED_ORIGIN_SEL",
    parameters: {},
});

export const getColumnsOrigin = (tablename: string): IRequestBody => ({
    method: "UFN_REPORT_PERSONALIZED_COLUMNS_SEL",
    key: "UFN_REPORT_PERSONALIZED_COLUMNS_SEL",
    parameters: { tablename },
});
export const getBillingMessagingSel = ({ year, month }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGMESSAGING_SEL",
    key: "UFN_BILLINGMESSAGING_SEL",
    parameters: { year, month }
})


export const billingMessagingIns = ({ year, month, id, pricepersms, vcacomissionpersms, pricepermail, vcacomissionpermail, description, status, type, operation }: Dictionary): IRequestBody => ({
    method: "UFN_BILLINGMESSAGING_INS",
    key: "UFN_BILLINGMESSAGING_INS",
    parameters: { year, month, id, pricepersms, vcacomissionpersms, pricepermail, vcacomissionpermail, description, status, type, operation }
})

export const invoiceRefresh = ({ corpid, orgid, invoiceid, year, month }: Dictionary): IRequestBody => ({
    method: "UFN_INVOICE_REFRESH",
    key: "UFN_INVOICE_REFRESH",
    parameters: { corpid, orgid, invoiceid, year, month },
});

export const getAdviserFilteredUserRol = (): IRequestBody => ({
    method: "UFN_ADVISERSBYUSERID_SEL",
    key: "UFN_ADVISERSBYUSERID_SEL",
    parameters: {},
});

export const getVariablesByOrg = (): IRequestBody => ({
    method: "UFN_REPORT_PERSONALIZED_VARIABLE_SEL",
    key: "UFN_REPORT_PERSONALIZED_VARIABLE_SEL",
    parameters: {},
});

export const getKpiSel = () => ({
    method: "UFN_KPI_LST",
    key: "UFN_KPI_LST",
    parameters: {},
});

export const changePlan = (paymentplancode: string) => ({
    method: "UFN_CORP_PAYMENTPLAN_UPD",
    key: "UFN_CORP_PAYMENTPLAN_UPD",
    parameters: {
        paymentplancode
    },
});

export const cancelSuscription = () => ({
    method: "UFN_CORP_PAYMENTPLAN_CANCEL",
    key: "UFN_CORP_PAYMENTPLAN_CANCEL",
    parameters: {
        offset: (new Date().getTimezoneOffset() / 60) * -1
    },
});