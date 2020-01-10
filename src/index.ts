import { getParameterNames } from './getParamNames';
export const formatToSchema = (schema: any, data: any) => {
    if (invalidSchema(schema) || !data) {
        return;
    }
    if (schema.ObjectToFormatFromData) {
        data = data[schema.ObjectToFormatFromData];
    }
    if (checkIfSchemaIsList(schema)) {
        return formatAsList(schema.format, data);
    } else {
        return formatAsObj(schema.format, data);
    }
}

/* 
 * Mapper to format Json to Object schema.
*/
const formatAsObj = (schema: any, data: any) => {
    if (Array.isArray(data)) {
        data = data[0]; // Taking 1st object in array if data passed is array and schema is not list.
    }
    const keys = Object.keys(schema);
    let resp = formatter(keys, schema, data);
    return resp;
}


/* 
 * Mapper to format Json to List schema.
*/
const formatAsList = (schema: any, data: any) => {
    if (!Array.isArray(data)) {
        data = [data];
    }
    const keys = Object.keys(schema);
    return data.map((item: any) => {
        return formatter(keys, schema, item);
    });
}

/* 
 * Processor Function which returns single transformed object. 
*/
const formatter = (keys: any, schema: any, data: any) => {
    const regex = /\$/g;
    let obj = {};
    keys.forEach((key: any) => {
        let dataField = schema[key].dataField;
        if (schema[key].type && schema[key].type.toUpperCase() === 'FUNCTION') {
            dataField = new Function(`return ${dataField}`)();
            obj = { ...obj, [key]: transformFn(dataField, getParamsForTransformFn(dataField, data)) };
        } else {
            if (Array.isArray(dataField)) {
                let item = JSON.stringify(dataField);
                let mapFields = JSON.parse(item.replace(/\$/g, ""));
                obj = { ...obj, [key]: mapMultipleFields(mapFields, data) }
            }
            else {
                let mapField = dataField.replace(regex, "");
                obj = { ...obj, [key]: data[mapField] };
            }
        }
    });
    return obj;
}

const invalidSchema = (schema: any) => {
    return !schema || !schema.format;
}

const checkIfSchemaIsList = (schema: any) => {
    return schema.isList;
}

const mapMultipleFields = (fields: any, item: any) => {
    let dataset: any = [];
    fields.forEach((ele: any) => {
        if (ele instanceof Function) {
            dataset.push(transformFn(ele, getParamsForTransformFn(ele, item)));
        } else {
            dataset.push(item[ele]);
        }
    });
    return dataset;
}

const getParamsForTransformFn = (fn: Function, data: any) => {
    return getParameterNames(fn).map((param: any) => {
        return data[param];
    });
}

const transformFn = (fn: Function, params: Array<any>) => {
    return fn.apply(fn, params);
}

