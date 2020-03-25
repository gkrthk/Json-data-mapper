# Json-data-mapper

## Introduction

Single page applications will have JSON responses from the middleware API's. Most of the time we definitely require an adapter layer to transform data from API as needed by the UI layer. This module provides a single adaptive layer which will transform the JSON received from API to the UI required format. This is a native typescript module.

## Get Started

  `npm i json-data-mapper --save`
  
## How To Use
  
  Specify the JSON Schema to which the data has to be transformed in a Json file, in the below format
  
  ```
  
  {
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
                dataField: "(name,template)=>{return name+'%%'+template;}",
                type:"FUNCTION"
            } 
        }
   }
   
   ```
 ### Build Schema
  - The `isList` property tells whether the output Json should be a list.
  - You can set `ObjectToFormatFromData` property to any object from the API response and the library will process the data only in that object specified, omitting all other objects in the API response.
  - The `format` object contains the actual format in which the data mapping has to be done.
    * Each `key` represents a property in the output Json.
    * `dataField` property should be the key of the value to be processed from the API data. This can also accept a transform fn in which case the parameters to the function should be the keys of the value to be processed from the API data. You can pass a complete function as a string as shown in the sample.
    * `type` property should be set to `FUNCTION` if the dataField is provided with a transform function, else it need not be set.

 ### Implementation
  In your application
  
  ``` 
  import { formatToSchema } from 'json-data-mapper';
  
  const transformedData = formatToSchema(schema, data);
  ```
  
 Using this library you can maintain all your transforms in a single JSON file and let the library do the data mapping for all the API's. if the API layer changes the JSON schema alone has to be tweaked as per needs avoiding any code change in the UI layer.

 ### Example

 This is a sample schema 

 ```
 {
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
          dataField: "(name,template)=>{return name+' has '+template;}",
          type:"function"
      } 
    }
  }
 
 ```
 Input Data

 ```
  {
    name: "user",
    template: "test Template"
  }
 ```
 Transformed Data

 ```
  { 
    label: 'user',
    data: 'test Template',
    transform: 'user has test Template' 
  }
 ```


 ## Contributor
  [@gkrthk](https://github.com/gkrthk)
