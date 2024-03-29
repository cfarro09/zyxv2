/* eslint-disable no-eval */
/* eslint-disable no-useless-escape */
import { Dictionary } from "@types";
// import * as XLSX from 'xlsx';

export const contactCalculateList = [
    { value: "PER_CHANNEL", description: "per_channel" },
    { value: "UNIQUE", description: "unique" },
];

export const contactCountList = [
    { value: "SENT_HSM", description: "sent_hsm" },
    { value: "DELIVERED_HSM", description: "delivered_hsm" },
];

export const agentModeList = [
    { value: "PER_DAY", description: "per_day" },
    { value: "PER_MONTH", description: "per_month" },
];

export const planModeList = [
    { value: "YEARLY", description: "yearly" },
    { value: "MONTHLY", description: "monthly" },
];

export const dataCurrency = [
    { value: "PEN", description: "PEN" },
    { value: "USD", description: "USD" },
];

export const dataYears = Array.from(Array(21).keys()).map(x => ({ value: `${new Date().getFullYear() + x - 10}` }));

export const dataMonths = [
    {
        val: "01"
    },
    {
        val: "02"
    },
    {
        val: "03"
    },
    {
        val: "04"
    },
    {
        val: "05"
    },
    {
        val: "06"
    },
    {
        val: "07"
    },
    {
        val: "08"
    },
    {
        val: "09"
    },
    {
        val: "10"
    },
    {
        val: "11"
    },
    {
        val: "12"
    }
];


export function datesInMonth(year?: number, month?: number) {
    if (!!year && !!month) {
        let lastdate = new Date(year, month, 0).getDate()
        return Array.from(Array(lastdate).keys()).map(x => ({ val: `${x + 1}` }));
    } else {
        return []
    }
}

export const dataActivities = [
    {
        "activity_id": "1267092843327003",
        "activity_name": "AGREES"
    },
    {
        "activity_id": "742120442490915",
        "activity_name": "CELEBRATES"
    },
    {
        "activity_id": "383634705006159",
        "activity_name": "EATS"
    },
    {
        "activity_id": "721170054585954",
        "activity_name": "SUPPORTS"
    },
    {
        "activity_id": "1226135157422772",
        "activity_name": "CALLS"
    },
    {
        "activity_id": "1136670953035860",
        "activity_name": "STREAMS"
    },
    {
        "activity_id": "601369976565963",
        "activity_name": "LOOKS_FOR"
    },
    {
        "activity_id": "809473052422320",
        "activity_name": "THINKS_ABOUT"
    },
    {
        "activity_id": "809472309089061",
        "activity_name": "MAKES"
    },
    {
        "activity_id": "806115869424705",
        "activity_name": "SELECTS_VERB"
    },
    {
        "activity_id": "383634835006146",
        "activity_name": "FEELS"
    },
    {
        "activity_id": "383634868339476",
        "activity_name": "LISTENS"
    },
    {
        "activity_id": "809471075755851",
        "activity_name": "MEETS"
    },
    {
        "activity_id": "1443817305654555",
        "activity_name": "RESPONDS_TO"
    },
    {
        "activity_id": "556187044417590",
        "activity_name": "GOES_TO"
    },
    {
        "activity_id": "668012816568345",
        "activity_name": "ATTENDS"
    },
    {
        "activity_id": "532534113449550",
        "activity_name": "VOTES"
    },
    {
        "activity_id": "1294635240572763",
        "activity_name": "CONTACTS"
    },
    {
        "activity_id": "637142219655405",
        "activity_name": "OTHER"
    },
    {
        "activity_id": "383635058339457",
        "activity_name": "READS"
    },
    {
        "activity_id": "520095228026772",
        "activity_name": "PLAYS"
    },
    {
        "activity_id": "809472139089078",
        "activity_name": "GETS"
    },
    {
        "activity_id": "1500689486634003",
        "activity_name": "PREPARES_TO_VOTE"
    },
    {
        "activity_id": "906305289405762",
        "activity_name": "WRITES_A_NOVEL_ABOUT"
    },
    {
        "activity_id": "902228273146797",
        "activity_name": "REMEMBERS"
    },
    {
        "activity_id": "383634741672822",
        "activity_name": "DRINKS"
    },
    {
        "activity_id": "1270648612971426",
        "activity_name": "DISAGREES"
    },
    {
        "activity_id": "383634671672829",
        "activity_name": "WATCHES"
    },
    {
        "activity_id": "1503898576313094",
        "activity_name": "REGISTERS_TO_VOTE"
    },
    {
        "activity_id": "580961725273455",
        "activity_name": "TRAVELS"
    }
]
export function formatNumber(num: number) {
    if (num)
        return parseFloat(num.toString()).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0.00"
}
export function formatNumberFourDecimals(num: number) {
    if (num)
        return parseFloat(num.toString()).toFixed(4).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1')
    return "0.0000"
}

