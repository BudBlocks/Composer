/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NoteService } from './Note.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Note',
	templateUrl: './Note.component.html',
	styleUrls: ['./Note.component.css'],
  providers: [NoteService]
})
export class NoteComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          ID = new FormControl("", Validators.required);
        
  
      
          sender = new FormControl("", Validators.required);
        
  
      
          recipient = new FormControl("", Validators.required);
        
  
      
          field = new FormControl("", Validators.required);
        
  
      
          amount = new FormControl("", Validators.required);
        
  
      
          expiration_date = new FormControl("", Validators.required);
        
  
      
          date_sent = new FormControl("", Validators.required);
        
  


  constructor(private serviceNote:NoteService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          ID:this.ID,
        
    
        
          sender:this.sender,
        
    
        
          recipient:this.recipient,
        
    
        
          field:this.field,
        
    
        
          amount:this.amount,
        
    
        
          expiration_date:this.expiration_date,
        
    
        
          date_sent:this.date_sent
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceNote.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.budblocks.Note",
      
        
          "ID":this.ID.value,
        
      
        
          "sender":this.sender.value,
        
      
        
          "recipient":this.recipient.value,
        
      
        
          "field":this.field.value,
        
      
        
          "amount":this.amount.value,
        
      
        
          "expiration_date":this.expiration_date.value,
        
      
        
          "date_sent":this.date_sent.value
        
      
    };

    this.myForm.setValue({
      
        
          "ID":null,
        
      
        
          "sender":null,
        
      
        
          "recipient":null,
        
      
        
          "field":null,
        
      
        
          "amount":null,
        
      
        
          "expiration_date":null,
        
      
        
          "date_sent":null
        
      
    });

    return this.serviceNote.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "ID":null,
        
      
        
          "sender":null,
        
      
        
          "recipient":null,
        
      
        
          "field":null,
        
      
        
          "amount":null,
        
      
        
          "expiration_date":null,
        
      
        
          "date_sent":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.budblocks.Note",
      
        
          
        
    
        
          
            "sender":this.sender.value,
          
        
    
        
          
            "recipient":this.recipient.value,
          
        
    
        
          
            "field":this.field.value,
          
        
    
        
          
            "amount":this.amount.value,
          
        
    
        
          
            "expiration_date":this.expiration_date.value,
          
        
    
        
          
            "date_sent":this.date_sent.value
          
        
    
    };

    return this.serviceNote.updateAsset(form.get("ID").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceNote.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceNote.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "ID":null,
          
        
          
            "sender":null,
          
        
          
            "recipient":null,
          
        
          
            "field":null,
          
        
          
            "amount":null,
          
        
          
            "expiration_date":null,
          
        
          
            "date_sent":null 
          
        
      };



      
        if(result.ID){
          
            formObject.ID = result.ID;
          
        }else{
          formObject.ID = null;
        }
      
        if(result.sender){
          
            formObject.sender = result.sender;
          
        }else{
          formObject.sender = null;
        }
      
        if(result.recipient){
          
            formObject.recipient = result.recipient;
          
        }else{
          formObject.recipient = null;
        }
      
        if(result.field){
          
            formObject.field = result.field;
          
        }else{
          formObject.field = null;
        }
      
        if(result.amount){
          
            formObject.amount = result.amount;
          
        }else{
          formObject.amount = null;
        }
      
        if(result.expiration_date){
          
            formObject.expiration_date = result.expiration_date;
          
        }else{
          formObject.expiration_date = null;
        }
      
        if(result.date_sent){
          
            formObject.date_sent = result.date_sent;
          
        }else{
          formObject.date_sent = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "ID":null,
        
      
        
          "sender":null,
        
      
        
          "recipient":null,
        
      
        
          "field":null,
        
      
        
          "amount":null,
        
      
        
          "expiration_date":null,
        
      
        
          "date_sent":null 
        
      
      });
  }

}
