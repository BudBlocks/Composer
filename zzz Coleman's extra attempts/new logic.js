/**
 * add value to a buddy's balance
 * @param {org.replace_me.addBalance} deposit - add value to the user's balance
 * @transaction
 */
async function addBalance(deposit) {
    let buddy = deposit.buddy;

    let balanceRegistry = await getAssetRegistry('org.replace_me.Balance');

    buddy.balance.value = buddy.balance.value + deposit.amount;
    balanceRegistry.update(buddy.balance);

    // // below is with balance as o Integer balance within Buddy
    // let buddyRegistry = await getParticipantRegistry('org.replace_me.Buddy');

    // buddy.balance = buddy.balance + deposit.amount;
    // buddyRegistry.update(buddy);
}

 /**
 * remove value from a buddy's balance
 * @param {org.replace_me.removeBalance} withdrawl - remove value from the user's balance
 * @transaction
 */
async function removeBalance(withdrawl) {
    let buddy = withdrawl.buddy;

    let balanceRegistry = await getAssetRegistry('org.replace_me.Balance');

    if (buddy.balance.value - withdrawl.amount < 0) {
        let factory = getFactory();
        let event = factory.newEvent('org.replace_me', 'balanceTooLow');
        event.balance = buddy.balance.value;
        event.amount = withdrawl.amount;
        emit(event);
        throw new Error('Balance Too Low');
    }

    buddy.balance.value = buddy.balance.value - withdrawl.amount;
    balanceRegistry.update(withdrawl.buddy.balance);

    // // below is with balance as o Integer balance within Buddy
    // let buddyRegistry = await getParticipantRegistry('org.replace_me.Buddy');

    // if (buddy.balance - withdrawl.amount < 0) {
    //     let factory = getFactory();
    //     let event = factory.newEvent('org.replace_me', 'balanceTooLow');
    //     event.balance = buddy.balance;
    //     event.amount = withdrawl.amount;
    //     emit(event);
    //     throw new Error('Balance Too Low');
    // }

    // buddy.balance = buddy.balance - withdrawl.amount;
    // buddyRegistry.update(buddy);
}

 /**
 * send a note from one buddy to another
 * @param {org.replace_me.sendNote} note_info - the trade to be processed
 * @transaction
 */
async function sendNote(note_info) {
    let sender = note_info.sender;
    let receiver = note_info.receiver;

    if (sender.username == receiver.username) {
        throw new Error('Can\'t send note to yourself');
    }

    let noteRegistry = await getAssetRegistry('org.replace_me.Note');
    let factory = getFactory();

    if (sender.earliest_note_index > -1) {
        let earliest_note = await noteRegistry.get(sender.notes_owed[sender.earliest_note_index]); // might need to access the registry for this since lists might not be dereferenced recursively
        if ((new Date(earliest_note.expiration_date)).getTime() < note_info.timestamp.getTime()) {  // note really sure if this is a DateTime or String but just to be safe am creating new Date from it. Unclear on how casting works here, but theoretically shouldn't be affected since Integers are fine
            let event = factory.newEvent('org.replace_me', 'AccountFrozen');
            event.field = earliest_note.field;
            event.reciever_name = earliest_note.reciever.name;
            event.amount = earliest_note.amount;
            event.expiration_date = earliest_note.expiration_date;
            event.date_sent = earliest_note.date_sent;
            emit(event);
            throw new Error('Account Frozen');
        }
    }

    let note = factory.newResource('org.replace_me', 'Note', sender.username.concat('.').concat((sender.notes_sent++).to_string()));
    note.sender = factory.newRelationship('org.replace_me', 'Buddy', sender.username);
    note.receiver = factory.newRelationship('org.replace_me', 'Buddy', receiver.username);
    note.amount = note_info.amount;
    note.field = note_info.field;
    note.expiration_date = note_info.expiration_date;
    note.date_sent = note_info.timestamp;

    sender.notes_sent.push(factory.newRelationship('org.replace_me', 'Note', note.ID));
    receiver.notes_owed.push(sender.notes_sent[sender.notes_sent.length - 1]);

    if (sender.earliest_note_index > -1) {
        let earliest_note = sender.notes_owed[sender.earliest_note_index]; // might need to access the registry for this since lists might not be dereferenced recursively
        if (expiration_date.getTime() < (new Date(earliest_note.expiration_date)).getTime()) {  // note really sure if this is a DateTime or String but just to be safe am creating new Date from it. Unclear on how casting works here, but theoretically shouldn't be affected since Integers are fine
            sender.earliest_note_index = sender.notes_owed.length - 1;
        }
    }
    else {
        sender.earliest_note_index = 0;
    }

    let buddyRegistry = await getParticipantRegistry('org.replace_me.Buddy');
    buddyRegistry.update(sender);
    buddy_registry.update(recevier);

    let event = factory.newEvent('org.budblocks', 'NoteSent');
    event.field = note_info.field;
    event.sender_name = sender.name;
    event.reciever_name = receiver.name;
    event.amount = note_info.amount;
    event.expiration_date = note_info.expiration_date;
    event.date_sent = note_info.timestamp;
    emit(event);
}

 /**
 * resolve a note the user owes another buddy
 * @param {org.replace_me.resolveNote} trade - the trade to be processed
 * @transaction
 */
async function resolveNote(trade) {
    let note = trade.note; // just for ease of use
    sender = note.sender;
    receiver = note.receiver;

    
}