export function formatNumberNoDecimals(num: number) {
    if (num) {
        num = Math.round(num);
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    else {
        return "0";
    }
}

export function formattimeMinutes(cc: any) {
    let seconds = 0
    if (typeof (cc) === "string") seconds = timetoseconds(cc);
    else seconds = cc;

    if (!seconds)
        return "0";
    let hh = Math.floor(seconds / 3600) > 0 ? `${Math.floor(seconds / 3600)}h ` : ""
    let mm = Math.floor((seconds % 3600) / 60) > 0 ? `${Math.floor((seconds % 3600) / 60)}m` : "0m"
    return `${hh}${mm}`
}


export function formattime(cc: any) {
    if (!cc)
        return "0";
    let hh = Math.floor(cc / 3600) > 0 ? `${Math.floor(cc / 3600)}h ` : ""
    let mm = Math.floor((cc % 3600) / 60) > 0 ? `${Math.floor((cc % 3600) / 60)}m` : ""
    let ss = `${cc % 60}s`
    return `${hh}${mm}${ss}`
}

export function validateNumbersEqualsConsecutive(text: string, limit: number) {
    let canxx = 1;
    for (var i = 0; i < text.length; i++) {
        if (/^\d+$/.test(text.charAt(i))) {
            canxx = 1;
            for (var j = i + 1; j < text.length; j++) {
                if (text.charAt(i) === text.charAt(j)) {
                    canxx++;
                }
            }
            if (canxx > limit) {
                return false;
            }
        }
    }
    return true;
}

export function validateDomainCharacters(text: string, regex: any, option: string) {
    switch (option) {
        case "01": //comienza
            return (eval(`/^[${regex}]/`).test(text));
        case "05": //termina
            return (eval(`/[${regex}]/g`).test(text.substring(text.length - 1)));
        case "02": //incluye
            return (eval(`/[${regex}]/`).test(text));
        case "03": //mas de 1
            return text.replace(eval(`/[^${regex}]/g`), "").length > 1 ? true : false;
        default:
            return true;
    }
}

export function validateDomainCharactersSpecials(text: string, option: string) {
    let charactersallowed = `! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ { | } ~`
    switch (option) {
        case "01": //comienza
            return charactersallowed.includes(text.substring(0, 1));
        case "05": //termina
            return charactersallowed.includes(text.substring(text.length - 1));
        case "02": //incluye
            let isok = false;
            charactersallowed.split(" ").forEach(c => {
                if (text.includes(c))
                    isok = true;
            });
            return isok;
        case "03": //mas de 1

            let count = 0;
            charactersallowed.split(" ").forEach(c => {
                count += text.split('').reduce((t, l) => t = t + (l === c ? 1 : 0), 0);
            });


            return count > 1;
        default:
            return true;
    }
}

export function addTimes(t1: string, t2: string) {
    let t1seconds = timetoseconds(t1);
    let t2seconds = timetoseconds(t2);
    return secondsToTime(t1seconds + t2seconds)
}
export function substractiontimesTimes(after: string, before: string) {
    let bcseconds = timetoseconds(before);
    let acseconds = timetoseconds(after);
    return secondsToTime(acseconds - bcseconds)
}
export function varpercTime(newt: string, oldt: string, decimals: number) {
    if (!!newt && !!oldt) {
        let newtseconds = timetoseconds(newt);
        let oldtseconds = timetoseconds(oldt);
        return (((newtseconds - oldtseconds) / oldtseconds) * 100).toFixed(decimals)
    } else {
        return (0).toFixed(decimals)
    }
}
export function varpercnumber(newn: number, oldn: number, decimals: number) {
    if (newn + oldn) {
        return (((newn - oldn) / oldn) * 100).toFixed(decimals)
    } else {
        return (0).toFixed(decimals)
    }
}

export function divisionTimeNumber(tim: string, n: number) {
    if (!!n) {
        let timeseconds = timetoseconds(tim);
        let divided = Math.floor(timeseconds / n)
        return secondsToTime(divided)
    } else {
        return "00:00:00"
    }
}
export function timetoseconds(cc: any) {
    if (!cc)
        return 0;
    const times = cc.split(":");

    const hour = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = times[2] ? parseInt(times[2]) : 0;
    return (hour * 60 * 60) + (minutes * 60) + seconds;
}
export function timetomin(cc: any) {
    if (!cc)
        return 0;
    const times = cc.split(":");
    const hour = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = parseInt(times[2]);
    return hour * 60 + minutes + (seconds >= 30 ? 1 : 0);
}
export function formatname(cc: any) {
    if (cc) {
        let newname = cc.toLowerCase();
        let names = newname.split(" ");
        for (let i = 0; i < names.length; i++) {
            names[i] = (names[i] ? names[i][0].toUpperCase() : "") + names[i].substr(1);
        }
        return names.join(" ")
    }
    else {
        return ''
    }
}

export function secondsToDayTime(sec_num: any) {
    sec_num = parseInt(sec_num)
    let days = Math.floor(sec_num / 86400);
    let hours: any = Math.floor((sec_num - (days * 86400)) / 3600);
    let minutes: any = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    let seconds: any = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    const stringdays = days === 0 ? "" : (days > 1 ? days + " days " : days + " day ");
    return stringdays + hours + ':' + minutes + ':' + seconds;
}

export function secondsToHourTime(sec_num: any) {
    sec_num = parseInt(sec_num)
    let days = Math.floor(sec_num / 86400);
    let hours: any = Math.floor((sec_num - (days * 86400)) / 3600);
    let minutes: any = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    let seconds: any = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);
    if (hours < 10 && days === 0) { hours = "0" + hours; } else { hours = days * 24 + hours }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

export function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
}

