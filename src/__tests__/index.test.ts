import { formatToSchema } from '../index';

test('format json to Obj schema', () => {
    let data = {
        name: "kartg",
        template: "test Template"
    }
    let schema = {
        format: {
            "label": {
                dataField:"name"
            },
            "OpenCases": {
                dataField :"template"
            },
            "transform":{
                dataField: "(name,template)=>{return name+'%%'+template;}",
                type:"FUNCTION"
            } 
        }
    }
    let resp = formatToSchema(schema, data);
    console.log(resp);
    expect(resp).toEqual({ label: 'kartg', OpenCases: 'test Template',transform: "kartg%%test Template" });
});

test('format json to List schema', () => {
    let data = {
        name: "kartg",
        template: "test Template"
    }
    let schema = {
        isList:true,
        ObjectToFormatFromData:'',
        format: {
            "label": {
                dataField:"name"
            },
            "OpenCases": {
                dataField :"template"
            },
            "transform":{
                dataField: "(name,template)=>{return name+'%%'+template;}",
                type:"function"
            } 
        }
    }
    let resp = formatToSchema(schema, data);
    console.log(resp);
    expect(resp).toEqual([{ label: 'kartg', OpenCases: 'test Template', transform: "kartg%%test Template"}]);
});