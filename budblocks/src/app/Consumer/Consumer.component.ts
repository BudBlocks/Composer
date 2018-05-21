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
import { ConsumerService } from './Consumer.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Consumer',
	templateUrl: './Consumer.component.html',
	styleUrls: ['./Consumer.component.css'],
  providers: [ConsumerService]
})
export class ConsumerComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
	private errorMessage;

  
      
          ID = new FormControl("", Validators.required);
        
  
      
          name = new FormControl("", Validators.required);
        
  
      
          balance = new FormControl("", Validators.required);
        
  
      
          notes_sent = new FormControl("", Validators.required);
        
  
      
          notes = new FormControl("", Validators.required);
        
  
      
          outgoing_notes = new FormControl("", Validators.required);
        
  
      
          earliest_note = new FormControl("", Validators.required);
        
  
      
          times_overdue = new FormControl("", Validators.required);
        
  
      
          average_time_overdue = new FormControl("", Validators.required);
        
  


  constructor(private serviceConsumer:ConsumerService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          ID:this.ID,
        
    
        
          name:this.name,
        
    
        
          balance:this.balance,
        
    
        
          notes_sent:this.notes_sent,
        
    
        
          notes:this.notes,
        
    
        
          outgoing_notes:this.outgoing_notes,
        
    
        
          earliest_note:this.earliest_note,
        
    
        
          times_overdue:this.times_overdue,
        
    
        
          average_time_overdue:this.average_time_overdue
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceConsumer.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
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
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: "org.budblocks.Consumer",
      
        
          "ID":this.ID.value,
        
      
        
          "name":this.name.value,
        
      
        
          "balance":this.balance.value,
        
      
        
          "notes_sent":this.notes_sent.value,
        
      
        
          "notes":this.notes.value,
        
      
        
          "outgoing_notes":this.outgoing_notes.value,
        
      
        
          "earliest_note":this.earliest_note.value,
        
      
        
          "times_overdue":this.times_overdue.value,
        
      
        
          "average_time_overdue":this.average_time_overdue.value
        
      
    };

    this.myForm.setValue({
      
        
          "ID":null,
        
      
        
          "name":null,
        
      
        
          "balance":null,
        
      
        
          "notes_sent":null,
        
      
        
          "notes":null,
        
      
        
          "outgoing_notes":null,
        
      
        
          "earliest_note":null,
        
      
        
          "times_overdue":null,
        
      
        
          "average_time_overdue":null
        
      
    });

    return this.serviceConsumer.addParticipant(this.participant)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "ID":null,
        
      
        
          "name":null,
        
      
        
          "balance":null,
        
      
        
          "notes_sent":null,
        
      
        
          "notes":null,
        
      
        
          "outgoing_notes":null,
        
      
        
          "earliest_note":null,
        
      
        
          "times_overdue":null,
        
      
        
          "average_time_overdue":null 
        
      
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: "org.budblocks.Consumer",
      
        
          
        
    
        
          
            "name":this.name.value,
          
        
    
        
          
            "balance":this.balance.value,
          
        
    
        
          
            "notes_sent":this.notes_sent.value,
          
        
    
        
          
            "notes":this.notes.value,
          
        
    
        
          
            "outgoing_notes":this.outgoing_notes.value,
          
        
    
        
          
            "earliest_note":this.earliest_note.value,
          
        
    
        
          
            "times_overdue":this.times_overdue.value,
          
        
    
        
          
            "average_time_overdue":this.average_time_overdue.value
          
        
    
    };

    return this.serviceConsumer.updateParticipant(form.get("ID").value,this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceConsumer.deleteParticipant(this.currentId)
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

    return this.serviceConsumer.getparticipant(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "ID":null,
          
        
          
            "name":null,
          
        
          
            "balance":null,
          
        
          
            "notes_sent":null,
          
        
          
            "notes":null,
          
        
          
            "outgoing_notes":null,
          
        
          
            "earliest_note":null,
          
        
          
            "times_overdue":null,
          
        
          
            "average_time_overdue":null 
          
        
      };



      
        if(result.ID){
          
            formObject.ID = result.ID;
          
        }else{
          formObject.ID = null;
        }
      
        if(result.name){
          
            formObject.name = result.name;
          
        }else{
          formObject.name = null;
        }
      
        if(result.balance){
          
            formObject.balance = result.balance;
          
        }else{
          formObject.balance = null;
        }
      
        if(result.notes_sent){
          
            formObject.notes_sent = result.notes_sent;
          
        }else{
          formObject.notes_sent = null;
        }
      
        if(result.notes){
          
            formObject.notes = result.notes;
          
        }else{
          formObject.notes = null;
        }
      
        if(result.outgoing_notes){
          
            formObject.outgoing_notes = result.outgoing_notes;
          
        }else{
          formObject.outgoing_notes = null;
        }
      
        if(result.earliest_note){
          
            formObject.earliest_note = result.earliest_note;
          
        }else{
          formObject.earliest_note = null;
        }
      
        if(result.times_overdue){
          
            formObject.times_overdue = result.times_overdue;
          
        }else{
          formObject.times_overdue = null;
        }
      
        if(result.average_time_overdue){
          
            formObject.average_time_overdue = result.average_time_overdue;
          
        }else{
          formObject.average_time_overdue = null;
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
        
      
        
          "name":null,
        
      
        
          "balance":null,
        
      
        
          "notes_sent":null,
        
      
        
          "notes":null,
        
      
        
          "outgoing_notes":null,
        
      
        
          "earliest_note":null,
        
      
        
          "times_overdue":null,
        
      
        
          "average_time_overdue":null 
        
      
      });
  }

}
