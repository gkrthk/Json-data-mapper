import { JsonMapper } from '../index';
describe('test suite', ()=>{
    let mapper:any;
    beforeEach(()=>{
        mapper = new JsonMapper();
    });
    afterEach(() => {
        mapper = null;
    })

    test('format json to Obj schema', () => {
        let data = {
            name: "user",
            template: "test Template"
        }
        let schema = {
            format: {
                "label": {
                    sourceField:"name"
                },
                "data": {
                    sourceField :"template"
                },
                "transform":{
                    sourceField: "(name,template)=>{return name+' has '+template;}",
                    type:"FUNCTION"
                } 
            }
        }
        let resp = mapper.formatToSchema(schema, data);
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
            data:'',
            format: {
                "label": {
                    sourceField:"name"
                },
                "data": {
                    sourceField :"template"
                },
                "transform":{
                    sourceField: "(name,template)=>{return name+' having '+template;}",
                    type:"function"
                } 
            }
        }
        let resp = mapper.formatToSchema(schema, data);
        console.log(resp);
        expect(resp).toEqual([{ label: 'user', data: 'test Template', transform: "user having test Template"}]);
    });
});

