import { formatToSchema } from '../index';

test('format json to Obj schema', () => {
    let data = {
        name: "user",
        template: "test Template"
    }
    let schema = {
        format: {
            "label": {
                dataField:"name"
            },
            "data": {
                dataField :"template"
            },
            "transform":{
                dataField: "(name,template)=>{return name+' has '+template;}",
                type:"FUNCTION"
            } 
        }
    }
    let resp = formatToSchema(schema, data);
    console.log(resp);
    expect(resp).toEqual({ label: 'user', data: 'test Template',transform: "user has test Template" });
});

test('format json to List schema', () => {
    let data = {
        name: "user",
        template: "test Template"
    }
    let schema = {
        isList:true,
        ObjectToFormatFromData:'',
        format: {
            "label": {
                dataField:"name"
            },
            "data": {
                dataField :"template"
            },
            "transform":{
                dataField: "(name,template)=>{return name+' having '+template;}",
                type:"function"
            } 
        }
    }
    let resp = formatToSchema(schema, data);
    console.log(resp);
    expect(resp).toEqual([{ label: 'user', data: 'test Template', transform: "user having test Template"}]);
});