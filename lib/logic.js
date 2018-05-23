/**
 * add balance to a consumer's balance
 * @param {org.budblocks.addBalance} trade - the trade to be processed
 * @transaction
 */
async function addBalance(trade) {
    let participantRegistry = await getParticipantRegistry('org.budblocks.Consumer');
    let recipient = await participantRegistry.get(trade.recipient);
    recipient.balance += trade.amount;
    await participantRegistry.update(trade.recipient);
}

/**
 * remove balance from a consumer's balance
 * @param {org.budblocks.removeBalance} trade - the trade to be processed
 * @transaction
 */
async function removeBalance(trade) {
    let participantRegistry = await getParticipantRegistry('org.budblocks.Consumer');
    let recipient = await participantRegistry.get(trade.recipient);
    if (trade.amount > recipient.balance) {
        let factory = getFactory();
        let event = factory.newEvent('org.budblocks', 'BalanceTooLow');
        event.balance = recipient.balance;
        event.amount = trade.amount;
        emit(event);
        return;
    }
    recipient.balance -= trade.amount;
    await participantRegistry.update(recipient);
}

/**
 * create and send a note
 * @param {org.budblocks.sendNote} trade - the trade to be processed
 * @transaction
 */
async function sendNote(trade) {  // TODO fix all the datetime stuff with the removal of Relationships
    let participantRegistry = await getParticipantRegistry('org.budblocks.Consumer');
    let assetRegistry = await getAssetRegistry('org.budblocks.Note');
    let sender = await participantRegistry.get(trade.sender);
    let recipient = await participantRegistry.get(trade.recipient);
    //emit event if the sender account is frozen
    let execute = true;
    if (sender.earliest_note != null) {
        let earliest_note = await assetRegistry.get(sender.earliest_note);
        if (earliest_note.expiration_date.getTime() < trade.timestamp.getTime()) {
            let factory = getFactory();
            let event = factory.newEvent('org.budblocks', 'AccountFrozen');
            event.field = earliest_note.field;
            let recipient = await participantRegistry.get(earliest_note.recipient);
            event.recipient_name = recipient.name;
            event.amount = earliest_note.amount;
            event.expiration_date = earliest_note.expiration_date;
            event.date_sent = earliest_note.date_sent;
            emit(event);
            execute = false;
        }
    }
    if (execute) {
        //get the factory and subID of the new note
        let this_note = sender.notes_sent++;
        let factory = getFactory();

        //create the new note
        let new_note = factory.newResource('org.budblocks', 'Note', sender.ID.concat('.').concat(this_note.toString()));
        new_note.sender = factory.newRelationship('org.budblocks', 'Consumer', sender.ID);
        new_note.recipient = factory.newRelationship('org.budblocks', 'Consumer', recipient.ID);
        new_note.field = trade.field;
        new_note.amount = trade.amount;
        new_note.expiration_date = trade.expiration_date;
        new_note.date_sent = trade.timestamp;

        // add the note to the asset registry
        await assetRegistry.add(new_note);
        
        //add the new note to the sender and receiver's notes and outgoing notes
        recipient.notes.push(factory.newRelationship('org.budblocks', 'Note', new_note.ID));
        sender.outgoing_notes.push(factory.newRelationship('org.budblocks', 'Note', new_note.ID));

        //check if the note is now the new earliest note
        if (sender.earliest_note == null) {
            sender.earliest_note = sender.outgoing_notes[sender.outgoing_notes.length-1];
        }
        else {
            let earliest_note = await assetRegistry.get(sender.earliest_note);
            if (new_note.expiration_date.getTime() < earliest_note.expiration_date.getTime()) {
                sender.earliest_note = sender.outgoing_notes[sender.outgoing_notes.length-1];
            }
        }

        //update the Consumer participant registry
        await participantRegistry.update(sender);
        await participantRegistry.update(recipient);

        //emit events to sender and recipient
        let event = factory.newEvent('org.budblocks', 'NoteSent');
        event.field = new_note.field;
        event.recipient_name = recipient.name;
        event.amount = new_note.amount;
        event.expiration_date = new_note.expiration_date;
        event.date_sent = new_note.date_sent;
        emit(event);
        event = factory.newEvent('org.budblocks', 'NoteReceived');
        event.field = new_note.field;
        event.sender_name = sender.name;
        event.amount = new_note.amount;
        event.expiration_date = new_note.expiration_date;
        event.date_sent = new_note.date_sent;
        emit(event);
    }
}

/**
 * resolve a note
 * @param {org.budblocks.resolveNote} trade - the trade to be processed
 * @transaction
 */
async function resolveNote(trade) {  // TODO add an update to the users dual credit score if the due date of the note has passed
    let assetRegistry = await getAssetRegistry('org.budblocks.Note');
    let note = await assetRegistry.get(trade.note);
    let participantRegistry = await getParticipantRegistry('org.budblocks.Consumer');
    let sender = await participantRegistry.get(note.sender);
    let recipient = await participantRegistry.get(note.recipient);

    // make sure you can actually resolve the note with your current balance
    if (sender.balance < note.amount) {
        let factory = getFactory();
        let event = factory.newEvent('org.budblocks', 'BalanceTooLow');
        event.balance = sender.balance;
        event.amount = note.amount;
        emit(event);
        return;
    }

    // update the sender and receiver balances, and remove the note from the registry
    sender.balance -= note.amount;
    recipient.balance += note.amount;
    sender.outgoing_notes.splice(sender.outgoing_notes.indexOf(trade.note), 1);
    recipient.notes.splice(recipient.notes.indexOf(trade.note), 1);
    await participantRegistry.update(sender);
    await participantRegistry.update(recipient);
    await assetRegistry.remove(trade.note);

    // check if the note that sender just resolved was the one closest to expiration, and change if it was
    if (trade.note == sender.earliest_note) {
        if (sender.outgoing_notes.length == 0) {
            sender.earliest_note = null;
        }
        else {
            let new_earliest = await assetRegistry.get(sender.outgoing_notes[0]);
            let new_earliest_i = 0;
            for (i = 0; i < sender.outgoing_notes.length; i++) {
                let other_note = await assetRegistry.get(sender.outgoing_notes[i]);
                if (new_earliest.expiration_date.getTime() > other_note.expiration_date.getTime()) {
                    new_earliest = sender.outgoing_notes[i];
                    new_earliest_i = i;
                }
            }
            sender.earliest_note = sender.outgoing_notes[new_earliest_i];
            await participantRegistry.update(sender);
        }
    }

    // create events for resolving the note, which goes to you, and paying the note which goes to the recipient
    let factory = getFactory();
    let event = factory.newEvent('org.budblocks', 'NoteResolved');
    event.field = note.field;
    event.recipient_name = recipient.name;
    event.amount = note.amount;
    event.expiration_date = note.expiration_date;
    event.date_sent = note.date_sent;
    emit(event);
    event = factory.newEvent('org.budblocks', 'NotePaid');
    event.field = note.field;
    event.sender_name = sender.name;
    event.amount = note.amount;
    event.expiration_date = note.expiration_date;
    event.date_sent = note.date_sent;
    emit(event);
}
