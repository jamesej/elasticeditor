import { SchemaSource } from './data-abstractions/schema-source';

export class AppSchemaSource extends SchemaSource {
    constructor() {
        super();
        this.schemas = {
            'table': this.schema,
            'conditional': this.schema3,
            'complex': this.schema2
        }
    }

    schema: object = {
        title: 'List',
        type: "array",
        format: "table",
        items: {
          type: "object",
          properties: {
            propA: {
              type: "string"
            },
            propB: {
              type: "string"
            }
          }
        }
      };
    
      schema3: object = {
        title: "Test Conditional",
        type: "object",
        properties: {
          switch1: {
            type: "boolean",
            editor: "boolean-switch"
          },
          switch2: {
            type: "string",
            enum: ["propA", "propB"]
          }
        },
        allOf: [{
          if: {
            type: 'object',
            properties: {
              switch1: {
                type: "boolean",
                const: true
              }
            }
          },
          then: {
            type: 'object',
            properties: {
              depProp: {
                type: "string"
              }
            }
          }
        },{
          if: {
            type: 'object',
            properties: {
              switch2: {
                type: 'string',
                const: 'propA'
              }
            }
          },
          then: {
            type: 'object',
            properties: {
              propA: {
                type: 'string'
              }
            }
          },
          else: {
            type: 'object',
            properties: {
              propB: {
                type: 'string',
                format: 'date'
              }
            }
          }
        }]
      };
      schema2: object = {
        title: "Contact Details",
        type: "object",
        required: ['personTitle', 'firstName', 'surname'],
        properties: {
          personTitle: {
            title: "Title",
            type: "string",
            enum: [ "Mr", "Ms", "Mrs", "Miss", "Dr" ]
          },
          firstName: {
            title: "First Name",
            type: "string"
          },
          surname: {
            title: "Surname",
            type: "string"
          },
          dateOfBirth: {
            title: "Date of Birth",
            type: "string",
            format: "date"
          },
          addresses: {
            type: "array",
            items: {
              type: "object",
              properties: {
                line1: {
                  type: "string",
                  title: "Address 1"
                },
                line2: {
                  type: "string",
                  title: "Address 2"
                },
                townCity: {
                  type: "string",
                  title: "Town/City"
                },
                postcode: {
                  type: "string",
                  title: "Postcode",
                  pattern: "[A-Z]{1,2}[0-9][0-9A-Z]?\\s?[0-9][A-Z]{2}"
                }
              }
            }
          }
        }
    }
}