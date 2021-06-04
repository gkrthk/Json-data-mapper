import  { Types } from './types';

export class JsonMapper{
    public static formatToSchema(schema: any, data: any) {
        if (this.invalidSchema(schema) || !data) {
            return;
        }
        if (schema.data) {
            data = data[schema.data];
        }
        if (this.checkIfSchemaIsList(schema)) {
            return this.formatAsList(schema.format, data);
        } else {
            return this.formatAsObj(schema.format, data);
        }
    }

    private static COMMENTS:any = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    private static DEFAULT_PARAMS:any = /=[^,]+/mg;
    private static FAT_ARROWS:any = /=>.*$/mg;

    /* 
    * Mapper to format Json to Object schema.
    */
    private static formatAsObj(schema: any, data: any) {
        if (Array.isArray(data)) {
            data = data[0]; // Taking 1st object in array if data passed is array and schema is not list.
        }
        const keys = Object.keys(schema);
        return this.formatter(keys, schema, data);    
    }

    /* 
    * Mapper to format Json to List schema.
    */
    private static formatAsList (schema: any, data: any) {
        if (!Array.isArray(data)) {
            data = [data];
        }
        const keys = Object.keys(schema);
        return data.map((item: any) => {
            return this.formatter(keys, schema, item);
        });
    }

    /* 
     * Processor Function which returns single transformed object. 
    */
    private static formatter (keys: any, schema: any, data: any) {
        const regex = /\$/g;
        let obj = {};
        keys.forEach((key: any) => {
            let dataField= schema[key].sourceField;
            if (schema[key].type && schema[key].type.toUpperCase() === Types.FUNCTION) {
                dataField = new Function(`return ${dataField}`)();
                obj = { ...obj, [key]: this.transformFn(dataField, this.getParamsForTransformFn(dataField, data)) };
            } else {
                if (Array.isArray(dataField)) {
                    const item = JSON.stringify(dataField);
                    const mapFields = JSON.parse(item.replace(/\$/g, ""));
                    obj = { ...obj, [key]: this.mapMultipleFields(mapFields, data) }
                }
                else {
                    const mapField = dataField.replace(regex, "");
                    obj = { ...obj, [key]: data[mapField] };
                }
            }
        });
        return obj;
    }

    private static invalidSchema (schema: any) {
        return !schema || !schema.format;
    }

    private static checkIfSchemaIsList (schema: any) {
        return schema.isList;
    }

    private static mapMultipleFields (fields: any, item: any) {
        const dataset: any = [];
        fields.forEach((ele: any) => {
            if (ele instanceof Function) {
                dataset.push(this.transformFn(ele, this.getParamsForTransformFn(ele, item)));
            } else {
                dataset.push(item[ele]);
            }
        });
        return dataset;
    }

    private static getParamsForTransformFn(fn: any, data: any) {

        return this.getParameterNames(fn).map((param: any) => {
            return data[param];
        });
    }

    private static transformFn(fn: any, params: any[]){
        return fn.apply(fn, params);
    }


    private static getParameterNames(fn:any){
        const code = fn.toString().replace(this.COMMENTS, '').replace(this.FAT_ARROWS, '').replace(this.DEFAULT_PARAMS, '');
        const result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
        return result === null ? [] : result;
    }
    
}