export function isJson(s: string): boolean {
    try {
        JSON.parse(s);
    } catch (e) {
        return false;
    }
    return true;
}

export function extractVariables(text: string, array: string[] = []): string[] {
    let rex = new RegExp(/{{[\?\w\s\u00C0-\u00FF]+?}}/, 'g');
    return Array.from(new Set([...array, ...Array.from(text.matchAll(rex), (m: any[]) => m[0].replace(/[{]{2}/, '').replace(/[}]{2}/, ''))]));
}

export function extractVariablesFromArray(data: any[], key: string, array: string[] = []): string[] {
    return data.reduce((a: any[], d: any) => {
        a = Array.from(new Set([...a, ...extractVariables(d[key], array)]))
        return a;
    }, []);
}

export function dictToArrayKV(dict: Dictionary, key: string = 'key', value: string = 'value') {
    return Object.entries(dict).reduce((a: any[], [k, v]) => {
        a.push({ [key]: k, [value]: v });
        return a;
    }, []);
}

export function richTextToString(data: Dictionary[]) {
    try {
        return data.reduce((ac: Dictionary[], c: Dictionary) => (
            [...ac, ...c?.children?.map((m: Dictionary) => (
                m?.children ? `- ${m?.children[0]?.text}` : m?.text
            ))]
        ), []).join('\n')
    } catch (error) {
        return JSON.stringify(data)
    }
}

