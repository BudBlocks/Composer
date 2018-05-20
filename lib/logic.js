/**
 * add balance to a consumer's balance
 * @param {org.budblocks.addBalance} trade - the trade to be processed
 * @transaction
 */
async function addBalance(trade) {
    trade.recipient.balance += trade.amount;
    let participantRegistry = await getParticipantRegistry('org.Consumer');
    await participantRegistry.update(trade.recipient);
}

/**
 * remove balance from a consumer's balance
 * @param {org.budblocks.removeBalance} trade - the trade to be processed
 * @transaction
 */
async function removeBalance(trade) {
    if (trade.amount > trade.recipient.balance) {
        let factory = getFactory();
        let event = factory.newEvent('org.budblocks', 'BalanceTooLow');
        event.balance = recipient.balance;
        event.amount = trade.amount;
        emit(event);
        return;
    }
    trade.recipient.balance -= trade.amount;
    let participantRegistry = await getParticipantRegistry('org.Consumer');
    await participantRegistry.update(trade.recipient);
}

/**
 * create and send a note
 * @param {org.budblocks.sendNote} trade - the trade to be processed
 * @transaction
 */
async function sendNote(trade) {
    //emit event if the sender account is frozen
    if (trade.sender.earliest_note.send_date.getTime() < new Date().getTime()) {
        let factory = getFactory();
        let event = factory.newEvent('org.budblocks', 'AccountFrozen');
        event.field = trade.sender.overdue_notes[0].field;
        event.recipient_name = trade.sender.overdue_notes[0].recipient.name;
        event.amount = trade.sender.overdue_notes[0].amount;
        event.expiration_date = trade.sender.overdue_notes[0].expiration_date;
        event.date_sent = trade.sender.overdue_notes[0].date_sent;
        emit(event);
        return;
    }

    //get the factory and subID of the new note
    var this_note = trade.sender.notes_sent++;
    var factory = getFactory();

    //create the new note
    var new_note = factory.newResource('org.budblocks', 'Note', trade.sender.ID.concat(this_note.toString()));
    new_note.sender = factory.newRelationship('org.budblocks', 'Consumer', trade.sender.ID);
    new_note.recipient = factory.newRelationship('org.budblocks', 'Consumer', trade.recipient.ID);
    new_note.field = trade.field;
    new_note.amount = trade.amount;
    new_note.experation_date = trade.experation_date;

    // add the note to the asset registry
    let assetRegistry = await getAssetRegistry('org.budblocks.Note');
    await assetRegistry.add(new_note);
    await assetRegistry.update(new_note);
    
    //add the new note to the sender and receiver's notes and outgoing notes
    trade.receiver.notes.push(factory.newRelationship('org.budblocks', 'Note', new_note.ID));
    trade.sender.outgoing_notes.push(factory.newRelationship('org.budblocks', 'Note', new_note.ID));

    //update the Consumer participant registry
    let participantRegistry = await getParticipantRegistry('org.budblocks.Consumer');
    await participantRegistry.update(trade.sender);
    await participantRegistry.update(trade.recipient);

    //emit events to sender and recipient
    let event = factory.newEvent('org.budblocks', 'NoteSent');
    event.field = new_note.field;
    event.recipient_name = new_note.recipient.name;
    event.amount = new_note.amount;
    event.expiration_date = new_note.expiration_date;
    event.date_sent = new_note.date_sent;
    emit(event);
    event = factory.newEvent('org.budblocks', 'NoteReceived');
    event.field = new_note.field;
    event.sender_name = new_note.sender.name;
    event.amount = new_note.amount;
    event.expiration_date = new_note.expiration_date;
    event.date_sent = new_note.date_sent;
    emit(event);
}

/**
 * resolve a note
 * @param {org.budblocks.resolveNote} trade - the trade to be processed
 * @transaction
 */
async function resolveNote(trade) {
    var note = trade.note;
    var sender = note.sender;
    var recipient = note.recipient;

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
    sender.outgoing_notes.splice(sender.outgoing_notes.indexOf(note), 1);
    recipient.notes.splice(recipient.notes.indexOf(note), 1);
    let participantRegistry = await getParticipantRegistry('org.budblocks.Consumer');
    await participantRegistry.update(sender);
    await participantRegistry.update(recipient);
    let assetRegistry = await getAssetRegistry('org.budblocks.Note');
    await assetRegistry.remove(note);

    // check if the note that sender just resolved was the one closest to expiration, and change if it was
    if (note == sender.earliest_note) {
        let new_earliest = sender.outgoing_notes[0];
        for (i = 0; i < sender.outgoing_notes.length; i++) {
            if (new_earliest.expiration_date.getTime() > sender.outgoing_notes[i].expiration_date.getTime()) {
                new_earliest = sender.outgoing_notes[i];
            }
        }
        sender.earliest_note = new_earliest;
        await participantRegistry.update(sender);
    }

    // create events for resolving the note, which goes to you, and paying the note which goes to the recipient
    let factory = getFactory();
    let event = factory.newEvent('org.budblocks', 'NoteResolved');
    event.field = note.field;
    event.recipient_name = note.recipient.name;
    event.amount = note.amount;
    event.expiration_date = note.expiration_date;
    event.send_date = note.send_date;
    emit(event);
    event = factory.newEvent('org.budblocks', 'NotePaid');
    event.field = note.field;
    event.sender_name = note.sender.name;
    event.amount = note.amount;
    event.expiration_date = note.expiration_date;
    event.send_date = note.send_date;
    emit(event);
}
