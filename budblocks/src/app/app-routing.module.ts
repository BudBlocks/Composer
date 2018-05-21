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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { TransactionComponent } from './Transaction/Transaction.component'
import { HomeComponent } from './home/home.component';

import { NoteComponent } from './Note/Note.component';


  import { ConsumerComponent } from './Consumer/Consumer.component';


  import { addBalanceComponent } from './addBalance/addBalance.component';
  import { removeBalanceComponent } from './removeBalance/removeBalance.component';
  import { sendNoteComponent } from './sendNote/sendNote.component';
  import { resolveNoteComponent } from './resolveNote/resolveNote.component';  
const routes: Routes = [
     //{ path: 'transaction', component: TransactionComponent },
    {path: '', component: HomeComponent},
		
		{ path: 'Note', component: NoteComponent},
    
    
      { path: 'Consumer', component: ConsumerComponent},
      
      
        { path: 'addBalance', component: addBalanceComponent},
        
        { path: 'removeBalance', component: removeBalanceComponent},
        
        { path: 'sendNote', component: sendNoteComponent},
        
        { path: 'resolveNote', component: resolveNoteComponent},
        
		{path: '**', redirectTo:''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