export function filterPipe(items: Dictionary[], field: string, value: any, inv?: string) {
    // If there are not items return empty//
    if (!items) return [];
    // If '%' contains wildcard and value is empty return items//
    if (inv === '%' && (!value || value === '')) return items;
    // If filter === '' return empty//
    if (value === '') return [];
    // If there are not filter value return all items//
    if (!value || value.length === 0) return [];
    // If the filter value is a number//
    if (items.length > 0 && typeof items[0][field] === 'number') {
        return items.filter(it => it[field].toString() === value.toString());
    }
    // If '%' contains wildcard is a string contains//
    else if (inv === '%') {
        return items.filter(it => it[field]?.toLowerCase().includes(value.toLowerCase()));
    }
    // If '!' inverter filter is a string not equals//
    else if (inv === '!') {
        return items.filter(it => it[field]?.toLowerCase().indexOf(value.toLowerCase()) === -1);
    }
    // If the filter value is a string is a string equals//
    else {
        return items.filter(it => it[field]?.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
}

export function filterIf(data: Dictionary[], rif?: string, rifvalue?: string) {
    return data.filter(d => [null, undefined].includes(d.rif) || (d.rif === rif && d.rifvalue === rifvalue));
}

interface DownloadCSVOptions {
    headers?: string[] | ((header: string, index: number) => string);
}

export function downloadCSV(filename: string, data: Dictionary[], options: DownloadCSVOptions = {}) {
    const columns = Object.keys(data[0]);
    let headers = "";
    if (options.headers) {
        if (options.headers.length !== columns.length) {
            console.warn('La cantidad de columnas de data[0] no coinciden con el de header de las opciones');
        }

        if (typeof options.headers === "function") {
            // Se ejecuta una funcion para cada key de columns
            for (let i = 0; i < columns.length; i++) {
                const result = options.headers(columns[i], i);
                if (i < columns.length - 1) {
                    headers += `${result};`;
                } else {
                    headers += result;
                }
            }
        } else if (Array.isArray(options.headers)) {
            // Se coloca el header en el mismo orden y cantidad
            headers = options.headers.join(';');
        } else {
            // eslint-disable-next-line no-throw-literal
            throw 'El tipo de options.header no es valido';
        }

    } else {
        headers = columns.join(';');
    }

    let csv = headers;
    data.forEach(dt => {
        csv += '\r\n';
        csv += Object.values(dt).join(';');
    });
    let BOM = "\uFEFF";
    var blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export const downloadJson = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function uploadCSV(file: any, owner: any = {}): Promise<Dictionary[]> {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((res, rej) => {
        reader.onload = (event: any) => {
            let csv = event.target.result.toString();
            if (csv !== null) {
                let allTextLines = csv.split(/\r\n|\n/);
                let headers = allTextLines[0].split(';');
                let lines = [];
                for (let i = 1; i < allTextLines.length; i++) {
                    if (allTextLines[i].split(';').length === headers.length) {
                        const line = allTextLines[i].split(';')
                        const data = {
                            ...headers.reduce((ad: any, key: any, j: number) => ({
                                ...ad,
                                [key]: line[j]
                            }), {}),
                            ...owner
                        }
                        lines.push(data)
                    }
                }
                res(lines);
            }
            res(null);
        };
    });
}

export function uploadExcel(file: any, owner: any = {}) {
    return new Promise((res, rej) => {
        import('xlsx').then(XLSX => {
            var reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = (event: any) => {
                var data = event.target.result;
                let workbook = XLSX.read(data, { type: 'binary' });
                const wsname = workbook.SheetNames[0];
                // const ws = workbook.Sheets[wsname];
                // sheet_to_row_object_array
                let rowsx = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
                    .map((row: any) =>
                        Object.keys(row).reduce((obj: any, key: any) => {
                            obj[key.trim()] = row[key];
                            return obj;
                        }, {})
                    );
                res(rowsx)
            };
        });
    });
}

export const dateToLocalDate = (date: string, returnType = 'string'): string | Date => {
    if (!date) return new Date().toLocaleDateString();
    const nn = new Date(date)
    const dateCleaned = new Date(nn.getTime() + (nn.getTimezoneOffset() * 60 * 1000));
    if (returnType === 'string')
        return dateCleaned.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
    else
        return dateCleaned;
}

export const todayDate = (): Date => {
    return new Date(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().substring(0, 10) + "T00:00:00");
}

export const convertLocalDate = (date: string | null | undefined, validateWithToday: boolean = false, subtractHours: boolean = true): Date => {
    if (!date) return new Date()
    const dateCleaned = new Date(date)
    // const dateCleaned = new Date(nn.getTime() + (subtractHours ? (nn.getTimezoneOffset() * 60 * 1000 * -1) : 0));
    return validateWithToday ? (dateCleaned > new Date() ? new Date() : dateCleaned) : dateCleaned;
}

export const toTime12HR = (time: string): string => {
    const [h, m] = time.split(':');
    const hint = parseInt(h)
    return `${(hint > 12 ? 24 - hint : hint).toString().padStart(2, "0")}:${m}:${hint > 11 ? "PM" : "AM"}`
}

export const toTime24HR = (time: string): string => {
    const [h, m] = time.split(':');
    const hint = parseInt(h)
    return `${hint.toString().padStart(2, "0")}:${m}`
}

export const secondsToTime = (seconds: number, format: string = "time"): string => {
    if (format === "seconds") {
        return seconds + ""
    } else if (format === "minutes") {
        return (seconds / 60).toFixed()
    } else if (format === "hours") {
        return (seconds / 3600).toFixed()
    }
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds / 60) % 60);
    const ss = Math.floor(seconds % 60);
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

export function formatCurrency(num: number) {
    if (num)
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0.00"
}

export function formatCurrencyNoDecimals(num: number) {
    if (num)
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    return "0"
}

export const getSecondsUntelNow = (date: Date, regressive: boolean = false): number => !regressive ? Math.floor((new Date().getTime() - date.getTime()) / 1000) : Math.floor((date.getTime() - new Date().getTime()) / 1000);

export const getTimeBetweenDates = (date1: Date, date2: Date): string => secondsToTime(Math.floor((date2.getTime() - date1.getTime()) / 1000));

export const getDateCleaned = (date: Date): string => new Date(date.setHours(10)).toISOString().substring(0, 10)


export const capitalize = (text: string) => {
    const lower = text.toLowerCase();
    return text.charAt(0).toUpperCase() + lower.slice(1);
}

export const object_trimmer = (data: any) => {
    if (!data) {
        return Object.keys(data).reduce((k, v) => (
            {
                ...k,
                [v]: typeof data[v] === 'string' ? data[v]?.trim() : data[v]
            }
        ), {})
    }
    else {
        return {};
    }
}

export const getDateToday = () => new Date(new Date().setHours(10));

export const getFirstDayMonth = () => new Date(new Date(new Date().setHours(10)).setDate(1));

export const getLastDayMonth = () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

export const calculateDateFromMonth = (year: number, month: number) => {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    const countDays = new Date(year, month + 1, 0).getDate();
    const dayLastDay = new Date(year, month + 1, 0).getDay();
    const dayPreviewMonth = new Date(year, month, 1).getDay();

    const daysMonth = Array.from(Array(countDays).keys()).map(x => {
        const date = new Date(year, month, x + 1);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isToday: currentDate.getTime() === date.getTime(),
            isDayPreview: date < currentDate
        }
    })

    const daysPreviewMonth = Array.from(Array(dayPreviewMonth).keys()).map(x => {
        const date = new Date(year, month, - x);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isDayPreview: date < currentDate
        }
    }).reverse()

    const daysNextMonth = Array.from(Array(6 - dayLastDay).keys()).map(x => {
        const date = new Date(year, month + 1, x + 1);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isDayPreview: date < currentDate
        }
    })

    return [...daysPreviewMonth, ...daysMonth, ...daysNextMonth];
}

