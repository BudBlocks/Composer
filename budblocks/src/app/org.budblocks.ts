import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.budblocks{
   export class Consumer extends Participant {
      ID: string;
      name: string;
      balance: number;
      notes_sent: number;
      notes: Note[];
      outgoing_notes: Note[];
      earliest_note: Note;
      times_overdue: number;
      average_time_overdue: number;
   }
   export class Note extends Asset {
      ID: string;
      sender: Consumer;
      recipient: Consumer;
      field: string;
      amount: number;
      expiration_date: Date;
      date_sent: Date;
   }
   export class addBalance extends Transaction {
      recipient: Consumer;
      amount: number;
   }
   export class removeBalance extends Transaction {
      recipient: Consumer;
      amount: number;
   }
   export class sendNote extends Transaction {
      sender: Consumer;
      recipient: Consumer;
      amount: number;
      field: string;
      expiration_date: Date;
   }
   export class resolveNote extends Transaction {
      note: Note;
   }
   export class AccountFrozen extends Event {
      field: string;
      recipient_name: string;
      amount: number;
      expiration_date: Date;
      date_sent: Date;
   }
   export class BalanceTooLow extends Event {
      balance: number;
      amount: number;
   }
   export class NoteResolved extends Event {
      field: string;
      recipient_name: string;
      amount: number;
      expiration_date: Date;
      date_sent: Date;
   }
   export class NotePaid extends Event {
      field: string;
      sender_name: string;
      amount: number;
      expiration_date: Date;
      date_sent: Date;
   }
   export class AccountFreeze extends Event {
      field: string;
      recipient_name: string;
      amount: number;
      expiration_date: Date;
      date_sent: Date;
   }
   export class NoteOverdue extends Event {
      field: string;
      sender_name: string;
      amount: number;
      expiration_date: Date;
      date_sent: Date;
   }
   export class NoteSent extends Event {
      field: string;
      recipient_name: string;
      amount: number;
      expiration_date: Date;
      date_sent: Date;
   }
   export class NoteReceived extends Event {
      field: string;
      sender_name: string;
      amount: number;
      expiration_date: Date;
      date_sent: Date;
   }
// }
