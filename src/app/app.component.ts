import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  schema: object = {
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
              title: "Address Line 1"
            },
            line2: {
              type: "string",
              title: "Address Line 2"
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

  value: object = {}
}