export const getFormattedDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset * 60 * 1000));
    return date.toISOString().split('T')[0];
}

const transDayLocal = (day: Date) => day.getDay() - 1 < 0 ? 6 : day.getDay() - 1;

export const calculateDateFromWeek = (datex: Date) => {
    const currentDate = new Date(datex.getFullYear(), datex.getMonth(), datex.getDate())

    const dayCurrent = transDayLocal(currentDate);

    const firstDayWeek = new Date(currentDate.setDate(currentDate.getDate() - dayCurrent));

    return Array.from(Array(7).keys()).map(x => {
        const date = new Date(new Date(firstDayWeek).setDate(firstDayWeek.getDate() + x));
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isToday: currentDate.getTime() === date.getTime(),
        }
    })
}

interface Options {
    withTime?: boolean;
}


export const formatDate = (strDate: string = "", options: Options = { withTime: true }) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(typeof strDate === "number" ? strDate : strDate.replace("Z", ""));
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });
    const time = date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year}${options.withTime! ? time.split(',')[1] : ''}`;
}


export const hours = [
    { desc: "00:00", value: "00:00:00" },
    { desc: "00:30", value: "00:30:00" },
    { desc: "01:00", value: "01:00:00" },
    { desc: "01:30", value: "01:30:00" },
    { desc: "02:00", value: "02:00:00" },
    { desc: "02:30", value: "02:30:00" },
    { desc: "03:00", value: "03:00:00" },
    { desc: "03:30", value: "03:30:00" },
    { desc: "04:00", value: "04:00:00" },
    { desc: "04:30", value: "04:30:00" },
    { desc: "05:00", value: "05:00:00" },
    { desc: "05:30", value: "05:30:00" },
    { desc: "06:00", value: "06:00:00" },
    { desc: "06:30", value: "06:30:00" },
    { desc: "07:00", value: "07:00:00" },
    { desc: "07:30", value: "07:30:00" },
    { desc: "08:00", value: "08:00:00" },
    { desc: "08:30", value: "08:30:00" },
    { desc: "09:00", value: "09:00:00" },
    { desc: "09:30", value: "09:30:00" },
    { desc: "10:00", value: "10:00:00" },
    { desc: "10:30", value: "10:30:00" },
    { desc: "11:00", value: "11:00:00" },
    { desc: "11:30", value: "11:30:00" },
    { desc: "12:00", value: "12:00:00" },
    { desc: "12:30", value: "12:30:00" },
    { desc: "13:00", value: "13:00:00" },
    { desc: "13:30", value: "13:30:00" },
    { desc: "14:00", value: "14:00:00" },
    { desc: "14:30", value: "14:30:00" },
    { desc: "15:00", value: "15:00:00" },
    { desc: "15:30", value: "15:30:00" },
    { desc: "16:00", value: "16:00:00" },
    { desc: "16:30", value: "16:30:00" },
    { desc: "17:00", value: "17:00:00" },
    { desc: "17:30", value: "17:30:00" },
    { desc: "18:00", value: "18:00:00" },
    { desc: "18:30", value: "18:30:00" },
    { desc: "19:00", value: "19:00:00" },
    { desc: "19:30", value: "19:30:00" },
    { desc: "20:00", value: "20:00:00" },
    { desc: "20:30", value: "20:30:00" },
    { desc: "21:00", value: "21:00:00" },
    { desc: "21:30", value: "21:30:00" },
    { desc: "22:00", value: "22:00:00" },
    { desc: "22:30", value: "22:30:00" },
    { desc: "23:00", value: "23:00:00" },
    { desc: "23:30", value: "23:30:00" },
]

export const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

export const dayNames2 = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
]

export const validateIsUrl = (text: string) => {
    if (!text)
        return text;

    const sanitizedHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const regx = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    const matches = sanitizedHTML.match(regx);
    if (!matches || matches.length === 0)
        return sanitizedHTML.replace(/%(?=[A-Za-z0-9])/g, '% ');
    const replaces = matches?.reduce((acc, item, index) => acc.replace(item, `<a href="###${index}###" target="_BLANK">###${index}###</a>`), text) || text
    return matches?.reduce((acc, item, index) => acc.replace(new RegExp(`###${index}###`, 'g'), item), replaces) || text
}

export function encrypt(plaintext:string, key:string) {
    let ciphertext = '';
    for (let i = 0; i < plaintext.length; i++) {
        const charCode = plaintext.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        ciphertext += String.fromCharCode(charCode);
    }
    return btoa(ciphertext);
}

export function decrypt(ciphertext:string, key:string) {
    ciphertext = atob(ciphertext);
    let plaintext = '';
    for (let i = 0; i < ciphertext.length; i++) {
        const charCode = ciphertext.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        plaintext += String.fromCharCode(charCode);
    }
    return plaintext;
}